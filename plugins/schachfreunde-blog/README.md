# Schachfreunde Blog

A Codex plugin for editing blog posts published on [schachfreunde-biberach.de](https://www.schachfreunde-biberach.de/blog).

Its skill turns text, notes, images, and attachments into Nuxt Content entries that follow the repository conventions. By default, it prepares a publication-ready GitHub pull request.

## Requirements

- a current version of Codex CLI or the Codex desktop app
- Git
- access to the repository through GitHub or a local checkout

Check the installed CLI version with `codex --version`.

## Install from GitHub

Register the marketplace and install the plugin:

```bash
codex plugin marketplace add sfbiberach/schachfreunde-biberach.de --ref main
codex plugin add schachfreunde-blog@schachfreunde-biberach
```

The marketplace only needs to be registered once. Restart Codex or open a new task after installation.

Confirm the installation with:

```bash
codex plugin list
```

The output should include `schachfreunde-blog@schachfreunde-biberach`.

## Local plugin development

To work on the plugin, register the local marketplace from the root of this repository:

```bash
codex plugin marketplace add .
codex plugin add schachfreunde-blog@schachfreunde-biberach
```

Do not enable the local and GitHub variants at the same time. After changing the plugin, also update its version or cachebuster in [`.codex-plugin/plugin.json`](.codex-plugin/plugin.json).

## Usage

The skill is selected automatically when a request concerns a Schachfreunde blog post. No dedicated command is required.

Example prompts:

```text
Create a Schachfreunde blog post from these notes:
...
```

```text
Revise the existing report about the latest team match.
Only correct spelling and punctuation.
```

```text
Create a post from this photo and my notes.
Reproduce the pictured results table as a real table.
```

```text
Create a local draft only. Do not open a pull request yet.
```

Prompts and source material may be written in German. The skill preserves the language and tone appropriate for the club website.

## How it works

The skill:

- reads only repository sources relevant to the request,
- preserves finished source text unless editing was requested,
- derives Nuxt Content metadata from the supplied information,
- organises and validates attached media,
- never invents results, names, dates, or image rights,
- opens a pull request by default.

It creates a local draft or publishes directly through Nuxt Studio only when explicitly requested.

## Updating

After repository changes or a new plugin release:

```bash
git pull
codex plugin add schachfreunde-blog@schachfreunde-biberach
```

Then restart Codex or open a new task.

## Development and tests

The skill implementation lives in [`skills/create-schachfreunde-blog-post`](skills/create-schachfreunde-blog-post). See the [evaluation README](../../tests/skill-evals/blog-post/README.md) for detailed test cases, model evaluations, and integration runs.

Run the main checks with:

```bash
pnpm skill:eval:smoke
pnpm skill:eval
pnpm skill:eval:integration
pnpm verify
```

Model evaluations require a working Codex login. Run several repetitions when comparing execution time and token usage.

## Troubleshooting and removal

If similarly named installations exist, inspect their marketplace and installation status with:

```bash
codex plugin list --available --json
```

Only `schachfreunde-blog@schachfreunde-biberach` should be active.

Remove the plugin using its full selector:

```bash
codex plugin remove schachfreunde-blog@schachfreunde-biberach
```

[Back to the project README](../../README.md)
