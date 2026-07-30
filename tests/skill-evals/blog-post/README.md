# Blog-skill evals

This suite compares routing correctness, latency, token use, tool calls, and file-level behavior for the Schachfreunde blog skill. Cases are synthetic and must not trigger GitHub, Nuxt Studio, or other external writes.

## Isolation

Routing runs copy only the selected skill directory into a fresh temporary directory. Case definitions, expected results, baselines, and the project repository are not present in the model's working directory. Repository availability is controlled by the scenario: a suitable local checkout is assumed by default, while dedicated prompts explicitly exercise GitHub-only behavior.

Integration runs build a new one-commit Git repository from tracked project files, explicitly excluding `tests/skill-evals/blog-post` and all repository history. The selected candidate skill is then copied into that sanitized seed. Every attempt receives an independent clone, so expected answers and artifacts from earlier attempts cannot leak into later runs.

On Windows the runners use `C:\tmp\sfb-blog-skill-routing` and `C:\tmp\sfb-blog-skill-evals` to avoid path-length failures. Override them with `SKILL_EVAL_ISOLATION_DIR` and `SKILL_EVAL_WORKTREE_DIR`.

## Routing benchmark

```sh
pnpm skill:eval -- --label candidate --model gpt-5.4 --reasoning low
```

Use `--skill <path>` for a baseline snapshot, `--compare <report.json>` for an A/B table, `--case <id>` for targeted runs, `--runs <n>` to measure variance, and `--dry-run` to validate case definitions without starting a model. Reports include median and p95 latency, cached and uncached input tokens, output tokens, and tool calls. They can be written with `--output <path>`.

For a statistically useful Luna run:

```sh
pnpm skill:eval -- --label luna --model gpt-5.6-luna --reasoning low --runs 3
```

Codex CLI 0.146.0 or newer can run this Luna command. The skill and schemas do not depend on a model-specific response format.

## Integration benchmark

```sh
pnpm skill:eval:integration -- --label luna-integration --model gpt-5.6-luna --reasoning low --runs 3
```

Use `--dry-run` to construct and verify the sanitized Git seed without starting a model. Integration cases forbid network access, package commands, commits, pushes, PRs, and Nuxt Studio changes. They cover exact corrections, new articles, omitted optional metadata, genuine blockers, and preservation of pre-existing user changes.

The integration runner preserves the user Codex configuration because the Windows sandbox profile is required for effective `workspace-write`; it still overrides model, reasoning, service tier, and approval policy for the run. Do not add `--ignore-user-config` to this runner on Windows, because that can silently downgrade nested sessions to read-only. Prefer uncached input tokens for candidate comparisons because the inherited configuration can add large but mostly cached context.

## Checked-in comparison

- `baselines/original-final-suite.json`: original skill against the original nine routing cases on gpt-5.4
- `baselines/final.json`: optimized skill against the original nine cases on gpt-5.4
- `baselines/luna-original.json`: original skill against the original nine cases on gpt-5.6-luna
- `baselines/luna-final.json`: optimized skill against the original nine cases on gpt-5.6-luna
- `baselines/luna-ambiguous-3x.json`: three repeated Luna runs of the highest-risk ambiguity case
- `baselines/luna-integration.json`: earlier Luna file-level integration results
- `baselines/isolated-luna-original.json`: original skill against the final ten-case suite under strict isolation
- `baselines/isolated-luna-candidate.json`: optimized skill against the same isolated ten-case suite
- `baselines/isolated-luna-risk-3x.json`: three isolated repetitions each for ambiguity and GitHub-only routing
- `baselines/isolated-luna-table-3x.json`: three isolated repetitions of table-image routing
- aselines/isolated-luna-date-3x.json: three isolated repetitions of resolvable team-match date routing after author-lookup tightening
- `baselines/isolated-luna-integration.json`: six sanitized file-level integration cases

The isolated one-shot A/B run scored the original skill at 2/10 and the candidate at 9/10. The candidate's only miss was a degenerate zero-tool response in `resolvable-team-date`; after tightening author lookup, that case passed 3/3 in `isolated-luna-date-3x.json`. Keep the full-run and targeted-repeat evidence separate rather than rewriting the one-shot report into a synthetic 10/10 result.
The historical reports predate strict harness isolation and remain useful as directional snapshots, not as contamination-proof benchmarks. Use the isolated runners and at least three attempts per case for new performance claims.