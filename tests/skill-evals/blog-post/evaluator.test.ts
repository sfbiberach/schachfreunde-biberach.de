import { describe, expect, it } from 'vitest'
import { compareSummaries, evaluateResult, median, percentile, summarizeAttempts } from './evaluator.mjs'

describe('skill eval result scoring', () => {
  it('passes when required values are present without forbidden work', () => {
    const result = evaluateResult({
      operation: 'revise',
      inputKind: 'existing-content',
      repositoryAccess: 'local',
      questions: [],
      sources: ['target-article', 'editorial-style'],
      actions: ['edit-article', 'run-lint', 'create-pr'],
    }, {
      operation: 'revise',
      inputKind: 'existing-content',
      repositoryAccess: 'local',
      maxQuestions: 0,
      maxSources: 3,
      requiredSources: ['target-article'],
      forbiddenSources: ['tournaments'],
      requiredActions: ['edit-article'],
      forbiddenActions: ['ask-user'],
    })

    expect(result).toEqual({ passed: true, failures: [] })
  })

  it('reports excessive questions and unnecessary work', () => {
    const result = evaluateResult({
      operation: 'revise',
      inputKind: 'existing-content',
      repositoryAccess: 'local',
      questions: ['Wer ist der Autor?'],
      sources: ['target-article', 'authors', 'tournaments'],
      actions: ['ask-user'],
    }, {
      operation: 'revise',
      inputKind: 'existing-content',
      repositoryAccess: 'local',
      maxQuestions: 0,
      maxSources: 2,
      requiredSources: ['editorial-style'],
      forbiddenSources: ['authors', 'tournaments'],
      requiredActions: ['edit-article'],
      forbiddenActions: ['ask-user'],
    })

    expect(result.passed).toBe(false)
    expect(result.failures).toEqual(expect.arrayContaining([
      expect.stringContaining('questions'),
      expect.stringContaining('sources: unnecessary authors, tournaments'),
      expect.stringContaining('actions: missing edit-article'),
      expect.stringContaining('actions: forbidden ask-user'),
    ]))
  })
})

describe('skill eval summaries', () => {
  it('calculates medians and comparisons', () => {
    expect(median([9, 1, 5])).toBe(5)
    expect(median([2, 4])).toBe(3)
    expect(percentile([100, 200, 300], 0.95)).toBe(290)

    const summary = summarizeAttempts([
      {
        metrics: { durationMs: 100, inputTokens: 1000, cachedInputTokens: 800, uncachedInputTokens: 200, outputTokens: 100, reasoningTokens: 10, toolCalls: 2 },
        evaluation: { passed: true },
      },
      {
        metrics: { durationMs: 200, inputTokens: 2000, cachedInputTokens: 1600, uncachedInputTokens: 400, outputTokens: 200, reasoningTokens: 20, toolCalls: 4 },
        evaluation: { passed: false },
      },
    ])

    expect(summary).toMatchObject({ attempts: 2, completed: 2, passed: 1, passRate: 0.5, medianDurationMs: 150, medianInputTokens: 1500, medianUncachedInputTokens: 300, p95DurationMs: 195, medianToolCalls: 3 })
    expect(compareSummaries(summary, { ...summary, medianDurationMs: 300, medianInputTokens: 3000 })).toMatchObject({
      medianDurationMs: { baseline: 300, candidate: 150, changePercent: -50 },
      medianInputTokens: { baseline: 3000, candidate: 1500, changePercent: -50 },
    })
    expect(compareSummaries(summary, { medianDurationMs: 300 }).p95DurationMs).toEqual({
      baseline: null,
      candidate: 195,
      changePercent: null,
    })
  })
})
