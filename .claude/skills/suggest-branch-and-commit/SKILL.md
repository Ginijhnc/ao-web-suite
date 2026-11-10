---
name: suggest-branch-and-commit
description: Suggest a git branch name and commit message based on local uncommitted changes. Triggers when the user asks for a branch name, commit message, or how to name or structure a commit for their current changes.
---

Read the local uncommitted changes' diffs and suggest a branch name and commit message following the guidelines below.

## Branch Naming Guidelines

- Use **kebab-case** (lowercase with hyphens)
- Keep **concise but descriptive** (2-4 words)
- Match commit scopes: `feat/indexador-*`, `feat/dateador-*`, `feat/mapeador-*`, etc.

**Format:** `{type}/{kebab-case-description}`

### Types

| Type        | Description                        | Examples                                                          |
| ----------- | ---------------------------------- | ----------------------------------------------------------------- |
| `feat/`     | New features                       | `feat/mapeador-layer-system`, `feat/indexador-spritesheet-upload` |
| `fix/`      | Bug fixes                          | `fix/dateador-form-validation`                                    |
| `perf/`     | Performance improvements           | `perf/mapeador-tile-rendering`                                    |
| `refactor/` | Code refactoring                   | `refactor/mapeador-consolidate-duplicate-logic`                   |
| `test/`     | Test additions or improvements     | `test/dateador-entity-editing`                                    |
| `docs/`     | Documentation                      | `docs/indexador-setup-guide`                                      |
| `chore/`    | Maintenance, tooling, build config | `chore/update-eslint-config`                                      |
| `revert/`   | Reverting a previous commit or PR  | `revert/mapeador-layer-system`                                    |

## Commit Message Guidelines

- Use **Conventional Commits** with a **mandatory scope**: `feat(scope):`, `fix(scope):`, `refactor(scope):`, etc
- Always include a commit body describing **what the change does and why it exists**, not how it is implemented
- Do not reference function/file names or hard-coded values; keep the body implementation-agnostic and future-proof
- The commit message should be a single continuous block with title and body together, separated by a blank line (do not separate them into different sections)
- Wrap commit body lines at **72 characters**
- If the commit message contains double quotes (`"`), wrap the whole `git commit -m` argument in single quotes so the inner double quotes are preserved literally. Otherwise the message can be safely wrapped in double quotes.
- Always output the ready-to-run `git checkout -b`, `git commit -m` and `git push origin` commands in that order. Never run `git commit` or `git add` unless the user explicitly asks you to.

**Example output format** (all three commands must always be present):

```
git checkout -b fix/dateador-form-validation
```

```
git commit -m "fix(dateador): prevent form from submitting invalid data

Adds validation before submission so users cannot save entities
with missing required fields."
```

```
git push origin fix/dateador-form-validation
```

### Scopes

| Scope       | Description                            |
| ----------- | -------------------------------------- |
| `home`      | Asset upload and file management page  |
| `overview`  | Dashboard with tools, stats, and logs  |
| `ui`        | Shared UI components and design system |
| `indexador` | Texture atlas and asset management     |
| `dateador`  | Game data and entity attribute editing |
| `mapeador`  | World map visual editor and rendering  |
| `config`    | Settings page for app customization    |
| `tutorial`  | Tutorial and app usage documentation   |
| `storage`   | Stores and client-side persistence     |
| `deps`      | Dependency updates                     |
| `ci`        | CI/CD pipelines                        |
| `tooling`   | Linting, formatting, workspace config  |
