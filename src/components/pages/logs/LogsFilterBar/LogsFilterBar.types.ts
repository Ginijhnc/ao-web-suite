import type { LogLevel } from '@Stores/logStore';

export type LevelFilter = LogLevel | 'all';

export type LogsFilterBarProps = {
	level: LevelFilter;
	onLevelChange: (level: LevelFilter) => void;
	search: string;
	onSearchChange: (value: string) => void;
};
