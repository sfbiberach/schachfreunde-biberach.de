/* eslint-disable no-console */
import { spawn } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { compareSummaries, evaluateResult, summarizeAttempts } from './evaluator.mjs'

const evalDir = dirname(fileURLToPath(import.meta.url))
const projectDir = resolve(evalDir, '../../..')
const defaultSkillPath = resolve(projectDir, 'plugins/schachfreunde-blog/skills/create-schachfreunde-blog-post/SKILL.md')
const casesPath = resolve(evalDir, 'cases.json')
const schemaPath = resolve(evalDir, 'output-schema.json')
const isolationRoot = process.env.SKILL_EVAL_ISOLATION_DIR || (process.platform === 'win32' ? 'C:/tmp/sfb-blog-skill-routing' : resolve(evalDir, '.tmp/routing'))
const resultsDir = resolve(evalDir, 'results')
let activeExecutionDir

function parseArguments(argv) {
  const options = {
    allowFailures: false,
    caseIds: [],
    comparePath: undefined,
    dryRun: false,
    label: 'candidate',
    model: 'gpt-5.4',
    outputPath: undefined,
    reasoning: 'medium',
    runs: 1,
    skillPath: defaultSkillPath,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    const value = argv[index + 1]

    switch (argument) {
      case '--':
        break
      case '--allow-failures':
        options.allowFailures = true
        break
      case '--case':
        options.caseIds.push(value)
        index += 1
        break
      case '--compare':
        options.comparePath = resolve(projectDir, value)
        index += 1
        break
      case '--dry-run':
        options.dryRun = true
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

function buildPrompt(skillPath, testCase) {
  return `Use the skill instructions at ${skillPath} to decide how the user request should be handled.

This is a read-only behavioral evaluation:
- Do not modify files.
- Do not use the network or any external connector.
- Do not create branches, commits, pushes, pull requests, or Nuxt Studio changes.
- Do not ask the evaluator interactively.
- Treat attachments explicitly mentioned by the user as available.
- Set repositoryAccess to "local" unless the request explicitly says no suitable checkout exists; then use "github-only". Use "none" only for unrelated requests. Do not infer repository availability from this isolated evaluator directory.
- Return the questions the workflow would ask in the "questions" array.
- List only sources that the workflow actually needs after its initial inventory.
- The actions array describes the complete planned workflow route. Include later actions such as validation and PR creation even though this read-only evaluation must not execute them.
- Use process-media whenever an image or attachment must be inspected, transcribed, extracted, transformed, or prepared, including when a table image is only used as a data source and is not published.
- Use the exact source and action identifiers allowed by the output schema.
- If the request is unrelated to the skill, use operation "unrelated", source list [], and action ["none"].
- Evaluate the skill as written. Do not critique or silently improve its workflow.

User request:
${testCase.prompt}`
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

function collectMetrics(events, durationMs) {
  const completed = [...events].reverse().find(event => event.type === 'turn.completed')
  const usage = completed?.usage || {}
  const toolCalls = events.filter((event) => {
    if (!event.type?.startsWith('item.')) {
      return false
    }
    return ['command_execution', 'mcp_tool_call', 'web_search'].includes(event.item?.type)
  }).length

  return {
    durationMs: Math.round(durationMs),
    inputTokens: usage.input_tokens || 0,
    cachedInputTokens: usage.cached_input_tokens || 0,
    uncachedInputTokens: Math.max((usage.input_tokens || 0) - (usage.cached_input_tokens || 0), 0),
    outputTokens: usage.output_tokens || 0,
    reasoningTokens: usage.reasoning_output_tokens || 0,
    toolCalls,
  }
}

async function runCodex(testCase, options, attemptIndex) {
  const outputPath = resolve(options.executionDir, `.result-${testCase.id}-${attemptIndex}.json`)
  const codexScript = process.env.CODEX_JS || resolve(process.env.APPDATA || '', 'npm/node_modules/@openai/codex/bin/codex.js')
  const executable = process.env.CODEX_BIN || (process.platform === 'win32' ? process.execPath : 'codex')
  const args = [
    'exec',
    '--ephemeral',
    '--skip-git-repo-check',
    '--ignore-user-config',
    '--sandbox',
    'read-only',
    '-c',
    'approval_policy="never"',
    '-c',
    'service_tier="fast"',
    '-c',
    `model_reasoning_effort="${options.reasoning}"`,
    '--json',
    '--output-schema',
    schemaPath,
    '--output-last-message',
    outputPath,
    '--cd',
    options.executionDir,
  ]

  args.push('--model', options.model)
  args.push(buildPrompt(options.executionSkillPath, testCase))

  const startedAt = performance.now()
  const commandArgs = process.platform === 'win32' && !process.env.CODEX_BIN ? [codexScript, ...args] : args
  const child = spawn(executable, commandArgs, { cwd: options.executionDir, env: process.env, shell: false, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
  let stdout = ''
  let stderr = ''

  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.stdout.on('data', (chunk) => {
    stdout += chunk
  })
  child.stderr.on('data', (chunk) => {
    stderr += chunk
  })

  const exitCode = await new Promise((resolveExit, reject) => {
    child.on('error', reject)
    child.on('close', resolveExit)
  })
  const metrics = collectMetrics(parseJsonLines(stdout), performance.now() - startedAt)

  if (exitCode !== 0) {
    return { error: `codex exited with ${exitCode}: ${stderr.trim()}`, metrics }
  }

  try {
    const actual = JSON.parse(await readFile(outputPath, 'utf8'))
    return { actual, evaluation: evaluateResult(actual, testCase.expected), metrics }
  }
  catch (error) {
    return { error: `unable to parse structured result: ${error.message}`, metrics }
  }
  finally {
    await rm(outputPath, { force: true })
  }
}

function aggregateResults(testCases, attemptsByCase) {
  const cases = testCases.map(testCase => ({
    id: testCase.id,
    description: testCase.description,
    attempts: attemptsByCase[testCase.id],
    summary: summarizeAttempts(attemptsByCase[testCase.id]),
  }))
  return { cases, totals: { cases: cases.length, ...summarizeAttempts(cases.flatMap(testCase => testCase.attempts)) } }
}

function formatPercent(value) {
  return value === null ? 'n/a' : `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

function printReport(report) {
  console.table(report.cases.map(testCase => ({
    case: testCase.id,
    passed: `${testCase.summary.passed}/${testCase.summary.attempts}`,
    durationMs: testCase.summary.medianDurationMs,
    uncachedInputTokens: testCase.summary.medianUncachedInputTokens,
    outputTokens: testCase.summary.medianOutputTokens,
    toolCalls: testCase.summary.medianToolCalls,
  })))

  for (const testCase of report.cases) {
    for (const attempt of testCase.attempts) {
      if (attempt.error) {
        console.error(`${testCase.id}: ${attempt.error}`)
      }
      else if (!attempt.evaluation.passed) {
        console.error(`${testCase.id}: ${attempt.evaluation.failures.join('; ')}`)
      }
    }
  }

  console.log(`Pass rate: ${(report.totals.passRate * 100).toFixed(1)}%`)
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  const allCases = JSON.parse(await readFile(casesPath, 'utf8'))
  const testCases = options.caseIds.length ? allCases.filter(testCase => options.caseIds.includes(testCase.id)) : allCases

  if (!testCases.length) {
    throw new Error('No matching eval cases selected')
  }
  if (options.dryRun) {
    console.log(`Validated ${testCases.length} eval case definitions.`)
    return
  }

  await mkdir(isolationRoot, { recursive: true })
  options.executionDir = await mkdtemp(resolve(isolationRoot, `${options.label.replace(/[^a-z0-9.-]/gi, '-')}-`))
  activeExecutionDir = options.executionDir
  options.executionSkillPath = resolve(options.executionDir, 'skill/SKILL.md')
  await cp(dirname(options.skillPath), dirname(options.executionSkillPath), { recursive: true })

  const attemptsByCase = Object.fromEntries(testCases.map(testCase => [testCase.id, []]))
  for (const testCase of testCases) {
    for (let attempt = 1; attempt <= options.runs; attempt += 1) {
      console.log(`Running ${testCase.id} (${attempt}/${options.runs})...`)
      attemptsByCase[testCase.id].push(await runCodex(testCase, options, attempt))
    }
  }

  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      label: options.label,
      model: options.model,
      reasoning: options.reasoning,
      runs: options.runs,
      skillPath: options.skillPath,
    },
    ...aggregateResults(testCases, attemptsByCase),
  }

  if (options.comparePath) {
    const baseline = JSON.parse(await readFile(options.comparePath, 'utf8'))
    report.comparison = compareSummaries(report.totals, baseline.totals)
    console.table(Object.entries(report.comparison).map(([metric, value]) => ({
      metric,
      baseline: value.baseline,
      candidate: value.candidate,
      change: formatPercent(value.changePercent),
    })))
  }

  printReport(report)
  const outputPath = options.outputPath || resolve(resultsDir, `${options.label}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  console.log(`Saved ${outputPath}`)

  if (!options.allowFailures && report.totals.passed !== report.totals.attempts) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
}).finally(async () => {
  if (activeExecutionDir) {
    await rm(activeExecutionDir, { recursive: true, force: true })
  }
})
