import type { LogEntry } from '@Stores/logStore';

export type LogDetailDialogProps = {
	entry: LogEntry;
	open: boolean;
	onClose: () => void;
};

export type LogMetaProps = {
	level: LogEntry['level'];
	timestamp: LogEntry['timestamp'];
};
