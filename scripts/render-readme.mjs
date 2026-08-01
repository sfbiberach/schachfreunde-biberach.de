import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'
import { withNuxtDevServer } from './media-server.mjs'

const outputPath = resolve('.github/assets/readme-homepage.png')
await mkdir(dirname(outputPath), { recursive: true })

await withNuxtDevServer(async (baseUrl) => {
  let browser
  try {
    browser = await chromium.launch({ headless: true })
  }
  catch (error) {
    throw new Error(`Chromium fehlt. Einmalig \"pnpm exec playwright install chromium\" ausführen.\n${error.message}`)
  }

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
    await page.goto(`${baseUrl}/__media/readme`, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    const art = page.locator('#readme-art')
    await art.waitFor({ state: 'visible' })

    const siteFrame = page.frameLocator('#readme-site')
    await siteFrame.locator('body').waitFor({ state: 'visible', timeout: 60_000 })
    await page.evaluate(() => document.fonts.ready)
    await siteFrame.locator('body').evaluate(async (body) => {
      await document.fonts.ready
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      body.style.scrollbarWidth = 'none'
      const style = document.createElement('style')
      style.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}*:focus,*:focus-visible{outline:none!important;box-shadow:none!important}.club-pulse>a{border-color:rgba(96,165,250,.32)!important}::-webkit-scrollbar{display:none}'
      document.head.append(style)
    })
    await page.waitForTimeout(1_200)
    await art.screenshot({ path: outputPath, animations: 'disabled' })
    console.info(`✓ README: ${outputPath}`)
  }
  finally {
    await browser.close()
  }
})
