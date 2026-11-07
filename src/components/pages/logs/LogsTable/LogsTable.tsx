import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizIcon,
	SearchOffIcon,
} from '@Components/icons';
import { StatusMessage } from '@Components/shared/StatusMessage';
import { Text } from '@Components/shared/Text';
import { LOGS_SELECTORS } from '@Constants/selectors';
import { cx } from '@emotion/css';
import { useDebounce } from '@Hooks/useDebounce';
import {
	Pagination,
	PaginationItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { formatDayMonthYearTime } from '@Utils/date';
import { LogsFilterBar } from '../LogsFilterBar';
import type { LevelFilter } from '../LogsFilterBar/LogsFilterBar.types';
import {
	actionCellStyle,
	dateCellStyle,
	levelBadgeBaseStyle,
	levelErrorStyle,
	levelWarnStyle,
	messageCellStyle,
	paginationItemStyle,
	paginationStyle,
	sortButtonStyle,
	tableContainerStyle,
	tableStyle,
} from './LogsTable.styles';
import type {
	LogTableRowProps,
	LogsTableContentProps,
	LogsTableHeaderProps,
	LogsTableProps,
	SortOrder,
} from './LogsTable.types';

const LogRowMenu = lazy(() => {
	return import('./LogRowMenu').then((m) => {
		return { default: m.LogRowMenu };
	});
});

const DEFAULT_ROWS_PER_PAGE = 10;

const LogTableRow = ({ entry }: LogTableRowProps): React.ReactElement => {
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
	const paperRef = useRef<HTMLDivElement | null>(null);

	const handleOpenMenu = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		setMenuAnchor(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setMenuAnchor(null);
	};

	/*
	 * Syncing with an external scroll event is a genuine side effect.
	 * The paper is hidden synchronously via DOM to prevent MUI's Popover
	 * from repositioning it before React can unmount it.
	 */
	useEffect(() => {
		if (menuAnchor === null) return;
		const onScroll = () => {
			if (paperRef.current) {
				paperRef.current.style.visibility = 'hidden';
			}
			setMenuAnchor(null);
		};
		window.addEventListener('scroll', onScroll, { capture: true });
		return () => {
			window.removeEventListener('scroll', onScroll, {
				capture: true,
			});
		};
	}, [menuAnchor]);

	return (
		<TableRow>
			<TableCell>
				<Text
					renderAs="span"
					variant="body"
					size="xs"
					weight="semiBold"
					className={cx(
						levelBadgeBaseStyle,
						entry.level === 'error'
							? levelErrorStyle
							: levelWarnStyle,
					)}
				>
					{entry.level === 'error' ? 'Error' : 'Warn'}
				</Text>
			</TableCell>
			<TableCell className={dateCellStyle}>
				<Text renderAs="span" variant="body" size="sm">
					{formatDayMonthYearTime(entry.timestamp)}
				</Text>
			</TableCell>
			<TableCell className={messageCellStyle}>
				<Text renderAs="span" variant="body" size="sm">
					{entry.message}
				</Text>
			</TableCell>
			<TableCell className={actionCellStyle}>
				<button
					type="button"
					aria-label="Ver mensaje completo"
					onClick={handleOpenMenu}
				>
					<MoreHorizIcon />
				</button>
				<Suspense fallback={null}>
					<LogRowMenu
						anchorEl={menuAnchor}
						onClose={handleCloseMenu}
						paperRef={paperRef}
					/>
				</Suspense>
			</TableCell>
		</TableRow>
	);
};

const LogsTableHeader = ({
	sortOrder,
	onToggleSort,
}: LogsTableHeaderProps): React.ReactElement => {
	return (
		<TableHead>
			<TableRow>
				<TableCell width="14%">
					<Text
						renderAs="span"
						variant="label"
						weight="semiBold"
					>
						Nivel
					</Text>
				</TableCell>
				<TableCell width="20%">
					<button
						type="button"
						className={sortButtonStyle}
						onClick={onToggleSort}
						aria-label={
							sortOrder === 'desc'
								? 'Ordenar por fecha ascendente'
								: 'Ordenar por fecha descendente'
						}
					>
						<Text
							renderAs="span"
							variant="label"
							weight="semiBold"
						>
							Fecha
						</Text>
						{sortOrder === 'desc' ? (
							<ChevronLeftIcon
								style={{ transform: 'rotate(-90deg)' }}
							/>
						) : (
							<ChevronRightIcon
								style={{ transform: 'rotate(-90deg)' }}
							/>
						)}
					</button>
				</TableCell>
				<TableCell>
					<Text
						renderAs="span"
						variant="label"
						weight="semiBold"
					>
						Mensaje
					</Text>
				</TableCell>
				<TableCell width="6%" aria-label="Acciones" />
			</TableRow>
		</TableHead>
	);
};

const LogsTableContent = ({
	paged,
	filtered,
	page,
	sortOrder,
	onToggleSort,
	onPageChange,
}: LogsTableContentProps): React.ReactElement => {
	const handlePageChange = (
		_event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		onPageChange(value - 1);
	};

	return (
		<TableContainer className={tableContainerStyle}>
			<Table className={tableStyle}>
				<LogsTableHeader
					sortOrder={sortOrder}
					onToggleSort={onToggleSort}
				/>
				<TableBody>
					{paged.map((entry) => {
						return (
							<LogTableRow key={entry.id} entry={entry} />
						);
					})}
				</TableBody>
			</Table>
			<div className={paginationStyle}>
				<Text
					renderAs="span"
					variant="body"
					size="sm"
					data-testid={LOGS_SELECTORS.PAGINATION_SUMMARY}
				>
					{`Mostrando ${page * DEFAULT_ROWS_PER_PAGE + 1}-${Math.min((page + 1) * DEFAULT_ROWS_PER_PAGE, filtered.length)} de ${filtered.length}`}
				</Text>
				<Pagination
					count={Math.ceil(
						filtered.length / DEFAULT_ROWS_PER_PAGE,
					)}
					page={page + 1}
					variant="outlined"
					shape="rounded"
					onChange={handlePageChange}
					renderItem={(item) => {
						return (
							<PaginationItem
								{...item}
								className={paginationItemStyle}
							/>
						);
					}}
				/>
			</div>
		</TableContainer>
	);
};

export const LogsTable = ({
	entries,
}: LogsTableProps): React.ReactElement => {
	const [page, setPage] = useState(0);
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
	const [level, setLevel] = useState<LevelFilter>('all');
	const [rawSearch, setRawSearch] = useState('');
	const search = useDebounce(rawSearch, 400);

	const handleLevelChange = (next: LevelFilter) => {
		setLevel(next);
		setPage(0);
	};

	const handleSearchChange = (value: string) => {
		setRawSearch(value);
		setPage(0);
	};

	const handleToggleSort = () => {
		setSortOrder((prev) => {
			return prev === 'desc' ? 'asc' : 'desc';
		});
		setPage(0);
	};

	const filtered = entries.filter((entry) => {
		const matchesLevel = level === 'all' || entry.level === level;
		const matchesSearch =
			search === '' ||
			entry.message.toLowerCase().includes(search.toLowerCase());
		return matchesLevel && matchesSearch;
	});

	const sorted = filtered.slice().sort((a, b) => {
		if (sortOrder === 'desc') {
			return b.timestamp.localeCompare(a.timestamp);
		}
		return a.timestamp.localeCompare(b.timestamp);
	});

	const paged = sorted.slice(
		page * DEFAULT_ROWS_PER_PAGE,
		(page + 1) * DEFAULT_ROWS_PER_PAGE,
	);

	return (
		<>
			<LogsFilterBar
				level={level}
				onLevelChange={handleLevelChange}
				search={rawSearch}
				onSearchChange={handleSearchChange}
			/>

			{filtered.length === 0 ? (
				<StatusMessage
					icon={<SearchOffIcon />}
					title={
						entries.length > 0 ? 'Sin resultados' : 'Sin logs'
					}
					subtitle={
						entries.length > 0
							? 'Intenta cambiar el filtro o el término de búsqueda.'
							: 'No hay logs disponibles aún.'
					}
				/>
			) : (
				<LogsTableContent
					paged={paged}
					filtered={filtered}
					page={page}
					sortOrder={sortOrder}
					onToggleSort={handleToggleSort}
					onPageChange={setPage}
				/>
			)}
		</>
	);
};
