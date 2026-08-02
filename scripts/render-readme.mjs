import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'
import { withNuxtDevServer } from './media-server.mjs'

const outputPath = resolve('.github/assets/readme-homepage.png')
await mkdir(dirname(outputPath), { recursive: true })

async function waitForFont(locator, family, weights) {
  await locator.evaluate(async (_element, options) => {
    const normalizeFamily = value => value.replaceAll('"', '').replaceAll('\'', '')
    const deadline = Date.now() + 20_000
    let faces = []

    while (Date.now() < deadline) {
      faces = [...document.fonts].filter(font => normalizeFamily(font.family) === options.family)
      if (faces.length > 0) {
        break
      }
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    if (faces.length === 0) {
      throw new Error(`Nuxt Fonts did not register ${options.family} before the README render.`)
    }

    await Promise.all(options.weights.map(weight => document.fonts.load(`${weight} 16px "${options.family}"`)))
    await document.fonts.ready
  }, { family, weights })
}

await withNuxtDevServer(async (baseUrl) => {
  let browser
  try {
    browser = await chromium.launch({ headless: true })
  }
  catch (error) {
    throw new Error(`Chromium is missing. Run "pnpm exec playwright install chromium" once.\n${error.message}`)
  }

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.addInitScript(() => localStorage.setItem('nuxt-color-mode', 'dark'))
    await page.goto(`${baseUrl}/__media/readme`, { waitUntil: 'domcontentloaded', timeout: 60_000 })

    const art = page.locator('#readme-art')
    await art.waitFor({ state: 'visible' })

    const siteFrame = page.frameLocator('#readme-site')
    const siteBody = siteFrame.locator('body')
    await siteBody.waitFor({ state: 'visible', timeout: 60_000 })
    await siteFrame.locator('.club-pulse h2').waitFor({ state: 'visible', timeout: 30_000 })

    await siteBody.evaluate(async (body) => {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }

      body.style.scrollbarWidth = 'none'
      const style = document.createElement('style')
      style.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}*:focus,*:focus-visible{outline:none!important;box-shadow:none!important}.club-pulse>a{border-color:rgba(96,165,250,.32)!important}::-webkit-scrollbar{display:none}'
      document.head.append(style)
    })

    await Promise.all([
      waitForFont(art, 'Inter', [400, 700]),
      waitForFont(siteBody, 'Inter', [400, 700]),
      waitForFont(siteBody, 'Lora', [400, 700]),
      siteFrame.locator('img').evaluateAll(images => Promise.all(images.map(image => image.complete
        ? Promise.resolve()
        : new Promise(resolve => image.addEventListener('load', resolve, { once: true }))))),
    ])

    const headingFonts = await siteBody.evaluate(() => {
      const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
      const heroHeading = headings.find(heading => !heading.closest('.club-pulse') && heading.getBoundingClientRect().height > 0)
      const pulseHeading = document.querySelector('.club-pulse h2')
      return [heroHeading, pulseHeading]
        .filter(heading => heading instanceof HTMLElement)
        .map(heading => getComputedStyle(heading).fontFamily)
    })

    if (headingFonts.length !== 2 || headingFonts.some(font => !font.toLowerCase().includes('lora'))) {
      throw new Error(`README render requires Lora for its primary headings (received: ${headingFonts.join(', ')}).`)
    }

    const activityCards = siteFrame.locator('#vereinsleben a')
    const activityCardCount = await activityCards.count()
    const activityCardBoxes = await activityCards.evaluateAll(cards => cards.map((card) => {
      const rect = card.getBoundingClientRect()
      return { top: rect.top, bottom: rect.bottom }
    }))
    const visibleSiteHeight = await page.locator('#readme-site').evaluate((frame) => {
      const scale = new DOMMatrixReadOnly(getComputedStyle(frame).transform).a
      return (frame.parentElement?.clientHeight || 0) / scale
    })
    const activityCardsBottom = Math.max(...activityCardBoxes.map(card => card.bottom))

    if (activityCardCount !== 4 || activityCardsBottom > visibleSiteHeight) {
      throw new Error(`README render must include all four activity cards (found ${activityCardCount}, cards end at ${activityCardsBottom}px, visible site height ${visibleSiteHeight}px).`)
    }

    await page.waitForTimeout(800)
    await art.screenshot({ path: outputPath, animations: 'disabled' })
    console.info(`README: ${outputPath}`)
  }
  finally {
    await browser.close()
  }
})
