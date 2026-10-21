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

### Scopes

| Scope       | Description                            |
| ----------- | -------------------------------------- |
| `home`      | Main upload interface for game files   |
| `ui`        | Shared UI components and design system |
| `indexador` | Texture atlas and asset management     |
| `dateador`  | Game data and entity attribute editing |
| `mapeador`  | World map visual editor and rendering  |
| `config`    | Settings page for app customization    |
| `tutorial`  | Tutorial and app usage documentation   |
| `deps`      | Dependency updates                     |
| `ci`        | CI/CD pipelines                        |
| `tooling`   | Linting, formatting, workspace config  |
