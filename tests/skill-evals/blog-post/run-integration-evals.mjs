/* eslint-disable no-console */
import { spawn } from 'node:child_process'
import { copyFile, cp, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { median, percentile } from './evaluator.mjs'

const evalDir = dirname(fileURLToPath(import.meta.url))
const projectDir = resolve(evalDir, '../../..')
const defaultSkillPath = resolve(projectDir, 'plugins/schachfreunde-blog/skills/create-schachfreunde-blog-post/SKILL.md')
const casesPath = resolve(evalDir, 'integration-cases.json')
const schemaPath = resolve(evalDir, 'integration-output-schema.json')
const isolationRoot = process.env.SKILL_EVAL_WORKTREE_DIR || (process.platform === 'win32' ? 'C:/tmp/sfb-blog-skill-evals' : resolve(evalDir, '.tmp/integration'))
const resultsDir = resolve(evalDir, 'results')
const pluginPrefix = 'plugins/schachfreunde-blog/'
const evalPrefix = 'tests/skill-evals/blog-post/'

function parseArguments(argv) {
  const options = { caseIds: [], dryRun: false, keepWorktrees: false, label: 'candidate-integration', model: 'gpt-5.4', outputPath: undefined, reasoning: 'low', runs: 1, skillPath: defaultSkillPath }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    const value = argv[index + 1]
    switch (argument) {
      case '--':
        break
      case '--case':
        options.caseIds.push(value)
        index += 1
        break
      case '--dry-run':
        options.dryRun = true
        break
      case '--keep-worktrees':
        options.keepWorktrees = true
        break
      case '--label':
        options.label = value
        index += 1
        break
      case '--model':
        options.model = value
        index += 1
        break
      case '--output':
        options.outputPath = resolve(projectDir, value)
        index += 1
        break
      case '--reasoning':
        options.reasoning = value
        index += 1
        break
      case '--runs':
        options.runs = Number.parseInt(value, 10)
        index += 1
        break
      case '--skill':
        options.skillPath = resolve(projectDir, value)
        index += 1
        break
      default:
        throw new Error(`Unknown argument: ${argument}`)
    }
  }
  if (!Number.isInteger(options.runs) || options.runs < 1) {
    throw new Error('--runs must be a positive integer')
  }
  return options
}

function runProcess(executable, args, cwd, captureJson = false) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(executable, args, { cwd, env: process.env, shell: false, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
    let stdout = ''
    let stderr = ''
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', reject)
    child.on('close', code => resolveRun({ code, stdout, stderr, events: captureJson ? parseJsonLines(stdout) : [] }))
  })
}

function parseJsonLines(stdout) {
  return stdout.split(/\r?\n/).filter(Boolean).map((line) => {
    try {
      return JSON.parse(line)
    }
    catch {
      return undefined
    }
  }).filter(Boolean)
}

function metricsFrom(events, durationMs) {
  const usage = [...events].reverse().find(event => event.type === 'turn.completed')?.usage || {}
  const inputTokens = usage.input_tokens || 0
  const cachedInputTokens = usage.cached_input_tokens || 0
  const toolCalls = events.filter(event => event.type?.startsWith('item.') && ['command_execution', 'mcp_tool_call', 'web_search'].includes(event.item?.type)).length
  return {
    durationMs: Math.round(durationMs),
    inputTokens,
    cachedInputTokens,
    uncachedInputTokens: Math.max(inputTokens - cachedInputTokens, 0),
    outputTokens: usage.output_tokens || 0,
    reasoningTokens: usage.reasoning_output_tokens || 0,
    toolCalls,
  }
}

function buildPrompt(skillPath, testCase) {
  return `Use the skill at ${skillPath} to perform the user request in this isolated integration-test repository.

Test constraints that override the workflow only for external side effects:
- The user explicitly wants a local draft only.
- Do not use the network, web search, GitHub, external connectors, or Nuxt Studio.
- Do not create a branch, commit, push, or pull request.
- Do not run pnpm, npm, build, lint, or test commands; the evaluator performs deterministic checks afterward.
- Modify only files necessary for the request and preserve unrelated existing changes.
- If required facts remain genuinely ambiguous, do not create an article and return one bundled question.
- Finish with JSON matching the supplied schema.

User request:
${testCase.prompt}`
}

