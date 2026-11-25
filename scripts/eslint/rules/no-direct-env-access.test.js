import { RuleTester } from 'eslint';
import { default as rule } from './no-direct-env-access.js';

const tester = new RuleTester({
	languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
});

tester.run('no-direct-env-access', rule, {
	valid: [
		// arbitrary object with .env property is fine
		{ code: 'const x = someObject.env.FOO' },
		// import.meta without .env is fine
		{ code: 'const x = import.meta.url' },
	],
	invalid: [
		// import.meta.env dot notation
		{
			code: 'const x = import.meta.env.VITE_SITE_URL',
			errors: [{ messageId: 'noImportMetaEnv' }],
		},
		// import.meta.env bracket notation
		{
			code: 'const x = import.meta.env["VITE_SITE_URL"]',
			errors: [{ messageId: 'noImportMetaEnv' }],
		},
		// import.meta.env inside a function body
		{
			code: 'const f = () => { return import.meta.env.MODE }',
			errors: [{ messageId: 'noImportMetaEnv' }],
		},
		// process.env dot notation
		{
			code: 'const x = process.env.FOO',
			errors: [{ messageId: 'noProcessEnv' }],
		},
		// process.env bracket notation
		{
			code: 'const x = process.env["FOO"]',
			errors: [{ messageId: 'noProcessEnv' }],
		},
	],
});
