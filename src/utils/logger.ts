import { getLogActions } from '@Stores/logStore';

/**
 * Converts an object to text so it can be stored as a log
 * entry in localStorage.
 */
const stringifyArg = (arg: object): string => {
	try {
		return JSON.stringify(arg);
	} catch {
		return '[object]';
	}
};

/**
 * Flattens a list of log arguments into a single string so
 * they can be stored as a log entry in localStorage. All
 * current call sites pass a single pre-formatted string, but
 * this handles mixed-type arguments defensively.
 */
const serialize = (args: ReadonlyArray<unknown>): string => {
	const parts: Array<string> = [];

	for (const arg of args) {
		if (arg instanceof Error) {
			parts.push(arg.message);
			continue;
		}
		if (typeof arg === 'object' && arg !== null) {
			parts.push(stringifyArg(arg));
			continue;
		}
		parts.push(String(arg));
	}

	return parts.join(' ');
};

const error = (...rest: Array<unknown>): void => {
	// eslint-disable-next-line no-restricted-syntax
	console.error(...rest);
	getLogActions().addEntry('error', serialize(rest));
};

const warn = (...rest: Array<unknown>): void => {
	// eslint-disable-next-line no-restricted-syntax
	console.warn(...rest);
	getLogActions().addEntry('warn', serialize(rest));
};

export const log = { error, warn } as const;
