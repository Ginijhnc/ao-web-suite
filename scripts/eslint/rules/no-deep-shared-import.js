/** @type {import('eslint').Rule.RuleModule} */
const noDeepSharedImport = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Disallow imports that bypass the barrel export of a component in @Components/shared.',
		},
		messages: {
			deepSharedImport:
				"Import '{{source}}' bypasses the barrel export. Use '{{fix}}' instead.",
		},
		schema: [],
	},

	create(context) {
		return {
			ImportDeclaration(node) {
				const source = node.source.value;
				const match = /^(@Components\/shared\/([^/]+))\/\2$/.exec(
					source,
				);

				if (!match) return;

				context.report({
					node: node.source,
					messageId: 'deepSharedImport',
					data: {
						source,
						fix: match[1],
					},
				});
			},
		};
	},
};

export default noDeepSharedImport;
