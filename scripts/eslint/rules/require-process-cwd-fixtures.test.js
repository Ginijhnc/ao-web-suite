import { RuleTester } from 'eslint';
import rule from './require-process-cwd-fixtures.js';

const tester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		globals: {
			path: 'readonly',
			join: 'readonly',
			__dirname: 'readonly',
			dirName: 'readonly',
			process: 'readonly',
		},
	},
});

tester.run('require-process-cwd-fixtures', rule, {
	valid: [
		// Correct pattern: join with process.cwd()
		{
			code: `const fixturesDir = join(process.cwd(), 'fixtures', 'graphics');`,
		},
		{
			code: `const uploadsDir = join(process.cwd(), 'fixtures', 'graphics', 'uploads');`,
		},
		{
			code: `const magicByteDir = join(process.cwd(), 'fixtures', 'graphics', 'magic-byte');`,
		},
		// Regular path operations without relative traversal
		{
			code: `const dataDir = join(__dirname, 'data');`,
		},
		// process.cwd() without join
		{
			code: `const rootDir = process.cwd();`,
		},
		// Non-fixture paths with relative traversal are fine
		{
			code: `const publicDir = path.resolve(dirName, '../../../public/game_assets/graphics');`,
		},
		// Non-fixture paths with join and relative traversal are fine
		{
			code: `const assetDir = join(__dirname, '../../public/assets');`,
		},
	],
	invalid: [
		// path.resolve with dirName and relative traversal to fixtures
		{
			code: `const FIXTURES = path.resolve(dirName, '../../../fixtures/graphics');`,
			errors: [
				{
					messageId: 'useProcessCwd',
				},
			],
			output: `const FIXTURES = join(process.cwd(), 'fixtures', 'graphics');`,
		},
		// path.resolve with __dirname and relative traversal to fixtures
		{
			code: `const fixturesDir = path.resolve(__dirname, '../../../fixtures/graphics/uploads');`,
			errors: [
				{
					messageId: 'useProcessCwd',
				},
			],
			output: `const fixturesDir = join(process.cwd(), 'fixtures', 'graphics', 'uploads');`,
		},
		// join with __dirname and relative traversal to fixtures
		{
			code: `const uploadsDir = join(__dirname, '../../../fixtures/graphics/uploads');`,
			errors: [
				{
					messageId: 'useProcessCwd',
				},
			],
			output: `const uploadsDir = join(process.cwd(), 'fixtures', 'graphics', 'uploads');`,
		},
		// Multiple levels of traversal for fixtures
		{
			code: `const testFixtures = path.resolve(dirName, '../../../../fixtures/dats');`,
			errors: [
				{
					messageId: 'useProcessCwd',
				},
			],
			output: `const testFixtures = join(process.cwd(), 'fixtures', 'dats');`,
		},
	],
});
