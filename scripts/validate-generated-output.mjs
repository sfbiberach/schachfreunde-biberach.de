import { access, readdir, readFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = resolve(rootDir, '.output/public')

async function assertPayloadReferences(directory = publicDir) {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const filePath = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      await assertPayloadReferences(filePath)
      continue
    }

    if (!entry.name.endsWith('.html')) {
      continue
    }

    const html = await readFile(filePath, 'utf8')
    const payloadSources = html.matchAll(/data-src="([^"?]*\/_payload\.json)(?:\?[^"?]*)?"/g)

    for (const [, source] of payloadSources) {
      const payloadPath = resolve(publicDir, source.replace(/^\/+/, ''))

      try {
        await access(payloadPath)
      }
      catch (error) {
        if (error.code === 'ENOENT') {
          throw new Error(`Generated HTML ${relative(publicDir, filePath)} references missing payload: ${source}`)
        }

        throw error
      }
    }
  }
}

async function readRoute(route) {
  const candidates = route
    ? [resolve(publicDir, `${route}.html`), resolve(publicDir, route, 'index.html')]
    : [resolve(publicDir, 'index.html')]

  for (const candidate of candidates) {
    try {
      return await readFile(candidate, 'utf8')
    }
    catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  }

  throw new Error(`Generated route is missing: /${route}`)
}

async function assertRoute(route, expected) {
  const html = await readRoute(route)

  for (const needle of expected) {
    if (!html.includes(needle)) {
      throw new Error(`Generated route /${route} is missing ${needle}`)
    }
  }
}

await assertRoute('', ['<header', '<main', '<footer', 'SF HN-Biberach'])
await assertRoute('impressum', ['Impressum'])
await assertRoute('datenschutz', ['Datenschutz'])

const endpoints = [
  'api/navigation.json',
  'api/search.json',
  'blog/rss.xml',
  'sitemap.xml',
  'manifest.webmanifest',
]

for (const endpoint of endpoints) {
  try {
    await readFile(resolve(publicDir, endpoint))
  }
  catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Generated endpoint is missing: /${endpoint}`)
    }

    throw error
  }
}

await assertPayloadReferences()

console.log('Validated the generated site shell, legal routes, public endpoints, and payload references.')
