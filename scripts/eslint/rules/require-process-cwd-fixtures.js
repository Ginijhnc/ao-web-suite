/** @type {import('eslint').Rule.RuleModule} */
const requireProcessCwdFixtures = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Require fixture paths to use join(process.cwd(), ...) instead of path.resolve() or join() with relative traversal.',
		},
		fixable: 'code',
		messages: {
			useProcessCwd:
				"Use 'join(process.cwd(), ...segments)' pattern instead of relative path traversal for fixture paths.",
		},
		schema: [],
	},

	create(context) {
		return {
			VariableDeclarator(node) {
				if (!node.init) return;

				const init = node.init;

				// Check for path.resolve(dirName, '../../../fixtures/...')
				if (
					init.type === 'CallExpression' &&
					init.callee.type === 'MemberExpression' &&
					init.callee.object.name === 'path' &&
					init.callee.property.name === 'resolve'
				) {
					const args = init.arguments;
					if (args.length >= 2) {
						const secondArg = args[1];
						if (
							secondArg.type === 'Literal' &&
							typeof secondArg.value === 'string' &&
							secondArg.value.includes('fixtures')
						) {
							context.report({
								node,
								messageId: 'useProcessCwd',
								fix(fixer) {
									const relativePath = secondArg.value;
									const segments =
										extractFixtureSegments(
											relativePath,
										);

									if (segments.length === 0) return null;

									const fixedCode = `join(process.cwd(), ${segments.map((s) => `'${s}'`).join(', ')})`;
									return fixer.replaceText(
										init,
										fixedCode,
									);
								},
							});
						}
					}
				}

				// Check for join(__dirname, '../../../fixtures/...')
				if (
					init.type === 'CallExpression' &&
					init.callee.type === 'Identifier' &&
					init.callee.name === 'join'
				) {
					const args = init.arguments;
					if (
						args.length >= 2 &&
						args[0].type === 'Identifier' &&
						args[0].name === '__dirname'
					) {
						const secondArg = args[1];
						if (
							secondArg.type === 'Literal' &&
							typeof secondArg.value === 'string' &&
							secondArg.value.includes('../') &&
							secondArg.value.includes('fixtures')
						) {
							context.report({
								node,
								messageId: 'useProcessCwd',
								fix(fixer) {
									const relativePath = secondArg.value;
									const segments =
										extractFixtureSegments(
											relativePath,
										);

									if (segments.length === 0) return null;

									const fixedCode = `join(process.cwd(), ${segments.map((s) => `'${s}'`).join(', ')})`;
									return fixer.replaceText(
										init,
										fixedCode,
									);
								},
							});
						}
					}
				}
			},
		};
	},
};

function extractFixtureSegments(relativePath) {
	const parts = relativePath.split('/').filter((p) => p && p !== '.');
	const fixtureIndex = parts.indexOf('fixtures');

	if (fixtureIndex === -1) return [];

	return parts.slice(fixtureIndex);
}

export default requireProcessCwdFixtures;
