import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
	cleanup();
});

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => {
		return {
			matches: false,
			media: query,
			onchange: null as unknown,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => {},
		};
	},
});
