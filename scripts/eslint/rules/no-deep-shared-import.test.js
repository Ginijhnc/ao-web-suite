import { RuleTester } from 'eslint';
import rule from './no-deep-shared-import.js';

const tester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
});

tester.run('no-deep-shared-import', rule, {
	valid: [
		// Barrel import is fine
		{
			code: `import { Button } from '@Components/shared/Button'`,
		},
		// Deep import into a different segment name is fine (Button/ButtonIcon)
		{
			code: `import { ButtonIcon } from '@Components/shared/Button/ButtonIcon'`,
		},
		// Non-shared import is fine
		{
			code: `import { something } from '@Components/pages/Logs'`,
		},
		// Unrelated package is fine
		{
			code: `import { useState } from 'react'`,
		},
	],
	invalid: [
		// Repeating the segment name is the pattern that bypasses the barrel
		{
			code: `import { Button } from '@Components/shared/Button/Button'`,
			errors: [
				{
					messageId: 'deepSharedImport',
					data: {
						source: '@Components/shared/Button/Button',
						fix: '@Components/shared/Button',
					},
				},
			],
		},
		{
			code: `import { StatusMessage } from '@Components/shared/StatusMessage/StatusMessage'`,
			errors: [
				{
					messageId: 'deepSharedImport',
					data: {
						source: '@Components/shared/StatusMessage/StatusMessage',
						fix: '@Components/shared/StatusMessage',
					},
				},
			],
		},
	],
});
