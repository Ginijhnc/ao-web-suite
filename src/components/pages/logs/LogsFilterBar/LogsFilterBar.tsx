import type { IconName } from '@Components/icons';
import { CloseIcon, SearchIcon } from '@Components/icons';
import { Chip } from '@Components/shared/Chip';
import { InputAdornment, TextField } from '@mui/material';
import {
	barStyle,
	chipsGroupStyle,
	clearButtonStyle,
	searchFieldStyle,
} from './LogsFilterBar.styles';
import type {
	LevelFilter,
	LogsFilterBarProps,
} from './LogsFilterBar.types';

const LEVEL_OPTIONS: ReadonlyArray<{
	value: LevelFilter;
	label: string;
	icon?: IconName;
}> = [
	{ value: 'all', label: 'Todos' },
	{ value: 'error', label: 'Error', icon: 'ErrorFilledIcon' },
	{ value: 'warn', label: 'Warn', icon: 'WarningIcon' },
];

export const LogsFilterBar = ({
	level,
	onLevelChange,
	search,
	onSearchChange,
}: LogsFilterBarProps): React.ReactElement => {
	return (
		<div className={barStyle}>
			<div className={chipsGroupStyle}>
				{LEVEL_OPTIONS.map((option) => {
					return (
						<Chip
							key={option.value}
							label={option.label}
							icon={option.icon}
							active={level === option.value}
							onClick={() => {
								onLevelChange(option.value);
							}}
						/>
					);
				})}
			</div>
			<TextField
				className={searchFieldStyle}
				size="small"
				placeholder="Buscar por mensaje"
				value={search}
				onChange={(e) => {
					onSearchChange(e.target.value);
				}}
				slotProps={{
					htmlInput: { 'aria-label': 'Buscar por mensaje' },
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon aria-hidden />
							</InputAdornment>
						),
						endAdornment: search.length > 0 && (
							<InputAdornment position="end">
								<button
									type="button"
									className={clearButtonStyle}
									aria-label="Limpiar búsqueda"
									onClick={() => {
										onSearchChange('');
									}}
								>
									<CloseIcon aria-hidden />
								</button>
							</InputAdornment>
						),
					},
				}}
			/>
		</div>
	);
};
