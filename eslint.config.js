import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		ignores: [
			'dist/',
			'dist-test/',
			'node_modules/',
			'coverage/',
			'vite.config.ts',
			'vitest.config.ts',
			'playwright.config.ts',
			'eslint-custom/**',
		],
	},
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: tsParser,
			globals: {
				...globals.browser,
				...globals.node,
				React: 'readonly',
				JSX: 'readonly',
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
				projectService: true,
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
			import: importPlugin,
		},
		/* ====== Mega strict linting for LLM steerability and automatic verification loop ====== */
		rules: {
			/* ==================== Type Safety ==================== */
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unsafe-argument': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/restrict-template-expressions': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/restrict-plus-operands': 'error',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/no-non-null-asserted-optional-chain':
				'error',
			'@typescript-eslint/no-non-null-asserted-nullish-coalescing':
				'error',
			'@typescript-eslint/no-array-constructor': 'error',
			'@typescript-eslint/no-duplicate-type-constituents': 'error',
			'@typescript-eslint/no-redundant-type-constituents': 'error',
			'@typescript-eslint/no-empty-object-type': 'error',
			'@typescript-eslint/no-wrapper-object-types': 'error',
			'@typescript-eslint/no-confusing-non-null-assertion': 'error',
			'@typescript-eslint/consistent-type-assertions': 'error',
			'@typescript-eslint/no-mixed-enums': 'error',

			/* ==================== React & Hooks ==================== */
			'react/no-children-prop': 'error',
			'react/display-name': 'error',
			'react/no-array-index-key': 'warn',
			'react/function-component-definition': [
				'error',
				{ namedComponents: 'arrow-function' },
			],
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'error',
			'react-hooks/purity': 'error',
			'react-hooks/refs': 'error',
			'react-hooks/immutability': 'error',
			'react-hooks/globals': 'error',
			'react-hooks/set-state-in-render': 'error',
			'react-hooks/set-state-in-effect': 'error',
			'react-hooks/static-components': 'error',
			'react-hooks/error-boundaries': 'error',
			'react-hooks/incompatible-library': 'error',
			'react-hooks/unsupported-syntax': 'error',
			'react/no-unescaped-entities': [
				'error',
				{ forbid: ['>', '}'] },
			],
			'react/no-danger-with-children': 'error',
			'react/react-in-jsx-scope': 'off',
			'react/self-closing-comp': 'error',
			'react/button-has-type': 'error',

			/* ==================== Bug Prevention ==================== */
			'@typescript-eslint/no-for-in-array': 'error',
			'@typescript-eslint/no-misused-promises': 'error',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/no-unnecessary-condition': 'error',
			'@typescript-eslint/no-base-to-string': 'error',
			'@typescript-eslint/no-confusing-void-expression': 'error',
			'@typescript-eslint/only-throw-error': 'error',
			'@typescript-eslint/return-await': [
				'error',
				'error-handling-correctness-only',
			],
			'no-unsafe-optional-chaining': 'error',
			'no-loss-of-precision': 'error',
			'valid-typeof': 'error',
			'no-unsafe-negation': 'error',
			'no-self-compare': 'error',
			'no-dupe-else-if': 'error',
			'no-dupe-keys': 'error',
			'no-duplicate-case': 'error',
			'array-callback-return': 'error',
			'no-return-assign': 'error',
			'no-func-assign': 'error',
			'no-import-assign': 'error',
			'no-promise-executor-return': 'error',
			'no-sparse-arrays': 'error',
			'use-isnan': 'error',

			/* ==================== Code Quality ==================== */
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/no-unnecessary-type-parameters': 'error',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare':
				'error',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/prefer-reduce-type-parameter': 'error',
			'@typescript-eslint/prefer-find': 'error',
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/no-unused-expressions': 'error',
			'@typescript-eslint/require-await': 'error',
			complexity: ['error', 7], // cyclomatic complexity
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'no-negated-condition': 'error',
			'no-param-reassign': 'error',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'max-depth': ['error', 3],
			'max-nested-callbacks': ['error', 3],
			'no-lonely-if': 'error',
			'no-debugger': 'error',
			'no-prototype-builtins': 'error',
			'no-unreachable-loop': 'error',
			'no-new': 'error',
			'no-sequences': 'error',
			'no-with': 'error',
			'no-await-in-loop': 'error',
			'no-empty-pattern': 'error',
			'no-extra-boolean-cast': 'error',
			'no-empty': ['error', { allowEmptyCatch: false }],
			'no-eval': 'error',

			/* ==================== Code Style & Formatting ==================== */
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'default',
					format: ['camelCase'],
				},
				{
					selector: 'variable',
					format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
				},
				{
					selector: 'parameter',
					format: ['camelCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: 'typeLike',
					format: ['PascalCase'],
				},
				{
					selector: 'enumMember',
					format: ['UPPER_CASE'],
				},
				{
					selector: 'function',
					format: ['camelCase', 'PascalCase'],
				},
				{
					selector: 'objectLiteralProperty',
					format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
				},
				{
					selector: 'objectLiteralMethod',
					format: null,
				},
				{
					selector: 'objectLiteralProperty',
					modifiers: ['requiresQuotes'],
					format: null,
				},
				{
					selector: 'typeProperty',
					modifiers: ['requiresQuotes'],
					format: null,
				},
				{
					selector: 'import',
					format: ['camelCase', 'PascalCase'],
				},
			],
			'@typescript-eslint/array-type': [
				'error',
				{ default: 'generic' },
			],
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'separate-type-imports',
				},
			],
			'@typescript-eslint/consistent-type-exports': [
				'error',
				{ fixMixedExportsWithInlineTypeSpecifier: false },
			],
			'@typescript-eslint/consistent-indexed-object-style': [
				'error',
				'record',
			],
			'@typescript-eslint/consistent-generic-constructors': [
				'error',
				'constructor',
			],
			'@typescript-eslint/prefer-as-const': 'error',
			'arrow-body-style': ['error', 'always'],
			'func-style': ['error', 'expression'],
			'prefer-arrow-callback': 'error',
			'no-else-return': 'error',
			'no-var': 'error',
			'no-restricted-syntax': [
				'error',
				{
					selector: 'FunctionExpression',
					message: 'Use arrow functions instead.',
				},
				{
					selector:
						'TSIndexedAccessType > TSTypeOperator[operator="keyof"]',
					message:
						'Avoid "T[keyof T]" index access. Use the ValueOf<T> utility type from @Types/utility-types instead.',
				},
				{
					selector:
						'TSAsExpression > TSAsExpression > TSUnknownKeyword',
					message:
						'Avoid "as unknown as T" double-cast. This bypasses the type system. Ask for guidance on the proper approach.',
				},
				{
					selector: 'RestElement > Identifier[name!="rest"]',
					message:
						'Name rest parameters "rest" (e.g., ...rest) for consistency.',
				},
				{
					selector:
						'CallExpression[callee.object.name="console"][callee.property.name="error"]',
					message:
						'Use log.error() from @Utils/logger instead of console.error().',
				},
				{
					selector:
						'CallExpression[callee.object.name="console"][callee.property.name="warn"]',
					message:
						'Use log.warn() from @Utils/logger instead of console.warn().',
				},
			],
			'spaced-comment': ['error', 'always', { markers: ['/'] }],

			/* ==================== Import Organization ==================== */
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
					],
					pathGroups: [
						{
							pattern: 'react',
							group: 'external',
							position: 'before',
						},
						{
							pattern: '@/**',
							group: 'internal',
						},
					],
					pathGroupsExcludedImportTypes: ['react'],
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
		},
	},
	{
		files: ['src/types/utility-types.ts'],
		rules: {
			'no-restricted-syntax': 'off',
		},
	},
	{
		files: [
			'**/*.test.ts',
			'**/*.test.tsx',
			'**/*.spec.ts',
			'**/*.spec.tsx',
			'vitest.setup.ts',
		],
		languageOptions: {
			globals: {
				describe: 'readonly',
				it: 'readonly',
				expect: 'readonly',
				vi: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
			},
		},
		rules: {
			'max-statements': 'off',
		},
	},
];
