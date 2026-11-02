import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const themePath = resolve(__dirname, '../../../src/theme/theme.ts');
const themeSource = readFileSync(themePath, 'utf8');

const HSL_PATTERN = /hsl\([^)]+\)/g;
const PALETTE_BLOCK_PATTERN = /palette\s*:\s*\{([\s\S]*?)\},\s*components/;

const paletteBlock = themeSource.match(PALETTE_BLOCK_PATTERN)?.[1] ?? '';
const themePaletteColors = new Set(paletteBlock.match(HSL_PATTERN) ?? []);

/** @type {import('eslint').Rule.RuleModule} */
const noHardcodedThemeColors = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Disallow hardcoded HSL colors that already exist in theme.palette.',
		},
		messages: {
			hardcodedThemeColor:
				'"{{color}}" is a theme palette color. Use the theme token instead (e.g. theme.palette.background.paper).',
		},
		schema: [],
	},

	create(context) {
		return {
			TaggedTemplateExpression(node) {
				const tag = node.tag;
				const isCssTag =
					(tag.type === 'Identifier' && tag.name === 'css') ||
					(tag.type === 'MemberExpression' &&
						tag.property.name === 'css');

				if (!isCssTag) return;

				for (const quasi of node.quasi.quasis) {
					const text = quasi.value.raw;
					const matches = text.match(HSL_PATTERN) ?? [];
					for (const color of matches) {
						if (themePaletteColors.has(color)) {
							context.report({
								node: quasi,
								messageId: 'hardcodedThemeColor',
								data: { color },
							});
						}
					}
				}
			},

			Literal(node) {
				if (typeof node.value !== 'string') return;
				if (!themePaletteColors.has(node.value)) return;
				if (node.parent.type !== 'Property') return;

				context.report({
					node,
					messageId: 'hardcodedThemeColor',
					data: { color: node.value },
				});
			},
		};
	},
};

export default noHardcodedThemeColors;
