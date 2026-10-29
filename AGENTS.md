# AGENTS.md

## Naming Conventions

- **Functions**: `camelCase`
- **Variables**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE` (top-level only; prefer `const` with camelCase for module constants)
- **React Components & Files**: `PascalCase.tsx` (e.g., `UserProfile.tsx`, `LoginForm.tsx`)
- **Types/Interfaces**: `PascalCase` (e.g., `User`, `AppState`, `ComponentProps`)
- **Custom Hooks**: `useCamelCase`
- **Directories**: `camelCase` for single-word grouping dirs (e.g., `hooks`, `utils`, `contexts`). `PascalCase` for component dirs and any multi-word dir (e.g., `Button`, `CharactersTable`, `ItemCatalog`).

## Code Style & Organization

- **Avoid enums**: Prefer `const` with `as const`
- **Error handling**: Never silently swallow errors. All catch blocks must handle errors explicitly
- **Imports**: Use path aliases (`@Components/`, `@Utils/`, etc) for imports from `src/`
- **Type Definitions**: Define component types in separate `.types.ts` files (e.g., `Button.types.ts` for `Button.tsx`)
- **Exports**: Use `export default` for main components, named exports for utilities and hooks
- **Prefer guard clauses**: Use guard clauses over nested `if-else` statements
- **Semantic HTML**: Use semantic HTML (`<section>`, `<article>`, `<main>`) over `<div>` where appropriate
- **React Compiler**: Don't be over-eager to use `useMemo`, `React.memo`, or `useCallback`. React Compiler handles memoization automatically.
- **No AI-isms**: Avoid emojis, em dashes, and double dashes anywhere.

## Dependencies

- Use `pnpm view <package>` to check the latest version of a package before adding it
- Pin exact versions in `package.json` (no `^` or `~` ranges)

## Type Safety

- Avoid `any` type in source code. You are also strictly prohibited from using `// eslint-disable-next-line @typescript-eslint/no-explicit-any`. If you encounter a situation where `any` seems necessary, ask the developer for guidance on the proper approach
- Prefer `type` over `interface`
- Define schemas once, reuse for both validation and type inference
- Prefer `.safeParse()` over `.parse()` to return result objects instead of throwing
- Before defining a new type, grep the codebase to see if a similar type already exists that can be reused
- When appropriate, use TypeScript utility types (`Pick`, `Omit`, `&`, etc) to avoid duplicating fields

## Styling

- **Emotion**: Use `css` from `@emotion/css` for component styles. It returns a plain className string applied via `className={myStyles}`.
- **Theme**: Import `theme` from `@Theme/theme` to reference colors and breakpoints in styles.
- **Use HSL for colors**: All color values use HSL format (e.g., `hsl(357, 75%, 58%)`).
- **Breakpoints**: Mobile-first. Access via `theme.breakpoints.values.lg`. Values are in em: `@media (min-width: ${theme.breakpoints.values.lg}em)`.
- **Spacing units**: Use `rem` for `font-size` and layout spacing (`gap`, `margin`). Use `em` for internal component proportions (`padding`, `border-radius`, icon sizes) so they scale with the component's font size. When in doubt: if the property defines the component's internal breathing room, use `em`. If it spaces elements in a layout, use `rem`.

## Comments

- **Only add code comments when explicitly asked to do so**
- **`//`** for single-line comments
- `/** */` for JSDoc comments on functions and types. Wrap JSDoc body lines at 75 characters.
- **`/* */`** for multiline comments that are not JSDoc

## Language & Localization

- **Spanish for user-facing content**: All UI text, messages, notifications, and error messages in Spanish
- **English for code**: Variable names, function names, comments, and code identifiers remain in English
- **In some cases Spanglish is OK**: For very specific cases, you can use established domain-specific Spanglish terms in code (e.g., `mapeadorSlice`, `DateadorHelpers`, `IndexadorPopup`)

## Relevant Commands

```bash
pnpm lint                      # Lint check on all files
pnpm exec eslint <file>        # Lint check on a specific file
pnpm format:check              # Check Prettier formatting
pnpm format:write              # Auto-fix Prettier formatting
pnpm type-check                # Type-check without emitting files
pnpm test                      # Run unit tests once
pnpm test -- -t "test name"    # Run unit tests matching a pattern
pnpm test:e2e                  # Run e2e tests
pnpm test:e2e -- -g "test"     # Run e2e tests matching a pattern
pnpm test:e2e:debug            # Run e2e tests with Playwright debugger
pnpm audit                     # Check for dependency vulnerabilities
```
