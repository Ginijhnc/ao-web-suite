// Custom ESLint rule: require-jsdoc-in-helpers
//
// Enforces that every exported function declaration and exported
// arrow-function variable in *Helpers* files has a JSDoc block comment
// immediately preceding it.
//
// Respects the commenting conventions outlined in AGENTS.md #Comments:
//   - JSDoc (/** ... */) for functions and types
//   - Single-line (//) for inline implementation notes
//
// Applied only to files matching **/*[Hh]elpers*.{ts,tsx} and **/helpers/**
// via the file glob in eslint.config.js.

/** @type {import('eslint').Rule.RuleModule} */
const requireJsdocInHelpers = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Require JSDoc comments on exported functions in helper files.',
		},
		messages: {
			missingJsdoc:
				'Exported helper "{{name}}" is missing a JSDoc comment.',
		},
		schema: [],
	},

	create(context) {
		const getJsdocComment = (node) => {
			const sourceCode = context.getSourceCode();
			const comments = sourceCode.getCommentsBefore(node);
			return comments.find((c) => {
				return c.type === 'Block' && c.value.startsWith('*');
			});
		};

		return {
			// export const myFn = (...) => { ... }
			ExportNamedDeclaration(node) {
				const decl = node.declaration;
				if (!decl || decl.type !== 'VariableDeclaration') {
					return;
				}

				for (const declarator of decl.declarations) {
					if (
						!declarator.init ||
						declarator.init.type !== 'ArrowFunctionExpression'
					) {
						continue;
					}

					const name =
						declarator.id.type === 'Identifier'
							? declarator.id.name
							: '<anonymous>';

					if (!getJsdocComment(node)) {
						context.report({
							node,
							messageId: 'missingJsdoc',
							data: { name },
						});
					}
				}
			},

			// export function myFn(...) { ... }
			'ExportNamedDeclaration > FunctionDeclaration'(node) {
				const name = node.id?.name ?? '<anonymous>';

				const exportNode = node.parent;
				if (!getJsdocComment(exportNode)) {
					context.report({
						node: exportNode,
						messageId: 'missingJsdoc',
						data: { name },
					});
				}
			},
		};
	},
};

export default requireJsdocInHelpers;
