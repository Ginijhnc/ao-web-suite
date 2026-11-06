---
name: e2e-playwright
description: 'Guidelines for writing E2E tests with Playwright. Covers test architecture (flow-based structure, folder conventions, fixture loading), element selection strategy (prefer role-based selectors over data-testid), navigation path handling, and interaction patterns. Triggers when writing, reviewing, or editing Playwright test files, or when the user mentions E2E tests, test selectors, data-testid, Playwright.'
---

# E2E Tests with Playwright

## Folder Structure

Each page or feature gets its own directory under `e2e/`, containing a spec file, a `flows/` subdirectory, and optionally a `helpers/` subdirectory.

**Spec file**: each test calls exactly one flow function with no inline logic. No `expect`, no locators. Tests are one or two lines at most.

**Flow functions**: each exported function is a complete, self-contained test scenario. Each is a complete user journey: seed state, navigate, interact, assert. All `expect` calls live here.

**Helpers**: shared locator builders and wait utilities that would otherwise be duplicated across multiple flow functions. They return `Locator` or resolve `void` after waiting. No assertions. If something is only used in one flow, inline it there. Export all helpers as a single named object matching the file name (e.g. `export const LogsTestHelpers = { ... }`); never use individual `export const` per function.

**Fixtures**: place test data files under the root `fixtures/<feature>/` directory, not inside `e2e/`. Reference them using `path.resolve` with `fileURLToPath(import.meta.url)` and read with `fs.readFileSync`.

## Element Selection

Prefer role-based selectors over `data-testid`. Test IDs decouple tests from real user interactions. If an element can't be found by its role and accessible name, some users probably can't find it either.

**Priority order for selectors:**

1. `getByRole` with an accessible name
2. `getByLabel` for form fields
3. `getByText` for static content
4. `getByPlaceholder` as a last resort for inputs without labels
5. `data-testid` only when no semantic selector is viable (e.g. non-interactive containers with no accessible name)

```ts
// BAD: test ID is invisible to users and ignores the element's role
await page.getByTestId('save-button').click();

// GOOD: role + name mirrors how a user perceives the element
await page.getByRole('button', { name: 'Guardar' }).click();
```

For elements inside a landmark or dialog, scope with `locator`:

```ts
// Navigate within a named region
page.getByRole('navigation').getByRole('link', { name: 'Inicio' });

// Find inside a dialog
page.getByRole('dialog', { name: 'Confirmar' }).getByRole('button', {
	name: 'Aceptar',
});

// Fill a labeled field inside a form
page.getByRole('form').getByRole('textbox', {
	name: 'Correo electrónico',
});
```

## Separate Selection from Interaction

Always store the locator before acting on it. Only chain when the element comes from a function return.

```ts
// BAD: chained directly
await page.getByRole('button', { name: 'Enviar' }).click();

// GOOD: two lines
const submitButton = page.getByRole('button', { name: 'Enviar' });
await submitButton.click();

// OK: chaining from a function return is fine
await getSubmitButton(page).click();
```

## Navigation Paths

Avoid hardcoding URL paths in tests. Import and use routes from `src/constants/routes.ts`.

```ts
// BAD
await page.goto('/indexador');

// GOOD
import { ROUTES } from '@Constants/routes';
await page.goto(ROUTES.INDEXADOR);
```

## Verifying Non-Interactive Display Values

For display-only values (prices, counts, ratings) scoping to a named region and asserting visible text is usually enough:

```ts
const card = page.getByRole('article', { name: /nike air max/i });
await expect(card.getByText('$129.99')).toBeVisible();
```

This only works cleanly when the value is unique within its scope. When the same text could appear in multiple places (e.g. subtotal and total could be equal), or when you need a precise error message on failure, a `data-testid` on the value element is the right call:

```ts
const card = page.getByRole('article', { name: /nike air max/i });
await expect(card.getByTestId('product-price')).toHaveText('$129.99');
```

The signal to watch for: if you're reaching for a `data-testid` because the element has no semantic role, consider whether the markup could be improved first (e.g. `<article>` with an accessible name). If the element genuinely has no interactive role and no natural accessible name, `data-testid` is fine.

## When `data-testid` Is Acceptable

Use `data-testid` only for elements that have no semantic role and no accessible name: typically non-interactive containers used purely as test anchors. When you add one, treat it as a signal to revisit the markup: if a `data-testid` would be unnecessary with better semantic HTML, fix the HTML instead.
