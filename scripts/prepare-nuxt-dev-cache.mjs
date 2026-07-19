import { lstat, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const payloadCachePath = resolve('.nuxt/cache/nuxt/payload')

try {
  const cacheEntry = await lstat(payloadCachePath)

  if (cacheEntry.isFile()) {
    await rm(payloadCachePath)
    console.info('Migrated legacy Nuxt payload cache.')
  }
  else if (!cacheEntry.isDirectory()) {
    throw new Error(`Unexpected Nuxt payload cache entry at ${payloadCachePath}`)
  }
}
catch (error) {
  if (error?.code !== 'ENOENT') {
    throw error
  }
}

await mkdir(payloadCachePath, { recursive: true })