function parseStatusPaths(output) {
  return output.split(/\r?\n/).filter(Boolean).map(line => line.slice(3).replace(/\\/g, '/'))
}

function frontmatterKeys(source) {
  const match = source.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/)
  if (!match) {
    return []
  }
  return match[1].split('\n').filter(line => /^[A-Z][\w-]*:/i.test(line)).map(line => line.slice(0, line.indexOf(':')))
}

function expectedFrontmatterKeys(keys) {
  return [...keys].sort((left, right) => {
    if (left === 'title') {
      return -1
    }
    if (right === 'title') {
      return 1
    }
    return left.localeCompare(right, 'en')
  })
}

async function evaluateWorktree(worktree, testCase, actual, statusOutput, preservedSources) {
  const failures = []
  const expected = testCase.expected
  if (actual.status !== expected.status) {
    failures.push(`status: expected ${expected.status}, received ${actual.status}`)
  }
  if (expected.minQuestions !== undefined && actual.questions.length < expected.minQuestions) {
    failures.push(`questions: expected at least ${expected.minQuestions}, received ${actual.questions.length}`)
  }
  if (expected.maxQuestions !== undefined && actual.questions.length > expected.maxQuestions) {
    failures.push(`questions: expected at most ${expected.maxQuestions}, received ${actual.questions.length}`)
  }

  const preservedPaths = new Set(Object.keys(preservedSources))
  const changed = parseStatusPaths(statusOutput).filter(path => !path.startsWith(pluginPrefix) && !preservedPaths.has(path))
  const unexpected = changed.filter(path => !expected.allowedFiles.includes(path))
  if (unexpected.length) {
    failures.push(`unexpected files: ${unexpected.join(', ')}`)
  }

  for (const [path, original] of Object.entries(preservedSources)) {
    try {
      const current = await readFile(resolve(worktree, path))
      if (!current.equals(original)) {
        failures.push(`${path}: pre-existing user change was modified`)
      }
    }
    catch (error) {
      failures.push(`${path}: pre-existing user change missing (${error.message})`)
    }
  }

  for (const requiredFile of expected.requiredFiles) {
    try {
      await stat(resolve(worktree, requiredFile))
    }
    catch {
      failures.push(`missing file: ${requiredFile}`)
    }
  }

  for (const assertion of expected.contentAssertions) {
    try {
      const source = (await readFile(resolve(worktree, assertion.path), 'utf8')).replace(/\r\n/g, '\n')
      for (const value of assertion.includes || []) {
        if (!source.includes(value)) {
          failures.push(`${assertion.path}: missing ${JSON.stringify(value)}`)
        }
      }
      for (const value of assertion.excludes || []) {
        if (source.includes(value)) {
          failures.push(`${assertion.path}: contains ${JSON.stringify(value)}`)
        }
      }
      if (assertion.frontmatterOrder) {
        const keys = frontmatterKeys(source)
        if (keys.join('\0') !== expectedFrontmatterKeys(keys).join('\0')) {
          failures.push(`${assertion.path}: invalid frontmatter order`)
        }
      }
      if (assertion.exactReplacement) {
        const fixture = (await readFile(resolve(evalDir, assertion.exactReplacement.source), 'utf8')).replace(/\r\n/g, '\n')
        const expectedSource = fixture.replace(assertion.exactReplacement.search, assertion.exactReplacement.replace)
        if (source !== expectedSource) {
          failures.push(`${assertion.path}: content changed beyond the requested replacement`)
        }
      }
    }
    catch (error) {
      failures.push(`${assertion.path}: ${error.message}`)
    }
  }

  return { passed: failures.length === 0, failures, changedFiles: changed }
}

async function copyTrackedRepository(target, options) {
  const listed = await runProcess('git', ['ls-files', '-z'], projectDir)
  if (listed.code !== 0) {
    throw new Error(`git ls-files failed: ${listed.stderr}`)
  }

  const paths = listed.stdout.split('\0').filter(Boolean).filter(path => !path.replace(/\\/g, '/').startsWith(evalPrefix))
  for (const path of paths) {
    const source = resolve(projectDir, path)
    const destination = resolve(target, path)
    try {
      await stat(source)
    }
    catch {
      continue
    }
    await mkdir(dirname(destination), { recursive: true })
    await copyFile(source, destination)
  }

  const targetSkillDir = resolve(target, 'plugins/schachfreunde-blog/skills/create-schachfreunde-blog-post')
  await rm(targetSkillDir, { recursive: true, force: true })
  await mkdir(dirname(targetSkillDir), { recursive: true })
  await cp(dirname(options.skillPath), targetSkillDir, { recursive: true })
}

