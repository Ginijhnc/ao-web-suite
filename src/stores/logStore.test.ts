import { MAX_LOG_ENTRIES } from '@Constants/storage';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	getLogActions,
	useLogStore,
	LOGS_INITIAL_STATE,
} from './logStore';

const getEntries = () => {
	return useLogStore.getState().entries;
};

const ENTRY_IDS = {
	first: '00000000-0000-0000-0000-000000000001',
	second: '00000000-0000-0000-0000-000000000002',
	third: '00000000-0000-0000-0000-000000000003',
} as const;

/* Mock crypto.randomUUID to return deterministic IDs for testing delete logic.
  Goal is not to test UUID generation, but to verify the delete-by-ID logic works. */
const mockRandomUuid = (id: ReturnType<typeof crypto.randomUUID>) => {
	return vi.spyOn(crypto, 'randomUUID').mockReturnValue(id);
};

beforeEach(() => {
	vi.restoreAllMocks();
	getLogActions().clearEntries();
});

describe('addEntry', () => {
	it('adds a log entry with warn level', () => {
		getLogActions().addEntry('warn', 'test warning');
		expect(getEntries()).toMatchObject([
			{ level: 'warn', message: 'test warning' },
		]);
	});

	it('adds a log entry with error level', () => {
		getLogActions().addEntry('error', 'test error');
		expect(getEntries()).toMatchObject([
			{ level: 'error', message: 'test error' },
		]);
	});

	it('generates a unique id for each entry', () => {
		vi.spyOn(crypto, 'randomUUID')
			.mockReturnValueOnce(ENTRY_IDS.first)
			.mockReturnValueOnce(ENTRY_IDS.second);
		getLogActions().addEntry('warn', 'message 1');
		getLogActions().addEntry('warn', 'message 2');
		expect(
			getEntries().map(({ id }) => {
				return id;
			}),
		).toEqual([ENTRY_IDS.first, ENTRY_IDS.second]);
	});

	it('sets timestamp in ISO format', () => {
		getLogActions().addEntry('warn', 'test');
		expect(
			getEntries().map(({ timestamp }) => {
				return timestamp;
			}),
		).toEqual([
			expect.stringMatching(
				/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
			),
		]);
	});

	it('maintains insertion order', () => {
		getLogActions().addEntry('warn', 'first');
		getLogActions().addEntry('error', 'second');
		getLogActions().addEntry('warn', 'third');
		expect(
			getEntries().map(({ message }) => {
				return message;
			}),
		).toEqual(['first', 'second', 'third']);
	});

	it('removes the oldest entry when max entries is exceeded', () => {
		for (let i = 0; i < MAX_LOG_ENTRIES + 1; i++) {
			getLogActions().addEntry('warn', `message ${i}`);
		}
		expect(getEntries()).toHaveLength(MAX_LOG_ENTRIES);
		expect(
			getEntries().map(({ message }) => {
				return message;
			}),
		).toEqual(
			Array.from({ length: MAX_LOG_ENTRIES }, (_, index) => {
				return `message ${index + 1}`;
			}),
		);
	});

	it('maintains rolling window behavior over multiple additions beyond max', () => {
		for (let i = 0; i < MAX_LOG_ENTRIES + 5; i++) {
			getLogActions().addEntry('warn', `message ${i}`);
		}
		expect(getEntries()).toHaveLength(MAX_LOG_ENTRIES);
		expect(
			getEntries().map(({ message }) => {
				return message;
			}),
		).toEqual(
			Array.from({ length: MAX_LOG_ENTRIES }, (_, index) => {
				return `message ${index + 5}`;
			}),
		);
	});
});

describe('clearEntries', () => {
	it('removes all entries', () => {
		getLogActions().addEntry('warn', 'test 1');
		getLogActions().addEntry('error', 'test 2');
		getLogActions().clearEntries();
		expect(getEntries()).toHaveLength(0);
	});

	it('is a no-op on an already empty store', () => {
		getLogActions().clearEntries();
		getLogActions().clearEntries();
		expect(getEntries()).toHaveLength(0);
	});

	it('reuses the same initial state reference when clearing', () => {
		getLogActions().addEntry('warn', 'test');
		getLogActions().clearEntries();
		expect(getEntries()).toBe(LOGS_INITIAL_STATE.entries);
	});
});

