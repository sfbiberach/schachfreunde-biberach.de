import { Buffer } from 'node:buffer'
import { mkdir, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import process from 'node:process'
import { load } from 'cheerio'
import { withNuxtDevServer } from './media-server.mjs'

const dimensions = {
  og: [1200, 630],
  square: [1080, 1080],
  portrait: [1080, 1350],
}

const args = parseArgs(process.argv.slice(2))
const formats = args.format === 'all' ? Object.keys(dimensions) : [args.format]
const outputDirectory = resolve(args.output)

await withNuxtDevServer(async (baseUrl) => {
  await mkdir(outputDirectory, { recursive: true })

  for (const format of formats) {
    const pageUrl = new URL(args.path, baseUrl)
    pageUrl.searchParams.set('__socialFormat', format)
    const pageResponse = await fetch(pageUrl)
    if (!pageResponse.ok) {
      throw new Error(`Seite ${pageUrl.pathname} antwortete mit HTTP ${pageResponse.status}.`)
    }

    const $ = load(await pageResponse.text())
    const imageReference = $('meta[property="og:image"]').first().attr('content')
    if (!imageReference) {
      throw new Error(`Auf ${pageUrl.pathname} wurde kein og:image gefunden.`)
    }

    const imageUrl = new URL(imageReference, baseUrl)
    if (imageUrl.hostname !== '127.0.0.1' && imageUrl.hostname !== 'localhost') {
      imageUrl.protocol = 'http:'
      imageUrl.hostname = '127.0.0.1'
      imageUrl.port = new URL(baseUrl).port
    }
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`OG-Bild antwortete mit HTTP ${imageResponse.status}: ${imageUrl}`)
    }

    const image = Buffer.from(await imageResponse.arrayBuffer())
    const actual = readPngDimensions(image)
    const expected = dimensions[format]
    if (actual.width !== expected[0] || actual.height !== expected[1]) {
      throw new Error(`Unerwartete Größe für ${format}: ${actual.width}×${actual.height} statt ${expected.join('×')}.`)
    }

    const fileName = `${routeFileName(args.path)}-${format}.png`
    const outputPath = resolve(outputDirectory, fileName)
    await writeFile(outputPath, image)
    console.info(`✓ ${format}: ${outputPath}`)
  }
})

function parseArgs(values) {
  const parsed = { format: 'all', output: '.artifacts/social' }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--') {
      continue
    }
    if (value === '--path') {
      parsed.path = values[++index]
    }
    else if (value.startsWith('--path=')) {
      parsed.path = value.slice(7)
    }
    else if (value === '--format') {
      parsed.format = values[++index]
    }
    else if (value.startsWith('--format=')) {
      parsed.format = value.slice(9)
    }
    else if (value === '--output') {
      parsed.output = values[++index]
    }
    else if (value.startsWith('--output=')) {
      parsed.output = value.slice(9)
    }
    else {
      throw new Error(`Unbekanntes Argument: ${value}`)
    }
  }

  if (!parsed.path?.startsWith('/') || parsed.path.startsWith('//') || parsed.path.includes('://')) {
    throw new Error('Bitte eine lokale Route mit --path /route angeben.')
  }
  if (!(parsed.format in dimensions) && parsed.format !== 'all') {
    throw new Error('--format muss og, square, portrait oder all sein.')
  }
  return parsed
}

function routeFileName(routePath) {
  const clean = routePath.split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, '')
  return (clean || 'startseite')
    .split('/')
    .map(segment => basename(segment))
    .join('-')
    .replace(/[^a-z0-9äöüß-]+/gi, '-')
    .toLocaleLowerCase('de-DE')
}

function readPngDimensions(buffer) {
  const signature = '89504e470d0a1a0a'
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) {
    throw new Error('Der Renderer lieferte keine gültige PNG-Datei.')
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}
