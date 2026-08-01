import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { resolve } from 'node:path'
import process from 'node:process'

export async function withNuxtDevServer(callback) {
  const port = await findFreePort()
  const baseUrl = `http://127.0.0.1:${port}`
  await import('./prepare-nuxt-dev-cache.mjs')

  const nuxtCli = resolve('node_modules/nuxt/bin/nuxt.mjs')
  const output = []
  const child = spawn(process.execPath, [nuxtCli, 'dev', '--host', '127.0.0.1', '--port', String(port)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NUXT_LOCK: '1',
      NUXT_MEDIA_PREVIEW: '1',
      NUXT_SITE_URL: baseUrl,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  })

  child.stdout.on('data', chunk => rememberOutput(output, chunk))
  child.stderr.on('data', chunk => rememberOutput(output, chunk))

  try {
    await waitUntilReady(baseUrl, child, output)
    return await callback(baseUrl)
  }
  finally {
    await stopProcess(child)
  }
}

function findFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer()
    server.unref()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : undefined
      server.close(error => error ? reject(error) : resolvePort(port))
    })
  })
}

async function waitUntilReady(baseUrl, child, output) {
  const deadline = Date.now() + 90_000
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Nuxt wurde vorzeitig beendet.\n${output.join('')}`)
    }
    try {
      const response = await fetch(baseUrl, { redirect: 'manual' })
      if (response.status < 500) {
        return
      }
    }
    catch {
      // Server is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  throw new Error(`Nuxt war nach 90 Sekunden nicht erreichbar.\n${output.join('')}`)
}

function rememberOutput(output, chunk) {
  output.push(String(chunk))
  if (output.length > 80) {
    output.shift()
  }
}

function stopProcess(child) {
  if (child.exitCode !== null) {
    return Promise.resolve()
  }
  child.kill('SIGTERM')
  return new Promise((resolveStop) => {
    const timer = setTimeout(() => {
      if (child.exitCode === null) {
        child.kill('SIGKILL')
      }
      resolveStop()
    }, 5_000)
    child.once('exit', () => {
      clearTimeout(timer)
      resolveStop()
    })
  })
}