describe('deleteEntry', () => {
	it('returns true and removes an existing entry', () => {
		mockRandomUuid(ENTRY_IDS.first);
		getLogActions().addEntry('warn', 'test');
		expect(getLogActions().deleteEntry(ENTRY_IDS.first)).toBe(true);
		expect(getEntries()).toHaveLength(0);
	});

	it('returns false for a non-existent id', () => {
		getLogActions().addEntry('warn', 'test');
		expect(getLogActions().deleteEntry('non-existent-id')).toBe(false);
		expect(getEntries()).toHaveLength(1);
	});

	it('deletes the correct entry when multiple exist', () => {
		vi.spyOn(crypto, 'randomUUID')
			.mockReturnValueOnce(ENTRY_IDS.first)
			.mockReturnValueOnce(ENTRY_IDS.second)
			.mockReturnValueOnce(ENTRY_IDS.third);
		getLogActions().addEntry('warn', 'first');
		getLogActions().addEntry('warn', 'second');
		getLogActions().addEntry('warn', 'third');
		expect(getLogActions().deleteEntry(ENTRY_IDS.second)).toBe(true);
		expect(
			getEntries().map(({ message }) => {
				return message;
			}),
		).toEqual(['first', 'third']);
	});

	it('can delete from either end of the list', () => {
		vi.spyOn(crypto, 'randomUUID')
			.mockReturnValueOnce(ENTRY_IDS.first)
			.mockReturnValueOnce(ENTRY_IDS.second)
			.mockReturnValueOnce(ENTRY_IDS.third);
		getLogActions().addEntry('warn', 'first');
		getLogActions().addEntry('warn', 'second');
		getLogActions().addEntry('warn', 'third');
		getLogActions().deleteEntry(ENTRY_IDS.first);
		getLogActions().deleteEntry(ENTRY_IDS.third);
		expect(
			getEntries().map(({ message }) => {
				return message;
			}),
		).toEqual(['second']);
	});
});

describe('getLogActions', () => {
	it('returns callable actions without subscription', () => {
		const actions = getLogActions();
		expect(typeof actions.addEntry).toBe('function');
		expect(typeof actions.clearEntries).toBe('function');
		expect(typeof actions.deleteEntry).toBe('function');
	});

	it('can modify state without React', () => {
		getLogActions().addEntry('warn', 'test');
		expect(getEntries()).toHaveLength(1);
	});
});

describe('entry count', () => {
	it('updates after adding, deleting, and clearing entries', () => {
		vi.spyOn(crypto, 'randomUUID')
			.mockReturnValueOnce(ENTRY_IDS.first)
			.mockReturnValueOnce(ENTRY_IDS.second);
		getLogActions().addEntry('warn', 'test 1');
		getLogActions().addEntry('warn', 'test 2');
		expect(getEntries()).toHaveLength(2);
		getLogActions().deleteEntry(ENTRY_IDS.first);
		expect(getEntries()).toHaveLength(1);
		getLogActions().clearEntries();
		expect(getEntries()).toHaveLength(0);
	});
});

describe('LogEntry type validation', () => {
	it('creates entries with all required fields', () => {
		getLogActions().addEntry('warn', 'test message');
		expect(
			getEntries().every((entry) => {
				return (
					typeof entry.id === 'string' &&
					typeof entry.timestamp === 'string' &&
					entry.level === 'warn' &&
					entry.message === 'test message'
				);
			}),
		).toBe(true);
	});

	it('entry id is a valid UUID', () => {
		getLogActions().addEntry('warn', 'test');
		expect(
			getEntries().map(({ id }) => {
				return id;
			}),
		).toEqual([
			expect.stringMatching(
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
			),
		]);
	});
});

describe('integration scenarios', () => {
	it('handles mixed warn and error entries', () => {
		getLogActions().addEntry('warn', 'warning 1');
		getLogActions().addEntry('error', 'error 1');
		getLogActions().addEntry('warn', 'warning 2');
		expect(
			getEntries().map(({ level }) => {
				return level;
			}),
		).toEqual(['warn', 'error', 'warn']);
	});

	it('supports the full workflow: add, delete, clear', () => {
		vi.spyOn(crypto, 'randomUUID')
			.mockReturnValueOnce(ENTRY_IDS.first)
			.mockReturnValueOnce(ENTRY_IDS.second)
			.mockReturnValueOnce(ENTRY_IDS.third);
		getLogActions().addEntry('warn', 'test 1');
		getLogActions().addEntry('warn', 'test 2');
		getLogActions().addEntry('warn', 'test 3');
		getLogActions().deleteEntry(ENTRY_IDS.second);
		expect(
			getEntries().map(({ message }) => {
				return message;
			}),
		).toEqual(['test 1', 'test 3']);
		getLogActions().clearEntries();
		expect(getEntries()).toHaveLength(0);
	});

	it('handles the max entries boundary correctly', () => {
		for (let i = 0; i < MAX_LOG_ENTRIES; i++) {
			getLogActions().addEntry('warn', `message ${i}`);
		}
		getLogActions().addEntry('warn', `message ${MAX_LOG_ENTRIES}`);
		expect(getEntries()).toHaveLength(MAX_LOG_ENTRIES);
		expect(
			getEntries().map(({ message }) => {
				return message;
			}),
		).toEqual(
			Array.from({ length: MAX_LOG_ENTRIES }, (_, index) => {
				return `message ${index + 1}`;
			}),
		);
	});

	it('allows deleting entries and then adding new ones', () => {
		vi.spyOn(crypto, 'randomUUID')
			.mockReturnValueOnce(ENTRY_IDS.first)
			.mockReturnValueOnce(ENTRY_IDS.second)
			.mockReturnValueOnce(ENTRY_IDS.third);
		getLogActions().addEntry('warn', 'test 1');
		getLogActions().addEntry('warn', 'test 2');
		getLogActions().deleteEntry(ENTRY_IDS.first);
		getLogActions().addEntry('warn', 'test 3');
		expect(
			getEntries().map(({ message }) => {
				return message;
			}),
		).toEqual(['test 2', 'test 3']);
	});
});
