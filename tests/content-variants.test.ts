import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parse as parseYaml } from 'yaml'

const projectUrl = new URL('../', import.meta.url)
const contentConfig = readFileSync(new URL('content.config.ts', projectUrl), 'utf8')
const catchAllPage = readFileSync(new URL('app/pages/[...slug].vue', projectUrl), 'utf8')
const appConfig = readFileSync(new URL('app/app.config.ts', projectUrl), 'utf8')
const contentValidator = readFileSync(new URL('scripts/validate-content.mjs', projectUrl), 'utf8')

function readFrontmatter(path: string): Record<string, unknown> {
  const source = readFileSync(new URL(path, projectUrl), 'utf8')
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (!match?.[1]) {
    throw new Error(`Missing frontmatter in ${path}`)
  }

  return parseYaml(match[1]) as Record<string, unknown>
}

describe('content variant collections', () => {
  it('defines separate schemas for content and interface-led pages', () => {
    expect(contentConfig).toContain('include: \'legal/**/*.{md,yaml}\'')
    expect(contentConfig).toContain('mergeVariantSchemas([\'content\'], siteVariantSchemas)')
    expect(contentConfig).toContain('mergeVariantSchemas([\'page\'], siteVariantSchemas)')
  })

  it('binds the legal catch-all route to the content collection', () => {
    expect(catchAllPage).toContain('usePageContent({ collection: \'content\' })')
    expect(catchAllPage).toContain('<NuxtLayout name="content" collection="content">')
  })

  it.each(['impressum', 'datenschutz'])('declares toc for the %s content page', (slug) => {
    expect(readFrontmatter(`content/legal/${slug}.md`).toc).toBe(true)
  })

  it.each(['blog', 'kontakt', 'mannschaften', 'turniere'])('keeps toc out of the %s page schema', (slug) => {
    const document = parseYaml(readFileSync(new URL(`content/pages/${slug}.yaml`, projectUrl), 'utf8')) as Record<string, unknown>
    expect(document).not.toHaveProperty('toc')
  })

  it('keeps legal content searchable and requires explicit toc metadata', () => {
    expect(appConfig).toMatch(/collections:\s*\[\s*\{ name: 'page' \},\s*\{ name: 'content' \}/)
    expect(contentValidator).toContain('content: [\'toc\']')
  })
})