async function prepareSanitizedSeed(options) {
  await mkdir(isolationRoot, { recursive: true })
  const root = await mkdtemp(resolve(isolationRoot, `${options.label.replace(/[^a-z0-9.-]/gi, '-')}-`))
  const seed = resolve(root, 'seed')
  await mkdir(seed, { recursive: true })
  await copyTrackedRepository(seed, options)

  for (const [args, description] of [
    [['init', '--quiet'], 'git init'],
    [['add', '--all'], 'git add'],
    [['-c', 'user.name=Skill Eval', '-c', 'user.email=skill-eval@example.invalid', 'commit', '--quiet', '-m', 'test: sanitized repository fixture'], 'git commit'],
  ]) {
    const result = await runProcess('git', args, seed)
    if (result.code !== 0) {
      throw new Error(`${description} failed: ${result.stderr}`)
    }
  }

  return { root, seed }
}

async function prepareWorktree(testCase, options, attemptIndex) {
  const safeId = `${testCase.id}-${attemptIndex}-${Date.now()}`.replace(/[^a-z0-9.-]/gi, '-')
  const worktree = resolve(options.isolatedRoot, safeId)
  const relativeWorktree = relative(options.isolatedRoot, worktree)
  if (!relativeWorktree || relativeWorktree.startsWith('..') || isAbsolute(relativeWorktree)) {
    throw new Error(`Unsafe worktree path: ${worktree}`)
  }

  const cloned = await runProcess('git', ['clone', '--quiet', '--no-hardlinks', options.seedDir, worktree], options.isolatedRoot)
  if (cloned.code !== 0) {
    throw new Error(`git clone failed: ${cloned.stderr}`)
  }

  const fixtures = [testCase.fixture, ...(testCase.fixtures || [])].filter(Boolean)
  for (const fixture of fixtures) {
    const fixtureTarget = resolve(worktree, fixture.target)
    await mkdir(dirname(fixtureTarget), { recursive: true })
    await copyFile(resolve(evalDir, fixture.source), fixtureTarget)
  }

  const preservedSources = {}
  for (const fixture of testCase.preservedFixtures || []) {
    const fixtureTarget = resolve(worktree, fixture.target)
    await mkdir(dirname(fixtureTarget), { recursive: true })
    await copyFile(resolve(evalDir, fixture.source), fixtureTarget)
    preservedSources[fixture.target.replace(/\\/g, '/')] = await readFile(fixtureTarget)
  }

  return { worktree, preservedSources }
}

