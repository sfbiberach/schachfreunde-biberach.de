import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = resolve(projectDir, 'content')
const manifestPath = resolve(projectDir, '.nuxt/content/manifest.ts')
const writeChanges = process.argv.includes('--write')

const collectionMatchers = [
  ['landing', path => path === 'index.yaml'],
  ['user', path => path.startsWith('users/')],
  ['snippet', path => path.startsWith('snippets/')],
  ['page', path => path.startsWith('pages/')],
  ['article', path => path.startsWith('blog/article/')],
  ['team', path => path.startsWith('mannschaften/')],
  ['tournament', path => path.startsWith('turniere/')],
]

const reservedKeys = new Set([
  'id',
  'fsPath',
  'stem',
  'extension',
  '__hash__',
  'path',
  'body',
  'meta',
  'rawbody',
])

const yamlSchema = yaml.DEFAULT_SCHEMA.extend({
  implicit: [
    new yaml.Type('tag:yaml.org,2002:timestamp', {
      kind: 'scalar',
      resolve: () => false,
      construct: data => data,
    }),
  ],
})

async function findYamlFiles(directory = contentDir) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...await findYamlFiles(path))
    }
    else if (/\.ya?ml$/.test(entry.name)) {
      files.push(path)
    }
  }

  return files
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

function cleanDocument(document) {
  const cleaned = { ...document }

  if (cleaned.navigation === true || cleaned.navigation === 'true') {
    delete cleaned.navigation
  }

  if (cleaned.seo && typeof cleaned.seo === 'object' && !Array.isArray(cleaned.seo)) {
    const seo = { ...cleaned.seo }

    if (!seo.title || seo.title === cleaned.title) {
      delete seo.title
    }
    if (!seo.description || seo.description === cleaned.description) {
      delete seo.description
    }

    if (Object.keys(seo).length === 0) {
      delete cleaned.seo
    }
    else {
      cleaned.seo = seo
    }
  }

  if (!cleaned.title) {
    delete cleaned.title
  }
  if (!cleaned.description) {
    delete cleaned.description
  }

  for (const [key, value] of Object.entries(cleaned)) {
    if (value === null || (Array.isArray(value) && value.length === 0)) {
      delete cleaned[key]
    }
  }

  return cleaned
}

function orderDocument(document, fields) {
  const ordered = {}

  for (const key of Object.keys(fields)) {
    if (!reservedKeys.has(key) && Object.hasOwn(document, key)) {
      ordered[key] = document[key]
    }
  }

  // Keep unknown fields visible. The schema validator will report them separately.
  for (const [key, value] of Object.entries(document)) {
    if (!reservedKeys.has(key) && !Object.hasOwn(ordered, key)) {
      ordered[key] = value
    }
  }

  return ordered
}

function formatYaml(source, fields) {
  const document = yaml.load(source, { schema: yamlSchema }) || {}

  if (typeof document !== 'object' || Array.isArray(document)) {
    throw new TypeError('Expected a YAML object at the document root.')
  }

  return yaml.dump(orderDocument(cleanDocument(document), fields), {
    lineWidth: -1,
  })
}

const manifest = parseManifest(await readFile(manifestPath, 'utf8'))
const files = await findYamlFiles()
const changedFiles = []
const errors = []

for (const file of files) {
  const contentPath = relative(contentDir, file).replace(/\\/g, '/')
  const collectionName = resolveCollection(contentPath)
  const fields = manifest[collectionName]?.fields

  if (!fields) {
    errors.push(`${contentPath}: generated collection schema is missing.`)
    continue
  }

  try {
    const source = await readFile(file, 'utf8')
    const formatted = formatYaml(source, fields)

    if (source !== formatted) {
      changedFiles.push(contentPath)

      if (writeChanges) {
        await writeFile(file, formatted)
      }
    }
  }
  catch (error) {
    errors.push(`${contentPath}: ${error.message}`)
  }
}

if (errors.length) {
  throw new Error(`Content formatting failed:\n\n${errors.join('\n')}`)
}

if (changedFiles.length && !writeChanges) {
  throw new Error(
    `Content files do not match Nuxt Studio's canonical YAML format:\n\n`
    + `${changedFiles.join('\n')}\n\n`
    + 'Run "pnpm content:format" to update them.',
  )
}

if (writeChanges) {
  console.log(`Formatted ${changedFiles.length} of ${files.length} YAML content files.`)
}
else {
  console.log(`Checked ${files.length} YAML content files against Nuxt Studio's canonical format.`)
}
