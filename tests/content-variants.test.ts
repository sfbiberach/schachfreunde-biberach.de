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

function readYaml(path: string): Record<string, unknown> {
  return parseYaml(readFileSync(new URL(path, projectUrl), 'utf8')) as Record<string, unknown>
}

describe('content variant collections', () => {
  it('uses the same content schema for legal and interface-led pages', () => {
    expect(contentConfig).toContain('include: \'legal/**/*.{md,yaml}\'')
    expect(contentConfig).toContain('include: \'pages/**/*.{md,yaml}\'')
    expect(contentConfig.match(/mergeVariantSchemas\(\['content'\], siteVariantSchemas\)/g)).toHaveLength(2)
    expect(contentConfig).not.toContain('mergeVariantSchemas([\'page\'], siteVariantSchemas)')
  })

  it('binds the legal catch-all route to the shared content layout', () => {
    expect(catchAllPage).toContain('usePageContent({ collection: \'content\' })')
    expect(catchAllPage).toContain('<NuxtLayout name="content" collection="content">')
  })

  it.each(['impressum', 'datenschutz'])('declares toc for the %s content page', (slug) => {
    expect(readFrontmatter(`content/legal/${slug}.md`).toc).toBe(true)
  })

  it.each(['blog', 'kontakt', 'mannschaften', 'turniere'])('disables toc explicitly for the %s interface page', (slug) => {
    expect(readYaml(`content/pages/${slug}.yaml`).toc).toBe(false)
  })

  it('keeps both page collections searchable and validates explicit toc metadata', () => {
    expect(appConfig).toMatch(/collections:\s*\[\s*\{ name: 'page' \},\s*\{ name: 'content' \}/)
    expect(contentValidator).toContain('content: [\'toc\']')
    expect(contentValidator).toContain('page: [\'toc\']')
  })
})
