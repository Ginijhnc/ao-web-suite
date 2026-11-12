import type { LogEntry } from '@Stores/logStore';

export type SortOrder = 'asc' | 'desc';

export type LogsTableProps = {
	entries: ReadonlyArray<LogEntry>;
};

export type LogsTableHeaderProps = {
	sortOrder: SortOrder;
	onToggleSort: () => void;
};

export type LogsTableContentProps = {
	paged: ReadonlyArray<LogEntry>;
	filtered: ReadonlyArray<LogEntry>;
	page: number;
	sortOrder: SortOrder;
	onToggleSort: () => void;
	onPageChange: (next: number) => void;
};

export type LogTableRowProps = {
	entry: LogEntry;
};

export type LogRowActionsCellProps = LogTableRowProps;
