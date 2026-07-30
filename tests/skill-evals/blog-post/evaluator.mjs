function missingValues(actual, expected) {
  return expected.filter(value => !actual.includes(value))
}

function forbiddenValues(actual, forbidden) {
  return forbidden.filter(value => actual.includes(value))
}

export function evaluateResult(actual, expected) {
  const failures = []

  if (expected.operation && actual.operation !== expected.operation) {
    failures.push(`operation: expected ${expected.operation}, received ${actual.operation}`)
  }
  if (expected.inputKind && actual.inputKind !== expected.inputKind) {
    failures.push(`inputKind: expected ${expected.inputKind}, received ${actual.inputKind}`)
  }
  if (expected.repositoryAccess && actual.repositoryAccess !== expected.repositoryAccess) {
    failures.push(`repositoryAccess: expected ${expected.repositoryAccess}, received ${actual.repositoryAccess}`)
  }
  if (expected.minQuestions !== undefined && actual.questions.length < expected.minQuestions) {
    failures.push(`questions: expected at least ${expected.minQuestions}, received ${actual.questions.length}`)
  }
  if (expected.maxQuestions !== undefined && actual.questions.length > expected.maxQuestions) {
    failures.push(`questions: expected at most ${expected.maxQuestions}, received ${actual.questions.length}`)
  }
  if (expected.maxSources !== undefined && actual.sources.length > expected.maxSources) {
    failures.push(`sources: expected at most ${expected.maxSources}, received ${actual.sources.length}`)
  }

  const missingSources = missingValues(actual.sources, expected.requiredSources || [])
  if (missingSources.length) {
    failures.push(`sources: missing ${missingSources.join(', ')}`)
  }

  const unnecessarySources = forbiddenValues(actual.sources, expected.forbiddenSources || [])
  if (unnecessarySources.length) {
    failures.push(`sources: unnecessary ${unnecessarySources.join(', ')}`)
  }

  const missingActions = missingValues(actual.actions, expected.requiredActions || [])
  if (missingActions.length) {
    failures.push(`actions: missing ${missingActions.join(', ')}`)
  }

  const forbiddenActions = forbiddenValues(actual.actions, expected.forbiddenActions || [])
  if (forbiddenActions.length) {
    failures.push(`actions: forbidden ${forbiddenActions.join(', ')}`)
  }

  return { passed: failures.length === 0, failures }
}

export function percentile(values, quantile) {
  if (!values.length) {
    return 0
  }
  if (quantile < 0 || quantile > 1) {
    throw new RangeError('quantile must be between 0 and 1')
  }

  const sorted = [...values].sort((left, right) => left - right)
  const index = (sorted.length - 1) * quantile
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) {
    return sorted[lower]
  }
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower)
}

export function median(values) {
  return percentile(values, 0.5)
}

export function summarizeAttempts(attempts) {
  const successful = attempts.filter(attempt => !attempt.error)
  const passed = successful.filter(attempt => attempt.evaluation.passed)

  return {
    attempts: attempts.length,
    completed: successful.length,
    passed: passed.length,
    passRate: attempts.length ? passed.length / attempts.length : 0,
    medianDurationMs: median(successful.map(attempt => attempt.metrics.durationMs)),
    p95DurationMs: percentile(successful.map(attempt => attempt.metrics.durationMs), 0.95),
    medianInputTokens: median(successful.map(attempt => attempt.metrics.inputTokens)),
    medianCachedInputTokens: median(successful.map(attempt => attempt.metrics.cachedInputTokens)),
    medianUncachedInputTokens: median(successful.map(attempt => attempt.metrics.uncachedInputTokens)),
    p95UncachedInputTokens: percentile(successful.map(attempt => attempt.metrics.uncachedInputTokens), 0.95),
    medianOutputTokens: median(successful.map(attempt => attempt.metrics.outputTokens)),
    medianReasoningTokens: median(successful.map(attempt => attempt.metrics.reasoningTokens)),
    medianToolCalls: median(successful.map(attempt => attempt.metrics.toolCalls)),
  }
}

export function compareSummaries(candidate, baseline) {
  const metrics = [
    'medianDurationMs',
    'p95DurationMs',
    'medianInputTokens',
    'medianCachedInputTokens',
    'medianUncachedInputTokens',
    'p95UncachedInputTokens',
    'medianOutputTokens',
    'medianReasoningTokens',
    'medianToolCalls',
  ]

  return Object.fromEntries(metrics.map((metric) => {
    const previous = baseline[metric]
    const current = candidate[metric]
    const comparable = Number.isFinite(previous) && Number.isFinite(current) && previous !== 0
    const changePercent = comparable ? ((current - previous) / previous) * 100 : null
    return [metric, { baseline: Number.isFinite(previous) ? previous : null, candidate: Number.isFinite(current) ? current : null, changePercent }]
  }))
}
