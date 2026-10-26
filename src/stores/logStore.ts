import { MAX_LOG_ENTRIES, STORE_NAMES } from '@Constants/storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type LogLevel = 'warn' | 'error';

type LogEntry = {
	id: string;
	timestamp: string;
	level: LogLevel;
	message: string;
};

type LogActions = {
	addEntry: (level: LogLevel, message: string) => void;
	clearEntries: () => void;
};

type LogState = {
	// consumers read only; mutations go through actions
	entries: ReadonlyArray<LogEntry>;
	actions: LogActions;
};

const LOGS_INITIAL_STATE: Pick<LogState, 'entries'> = {
	entries: [],
};

const useLogStore = create<LogState>()(
	persist(
		(set, get) => {
			return {
				entries: LOGS_INITIAL_STATE.entries,
				actions: {
					addEntry: (level, message) => {
						const current = [...get().entries];
						current.push({
							id: crypto.randomUUID(),
							timestamp: new Date().toISOString(),
							level,
							message,
						});
						/* Remove only the oldest entry when limit is reached.
						   This maintains a rolling window of recent logs without losing
						   large batches of history at once. */
						if (current.length > MAX_LOG_ENTRIES) {
							current.splice(0, 1);
						}
						set({ entries: current });
					},
					clearEntries: () => {
						return set({
							entries: LOGS_INITIAL_STATE.entries,
						});
					},
				},
			};
		},
		{
			name: STORE_NAMES.LOGS,
			storage: createJSONStorage(() => {
				return localStorage;
			}),
			partialize: (state) => {
				return { entries: state.entries };
			},
		},
	),
);

export const useLogEntries = () => {
	return useLogStore((state) => {
		return state.entries;
	});
};

export const useLogActions = () => {
	return useLogStore((state) => {
		return state.actions;
	});
};

export const getLogActions = () => {
	return useLogStore.getState().actions;
};
