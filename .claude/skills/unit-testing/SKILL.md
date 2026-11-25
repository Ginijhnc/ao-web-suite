---
name: unit-testing
description: 'Guidelines for writing and reviewing Vitest unit tests. Covers what to test (business logic and behavior, not implementation), what components deserve tests, realistic vs impossible input values, and understanding the codebase before writing test cases. Triggers when writing, reviewing, or editing .test.ts/.test.tsx files, or when the user mentions unit tests, test coverage, or "should we test this".'
---

# Unit Testing

Test functionality, not implementation. A test earns its place by catching a
real regression a user or another developer could actually trigger. If you
can't describe the concrete bug a test would catch, don't write it.

## Read the Code Before Writing the Test

You cannot write a correct test without first tracing where its inputs
actually come from and what already validates them. Grep for callers, read
the upstream validator/constant, and confirm the value you're about to use
is one the running app could actually produce.

**A true story from this codebase:** `getReplacedNames` matches uploaded
files against existing IDB keys. An early draft tested the "no collision"
case with:

```ts
// BAD: 'nuevo.json' looks like a reasonable placeholder name
it('returns an empty array when nothing collides', () => {
	const files = [{ name: 'nuevo.json' } as File];
	expect(getReplacedNames(files, ['cabezas.json'])).toEqual([]);
});
```

This looks fine until you read `validateIndicesFiles`: every índice file is
checked against `isValidIndiceName` (the fixed set `armas`, `cabezas`,
`cascos`, `cuerpos`, `escudos`, `fxs`, `graficos`) **before**
`getReplacedNames` is ever called. `nuevo.json` would be rejected upstream
with an "unknown índice" error and would never reach this function in
production. The user pointed out in review that this case could never
happen. The fix is a real, valid índice name that simply isn't the one
already stored:

```ts
// GOOD: 'armas.json' is a real, valid índice name; it just isn't stored yet
it('returns an empty array when nothing collides', () => {
	const files = [{ name: 'armas.json' } as File];
	expect(getReplacedNames(files, ['cabezas.json'])).toEqual([]);
});
```

The function still "worked" with the bad input, so the test passed either
way. The mistake was invisible in the test's output, only visible by reading
the business logic. Every input value in a test is implicitly a claim about
what the real system can produce. Verify that claim.

## What Not to Test

Never write a test whose only claim is "calling this fires that." These
pass forever and catch nothing, because they restate the code instead of
verifying a guarantee about it.

```tsx
// BAD: this tests that React fires onClick. It always will.
it('should call onClick handler when clicked', async () => {
	const handleClick = vi.fn();
	render(<Button onClick={handleClick}>Click me</Button>);
	await userEvent.click(screen.getByRole('button'));
	expect(handleClick).toHaveBeenCalledOnce();
});
```

Other shapes of the same mistake:

- Asserting a mock was called without asserting anything about the
  resulting state (store updated, error shown, dialog closed).
- Re-describing a conditional in prose instead of proving what happens on
  both sides of it (only rendering the true branch, or asserting the branch
  ran without asserting its effect).
- Snapshotting a component's rendered markup. It catches every future
  change, meaningful or not, and tells you nothing about which one mattered.

## What Deserves a Test

Ask what concrete, plausible bug the test would catch. Good candidates:

- **Business rules with real consequences**: "a failed persist must not
  update the in-memory store," "a collision pauses for confirmation instead
  of silently overwriting," "clearing the store on IDB failure must not
  wipe in-memory state." These are guarantees a future refactor could break
  without anyone noticing until a user loses data.
- **Boundary and edge cases with a realistic trigger**: first-ever upload
  (empty store), last page of pagination, an empty selection, a timestamp
  that doesn't cross a timezone's midnight boundary (the "ordinary" case,
  not just the interesting one).
- **Pure functions with branching logic**: string formatting, pluralization,
  dedup, name matching. Cheap to test, easy to regress silently.
- **Guards with no other coverage**: a re-entrancy check, an early return,
  a disabled state that isn't also enforced by the UI (e.g. a hook-level
  guard when the consuming component never disables the triggering button).

## Components Usually Don't Need Their Own Test File

Most `.tsx` files in this codebase are wiring: hooks in, props out, JSX
branches over them. If the logic is "read three hook values, compute a
boolean, pass it to a child," that boolean is worth testing where it's
computed (extract it, or test the hook), not by mounting the component.

Before adding a `.test.tsx` file, check whether e2e already exercises the
same behavior end-to-end, against the real DOM and real stores. If it does,
a component unit test adds no independent guarantee, just a second place to
update when the behavior legitimately changes, and it's more brittle
because it mocks the very stores/DOM the e2e test exercises for real.

## Understand the Boundary You're Mocking

When a function under test calls into IndexedDB, a Zustand store, or another
module, mock at the real seam, not by inventing a shape that happens to
compile. Read the mocked module's actual exports and return types first.

```ts
// BAD: shape invented, not read from the real ValidationResult type
vi.mock('@Validators/dats', () => ({
	validateDatsFiles: vi.fn(async () => ({ valid: true, data: [] })),
}));

// GOOD: matches the real ValidationResult union
vi.mock('@Validators/dats', () => ({
	validateDatsFiles: validateDatsFilesMock,
}));
const VALID_DAT_RESULT: ValidationResult = {
	valid: true,
	existingKeys: [],
	parsedDats: [{ name: 'npcs', data: {} } as ParsedDat],
};
```

If a module wraps a browser API 1:1 (thin promise wrapper around
IndexedDB's callback API, for example), mocking that API to test the wrapper
just proves the wrapper calls the mock the way you told it to. There's no
independent check.

## Picking Realistic Values

Before typing a literal into a test, ask:

1. Where does this value come from in the running app? (User input? A fixed
   constant like `DAT_NAMES`/`INDICES_NAMES`? Machine-generated, like
   `new Date().toISOString()`?)
2. Does anything upstream reject or transform it before it reaches the code
   under test?
3. If this value could never actually reach this function in production,
   the test is asserting something true but meaningless. Pick a value that
   could.

This matters most for "empty" and "nothing happens" cases, since it's tempting
to reach for an arbitrary placeholder name instead of a real one.
