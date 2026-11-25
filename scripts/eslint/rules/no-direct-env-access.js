/** @type {import('eslint').Rule.RuleModule} */
const noImportMetaEnv = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Disallow direct import.meta.env and process.env access outside src/env.ts.',
		},
		messages: {
			noImportMetaEnv:
				"Avoid import.meta.env. Import 'env' from 'src/env.ts' and add the variable to src/vite-env.d.ts if missing.",
			noProcessEnv:
				"Avoid process.env. Import 'env' from 'src/env.ts' and add the variable to src/vite-env.d.ts if missing.",
		},
		schema: [],
	},

	create(context) {
		return {
			MemberExpression(node) {
				if (
					node.object.type === 'MemberExpression' &&
					node.object.object.type === 'MetaProperty' &&
					node.object.object.meta.name === 'import' &&
					node.object.object.property.name === 'meta' &&
					node.object.property.name === 'env'
				) {
					context.report({ node, messageId: 'noImportMetaEnv' });
				}

				if (
					node.object.type === 'MemberExpression' &&
					node.object.object.type === 'Identifier' &&
					node.object.object.name === 'process' &&
					node.object.property.name === 'env'
				) {
					context.report({ node, messageId: 'noProcessEnv' });
				}
			},
		};
	},
};

export default noImportMetaEnv;
