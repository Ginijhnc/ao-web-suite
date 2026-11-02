import { RuleTester } from 'eslint';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const themePath = resolve(__dirname, '../../../src/theme/theme.ts');

// hsl(0, 0%, 14%)    -- palette.primary.main (forbidden)
// hsl(357, 75%, 58%) -- palette.error.main (forbidden)
// hsl(210, 30%, 20%) -- components override only (allowed)
const themeFixture = `
const theme = createTheme({
	palette: {
		primary: { main: 'hsl(0, 0%, 14%)' },
		error: { main: 'hsl(357, 75%, 58%)' },
	},
	components: {
		MuiPaginationItem: {
			styleOverrides: {
				root: { color: 'hsl(210, 30%, 20%)' },
			},
		},
	},
});
`;

const originalTheme = readFileSync(themePath, 'utf8');
writeFileSync(themePath, themeFixture, 'utf8');

// Import after writing so the rule reads the fixture
const { default: rule } = await import('./no-hardcoded-theme-colors.js');

writeFileSync(themePath, originalTheme, 'utf8');

const tester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

tester.run('no-hardcoded-theme-colors', rule, {
	valid: [
		// HSL color not in the palette is fine in a css tag
		{
			code: 'const s = css`color: hsl(200, 50%, 50%)`',
		},
		// Palette color inside a non-css tagged template is fine
		{
			code: 'const s = html`color: hsl(0, 0%, 14%)`',
		},
		// Palette color as a string literal outside a Property is fine
		{
			code: `const x = 'hsl(0, 0%, 14%)'`,
		},
		// Non-HSL string literal inside a Property is fine
		{
			code: `const obj = { color: 'red' }`,
		},
		// Color only in components overrides, not in palette, is fine
		{
			code: 'const s = css`color: hsl(210, 30%, 20%)`',
		},
		{
			code: `const obj = { color: 'hsl(210, 30%, 20%)' }`,
		},
	],
	invalid: [
		// Palette color inside a css tagged template
		{
			code: 'const s = css`color: hsl(0, 0%, 14%)`',
			errors: [
				{
					messageId: 'hardcodedThemeColor',
					data: { color: 'hsl(0, 0%, 14%)' },
				},
			],
		},
		// Another palette color inside a css tagged template
		{
			code: 'const s = css`border-color: hsl(357, 75%, 58%)`',
			errors: [
				{
					messageId: 'hardcodedThemeColor',
					data: { color: 'hsl(357, 75%, 58%)' },
				},
			],
		},
		// Palette color as a string literal value in an object Property
		{
			code: `const obj = { color: 'hsl(0, 0%, 14%)' }`,
			errors: [
				{
					messageId: 'hardcodedThemeColor',
					data: { color: 'hsl(0, 0%, 14%)' },
				},
			],
		},
		// Multiple palette colors in one css template
		{
			code: 'const s = css`color: hsl(0, 0%, 14%); border: hsl(357, 75%, 58%)`',
			errors: [
				{
					messageId: 'hardcodedThemeColor',
					data: { color: 'hsl(0, 0%, 14%)' },
				},
				{
					messageId: 'hardcodedThemeColor',
					data: { color: 'hsl(357, 75%, 58%)' },
				},
			],
		},
	],
});
