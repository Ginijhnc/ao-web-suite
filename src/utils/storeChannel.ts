import type { LogEntry } from '@Stores/logStore';
import type { StoreName } from '@Types/database';

type StoreMessage =
	| { type: 'UPDATED'; store: StoreName }
	| { type: 'CLEARED'; store: StoreName }
	| { type: 'LOG_ENTRIES_UPDATED'; entries: ReadonlyArray<LogEntry> }
	| { type: 'LOG_ENTRIES_CLEARED' };

const channel = new BroadcastChannel('ao-store-sync');

export const broadcastStoreUpdate = (store: StoreName): void => {
	channel.postMessage({ type: 'UPDATED', store } satisfies StoreMessage);
};

export const broadcastStoreClear = (store: StoreName): void => {
	channel.postMessage({ type: 'CLEARED', store } satisfies StoreMessage);
};

export const broadcastLogEntriesUpdate = (
	entries: ReadonlyArray<LogEntry>,
): void => {
	channel.postMessage({
		type: 'LOG_ENTRIES_UPDATED',
		entries,
	} satisfies StoreMessage);
};

export const broadcastLogEntriesClear = (): void => {
	channel.postMessage({
		type: 'LOG_ENTRIES_CLEARED',
	} satisfies StoreMessage);
};

export const onStoreMessage = (
	cb: (msg: StoreMessage) => void,
): (() => void) => {
	const handler = (event: MessageEvent<StoreMessage>) => {
		cb(event.data);
	};
	channel.addEventListener('message', handler);
	return () => {
		channel.removeEventListener('message', handler);
	};
};
