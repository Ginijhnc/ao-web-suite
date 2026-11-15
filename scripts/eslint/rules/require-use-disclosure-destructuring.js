/** @type {import('eslint').Rule.RuleModule} */
const requireUseDisclosureDestructuring = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Require useDisclosure() calls to use named destructuring with non-generic local bindings.',
		},
		messages: {
			noDestructuring:
				'useDisclosure() must be destructured into named properties. Use `const { isOpen: xIsOpen, onOpen: xOnOpen, onClose: xOnClose } = useDisclosure()` instead.',
			noIdentityRename:
				'"{{key}}" must be renamed to a meaningful local name (e.g. "{{key}}: edit{{Key}}"). Shorthand and identity renames like "{{key}}: {{key}}" are not allowed.',
		},
		schema: [],
	},

	create(context) {
		return {
			VariableDeclarator(node) {
				const isUseDisclosureCall =
					node.init?.type === 'CallExpression' &&
					node.init.callee.type === 'Identifier' &&
					node.init.callee.name === 'useDisclosure';

				if (!isUseDisclosureCall) return;

				if (node.id.type !== 'ObjectPattern') {
					context.report({ node, messageId: 'noDestructuring' });
					return;
				}

				for (const prop of node.id.properties) {
					if (prop.type !== 'Property') continue;
					const keyName = prop.key.name;
					const valueName = prop.value.name;
					if (keyName === valueName) {
						context.report({
							node: prop,
							messageId: 'noIdentityRename',
							data: {
								key: keyName,
								Key:
									keyName.charAt(0).toUpperCase() +
									keyName.slice(1),
							},
						});
					}
				}
			},
		};
	},
};

export default requireUseDisclosureDestructuring;