async function runCase(testCase, options, attemptIndex) {
  let worktree
  try {
    const prepared = await prepareWorktree(testCase, options, attemptIndex)
    worktree = prepared.worktree
    const outputPath = resolve(worktree, '.skill-eval-result.json')
    const codexScript = process.env.CODEX_JS || resolve(process.env.APPDATA || '', 'npm/node_modules/@openai/codex/bin/codex.js')
    const executable = process.env.CODEX_BIN || (process.platform === 'win32' ? process.execPath : 'codex')
    const skillPath = resolve(worktree, 'plugins/schachfreunde-blog/skills/create-schachfreunde-blog-post/SKILL.md')
    const args = [
      'exec',
      '--ephemeral',
      '--sandbox',
      'workspace-write',
      '-c',
      'approval_policy="never"',
      '-c',
      'service_tier="fast"',
      '-c',
      `model_reasoning_effort="${options.reasoning}"`,
      '--model',
      options.model,
      '--json',
      '--output-schema',
      schemaPath,
      '--output-last-message',
      outputPath,
      '--cd',
      worktree,
      buildPrompt(skillPath, testCase),
    ]
    const startedAt = performance.now()
    const commandArgs = process.platform === 'win32' && !process.env.CODEX_BIN ? [codexScript, ...args] : args
    const run = await runProcess(executable, commandArgs, worktree, true)
    const metrics = metricsFrom(run.events, performance.now() - startedAt)
    if (run.code !== 0) {
      return { error: `codex exited with ${run.code}: ${run.stderr.trim()}`, metrics }
    }

    const actual = JSON.parse(await readFile(outputPath, 'utf8'))
    await rm(outputPath, { force: true })
    const status = await runProcess('git', ['status', '--short', '--untracked-files=all'], worktree)
    return { actual, evaluation: await evaluateWorktree(worktree, testCase, actual, status.stdout, prepared.preservedSources), metrics }
  }
  catch (error) {
    return { error: error.message, metrics: { durationMs: 0, inputTokens: 0, cachedInputTokens: 0, uncachedInputTokens: 0, outputTokens: 0, reasoningTokens: 0, toolCalls: 0 } }
  }
  finally {
    if (worktree && !options.keepWorktrees) {
      await rm(worktree, { recursive: true, force: true })
    }
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  const allCases = JSON.parse(await readFile(casesPath, 'utf8'))
  const cases = options.caseIds.length ? allCases.filter(testCase => options.caseIds.includes(testCase.id)) : allCases
  if (!cases.length) {
    throw new Error('No matching integration eval cases selected')
  }

  const isolated = await prepareSanitizedSeed(options)
  options.isolatedRoot = isolated.root
  options.seedDir = isolated.seed
  const results = []
  try {
    if (options.dryRun) {
      const status = await runProcess('git', ['status', '--porcelain'], isolated.seed)
      if (status.code !== 0 || status.stdout.trim()) {
        throw new Error(`Sanitized seed is not clean: ${status.stderr || status.stdout}`)
      }
      try {
        await stat(resolve(isolated.seed, evalPrefix))
        throw new Error('Sanitized seed still contains eval definitions')
      }
      catch (error) {
        if (error.code !== 'ENOENT') {
          throw error
        }
      }
      console.log(`Validated ${cases.length} integration cases and a clean expectation-free repository seed.`)
      return
    }

    for (const testCase of cases) {
      for (let attemptIndex = 1; attemptIndex <= options.runs; attemptIndex += 1) {
        console.log(`Running integration case ${testCase.id} (${attemptIndex}/${options.runs})...`)
        results.push({ id: testCase.id, attempt: attemptIndex, ...await runCase(testCase, options, attemptIndex) })
      }
    }

    const successful = results.filter(result => !result.error)
    const passed = successful.filter(result => result.evaluation.passed)
    const report = {
      metadata: { generatedAt: new Date().toISOString(), label: options.label, model: options.model, reasoning: options.reasoning, runs: options.runs, isolated: true, skillPath: options.skillPath },
      cases: results,
      totals: {
        cases: cases.length,
        attempts: results.length,
        completed: successful.length,
        passed: passed.length,
        passRate: results.length ? passed.length / results.length : 0,
        medianDurationMs: median(successful.map(result => result.metrics.durationMs)),
        p95DurationMs: percentile(successful.map(result => result.metrics.durationMs), 0.95),
        medianInputTokens: median(successful.map(result => result.metrics.inputTokens)),
        medianCachedInputTokens: median(successful.map(result => result.metrics.cachedInputTokens)),
        medianUncachedInputTokens: median(successful.map(result => result.metrics.uncachedInputTokens)),
        p95UncachedInputTokens: percentile(successful.map(result => result.metrics.uncachedInputTokens), 0.95),
        medianOutputTokens: median(successful.map(result => result.metrics.outputTokens)),
        medianToolCalls: median(successful.map(result => result.metrics.toolCalls)),
      },
    }

    console.table(results.map(result => ({ id: result.id, attempt: result.attempt, passed: result.evaluation?.passed || false, durationMs: result.metrics.durationMs, uncachedInputTokens: result.metrics.uncachedInputTokens, outputTokens: result.metrics.outputTokens })))
    for (const result of results) {
      if (result.error) {
        console.error(`${result.id} (${result.attempt}): ${result.error}`)
      }
      else if (!result.evaluation.passed) {
        console.error(`${result.id} (${result.attempt}): ${result.evaluation.failures.join('; ')}`)
      }
    }

    const outputPath = options.outputPath || resolve(resultsDir, `${options.label}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    console.log(`Saved ${outputPath}`)
    if (report.totals.passed !== report.totals.attempts) {
      process.exitCode = 1
    }
  }
  finally {
    if (!options.keepWorktrees) {
      await rm(isolated.root, { recursive: true, force: true })
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
