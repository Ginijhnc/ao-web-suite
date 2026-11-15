import { RuleTester } from 'eslint';
import rule from './require-use-disclosure-destructuring.js';

const tester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

tester.run('require-use-disclosure-destructuring', rule, {
	valid: [
		// Full destructure with suffix prefix (fundIsOpen style)
		{
			code: `const { isOpen: editIsOpen, onOpen: editOnOpen, onClose: editOnClose } = useDisclosure()`,
		},
		// Full destructure with leading prefix (isEditOpen style)
		{
			code: `const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()`,
		},
		// Partial destructure: only some of the three real properties
		{
			code: `const { isOpen: deleteIsOpen, onOpen: deleteOnOpen } = useDisclosure()`,
		},
		// Multiple valid calls in the same block
		{
			code: `
        const { isOpen: editIsOpen, onOpen: editOnOpen, onClose: editOnClose } = useDisclosure()
        const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure()
      `,
		},
		// Not useDisclosure: plain identifier assignment is fine
		{
			code: `const detail = useSomethingElse()`,
		},
		// Not useDisclosure: object pattern without rename is fine
		{
			code: `const { isOpen, onOpen } = useSomethingElse()`,
		},
	],
	invalid: [
		// Plain identifier
		{
			code: `const detail = useDisclosure()`,
			errors: [{ messageId: 'noDestructuring' }],
		},
		// Any plain identifier name
		{
			code: `const disclosure = useDisclosure()`,
			errors: [{ messageId: 'noDestructuring' }],
		},
		// Array destructure
		{
			code: `const [isOpen, onOpen] = useDisclosure()`,
			errors: [{ messageId: 'noDestructuring' }],
		},
		// Shorthand (implicit identity rename)
		{
			code: `const { isOpen, onOpen, onClose } = useDisclosure()`,
			errors: [
				{
					messageId: 'noIdentityRename',
					data: { key: 'isOpen', Key: 'IsOpen' },
				},
				{
					messageId: 'noIdentityRename',
					data: { key: 'onOpen', Key: 'OnOpen' },
				},
				{
					messageId: 'noIdentityRename',
					data: { key: 'onClose', Key: 'OnClose' },
				},
			],
		},
		// Explicit identity rename (isOpen: isOpen)
		{
			code: `const { isOpen: isOpen, onOpen: onOpen } = useDisclosure()`,
			errors: [
				{
					messageId: 'noIdentityRename',
					data: { key: 'isOpen', Key: 'IsOpen' },
				},
				{
					messageId: 'noIdentityRename',
					data: { key: 'onOpen', Key: 'OnOpen' },
				},
			],
		},
		// Mixed: one renamed correctly, one identity rename
		{
			code: `const { isOpen: editIsOpen, onOpen: onOpen } = useDisclosure()`,
			errors: [
				{
					messageId: 'noIdentityRename',
					data: { key: 'onOpen', Key: 'OnOpen' },
				},
			],
		},
		// Multiple bad calls: two plain identifiers
		{
			code: `
        const detail = useDisclosure()
        const deletion = useDisclosure()
      `,
			errors: [
				{ messageId: 'noDestructuring' },
				{ messageId: 'noDestructuring' },
			],
		},
	],
});
