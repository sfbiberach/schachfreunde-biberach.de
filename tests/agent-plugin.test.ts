import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parse as parseYaml } from 'yaml'

const pluginRoot = resolve('plugins/schachfreunde-blog')
const manifestPath = resolve(pluginRoot, 'plugin.json')
const skillName = 'create-schachfreunde-blog-post'
const skillRoot = resolve(pluginRoot, 'skills', skillName)
const skillPath = resolve(skillRoot, 'SKILL.md')

const portableManifestFields = [
  '$schema',
  'author',
  'description',
  'extensions',
  'homepage',
  'keywords',
  'license',
  'name',
  'repository',
  'version',
]

describe('schachfreunde blog Agent Plugin', () => {
  it('uses the portable Agent Plugins manifest as its only manifest', () => {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, unknown>

    expect(manifest).toMatchObject({
      $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
      name: 'schachfreunde-blog',
    })
    expect(typeof manifest.version).toBe('string')
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+(?:-[\da-z.-]+)?(?:\+[\da-z.-]+)?$/i)
    expect(Object.keys(manifest).every(field => portableManifestFields.includes(field))).toBe(true)
    expect(existsSync(resolve(pluginRoot, '.codex-plugin', 'plugin.json'))).toBe(false)
  })

  it('exposes a valid Agent Skill from the fixed skills directory', () => {
    const source = readFileSync(skillPath, 'utf8')
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)

    expect(match).not.toBeNull()

    const frontmatter = parseYaml(match?.[1] ?? '') as Record<string, unknown>

    expect(frontmatter).toMatchObject({
      name: skillName,
    })
    expect(typeof frontmatter.description).toBe('string')
    expect((frontmatter.description as string).length).toBeGreaterThan(0)
    expect((frontmatter.description as string).length).toBeLessThanOrEqual(1024)
    expect(typeof frontmatter.compatibility).toBe('string')
    expect((frontmatter.compatibility as string).length).toBeLessThanOrEqual(500)
  })

  it('keeps portable references inside the skill package', () => {
    expect(existsSync(resolve(skillRoot, 'references'))).toBe(true)
    expect(existsSync(resolve(skillRoot, 'agents'))).toBe(false)
  })
})
