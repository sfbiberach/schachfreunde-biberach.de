import { readdir, readFile } from 'node:fs/promises'
import { dirname, extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = resolve(projectDir, 'content')
const manifestPath = resolve(projectDir, '.nuxt/content/manifest.ts')

const collectionMatchers = [
  ['landing', path => path === 'index.yaml'],
  ['user', path => path.startsWith('users/')],
  ['snippet', path => path.startsWith('snippets/')],
  ['page', path => path.startsWith('pages/')],
  ['article', path => path.startsWith('blog/article/')],
  ['team', path => path.startsWith('mannschaften/')],
  ['tournament', path => path.startsWith('turniere/')],
]

const requiredFields = {
  landing: ['hero'],
  user: ['username'],
}

const fieldValidators = {
  boolean: value => typeof value === 'boolean',
  date: value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value),
  integer: value => Number.isInteger(value),
  json: value => value !== undefined,
  number: value => typeof value === 'number' && Number.isFinite(value),
  string: value => typeof value === 'string',
}

async function findContentFiles(directory = contentDir) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...await findContentFiles(path))
    }
    else if (/\.(?:json|md|ya?ml)$/.test(entry.name)) {
      files.push(path)
    }
  }

  return files
}

function parseMarkdownFrontmatter(source) {
  const match = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  return match ? parseYaml(match[1]) : {}
}

function parseContentFile(path, source) {
  switch (extname(path)) {
    case '.json':
      return JSON.parse(source)
    case '.md':
      return parseMarkdownFrontmatter(source)
    case '.yaml':
    case '.yml':
      return parseYaml(source)
    default:
      return {}
  }
}

function resolveCollection(path) {
  return collectionMatchers.find(([, matches]) => matches(path))?.[0]
}

function parseManifest(source) {
  const marker = 'export default '
  const start = source.indexOf(marker)

  if (start === -1) {
    throw new Error('Generated Nuxt Content manifest has an unexpected format.')
  }

  return JSON.parse(source.slice(start + marker.length))
}

const manifest = parseManifest(await readFile(manifestPath, 'utf8'))
const errors = []
const files = await findContentFiles()

for (const file of files) {
  const contentPath = relative(contentDir, file).replace(/\\/g, '/')
  const collectionName = resolveCollection(contentPath)

  if (!collectionName) {
    errors.push(`${contentPath}: file is not assigned to a known collection.`)
    continue
  }

  try {
    const document = parseContentFile(file, await readFile(file, 'utf8')) || {}
    const fields = manifest[collectionName]?.fields

    if (!fields) {
      errors.push(`${contentPath}: generated schema for collection "${collectionName}" is missing.`)
      continue
    }

    for (const field of requiredFields[collectionName] || []) {
      if (document[field] === undefined) {
        errors.push(`${contentPath}: required field "${field}" is missing.`)
      }
    }

    for (const [field, value] of Object.entries(document)) {
      const type = fields[field]

      if (!type) {
        errors.push(`${contentPath}: field "${field}" is not declared in the ${collectionName} collection schema.`)
        continue
      }

      const validate = fieldValidators[type]

      if (!validate) {
        errors.push(`${contentPath}: generated field type "${type}" for "${field}" is not supported by the validator.`)
      }
      else if (!validate(value)) {
        errors.push(`${contentPath}: field "${field}" must be ${type}, received ${Array.isArray(value) ? 'array' : typeof value}.`)
      }
    }
  }
  catch (error) {
    errors.push(`${contentPath}: ${error.message}`)
  }
}

if (errors.length) {
  throw new Error(`Content schema validation failed:\n\n${errors.join('\n')}`)
}

console.log(`Validated ${files.length} content files against the generated Nuxt Content manifest.`)
