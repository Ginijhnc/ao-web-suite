import { RuleTester } from 'eslint';
import rule from './require-jsdoc-in-helpers.js';

const tester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

/* The rule itself is file-agnostic. Restricting it to files whose
   names contain "helper" (or "Helper") is handled by the files glob
   in eslint.config.js, not by the rule. */
tester.run('require-jsdoc-in-helpers', rule, {
	valid: [
		// Exported arrow function with JSDoc
		{
			code: `
				/** Does something useful. */
				export const doThing = (x) => x + 1
			`,
		},
		// Exported function declaration with JSDoc
		{
			code: `
				/** Does something useful. */
				export function doThing(x) { return x + 1 }
			`,
		},
		// Exported non-function variable needs no JSDoc
		{
			code: `
				export const MY_CONSTANT = 42
			`,
		},
	],
	invalid: [
		// Exported arrow function missing JSDoc
		{
			code: `
				export const doThing = (x) => x + 1
			`,
			errors: [
				{ messageId: 'missingJsdoc', data: { name: 'doThing' } },
			],
		},
		// Exported function declaration missing JSDoc
		{
			code: `
				export function doThing(x) { return x + 1 }
			`,
			errors: [
				{ messageId: 'missingJsdoc', data: { name: 'doThing' } },
			],
		},
		// Single-line comment does not count as JSDoc
		{
			code: `
				// Does something useful.
				export const doThing = (x) => x + 1
			`,
			errors: [
				{ messageId: 'missingJsdoc', data: { name: 'doThing' } },
			],
		},
		// Regular block comment does not count as JSDoc
		{
			code: `
				/* Does something useful. */
				export const doThing = (x) => x + 1
			`,
			errors: [
				{ messageId: 'missingJsdoc', data: { name: 'doThing' } },
			],
		},
		// Multiple exported arrow functions, each missing JSDoc
		{
			code: `
				export const foo = (x) => x + 1
				export const bar = (x) => x - 1
			`,
			errors: [
				{ messageId: 'missingJsdoc', data: { name: 'foo' } },
				{ messageId: 'missingJsdoc', data: { name: 'bar' } },
			],
		},
	],
});
