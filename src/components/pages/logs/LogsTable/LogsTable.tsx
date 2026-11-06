import { useState } from 'react';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizIcon,
	SearchOffIcon,
} from '@Components/icons';
import { StatusMessage } from '@Components/shared/StatusMessage';
import { Text } from '@Components/shared/Text';
import { LOGS_SELECTORS } from '@Constants/selectors';
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

const DEFAULT_ROWS_PER_PAGE = 10;

const LogTableRow = ({ entry }: LogTableRowProps): React.ReactElement => {
	return (
		<TableRow>
			<TableCell>
				<Text
					renderAs="span"
					variant="body"
					size="xs"
					weight="semiBold"
					className={`${levelBadgeBaseStyle} ${entry.level === 'error' ? levelErrorStyle : levelWarnStyle}`}
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
					onClick={() => {
						/* TO DO - Pendiente */
					}}
				>
					<MoreHorizIcon />
				</button>
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
					onChange={(_event, value) => {
						onPageChange(value - 1);
					}}
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

	const handleToggleSort = () => {
		setSortOrder((prev) => {
			return prev === 'desc' ? 'asc' : 'desc';
		});
		setPage(0);
	};

	const sorted = entries.slice().sort((a, b) => {
		if (sortOrder === 'desc') {
			return b.timestamp.localeCompare(a.timestamp);
		}
		return a.timestamp.localeCompare(b.timestamp);
	});

	const paged = sorted.slice(
		page * DEFAULT_ROWS_PER_PAGE,
		page * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
	);

	if (entries.length === 0) {
		return (
			<StatusMessage
				icon={<SearchOffIcon />}
				title="Sin logs"
				subtitle="No hay logs disponibles aún."
			/>
		);
	}

	return (
		<LogsTableContent
			paged={paged}
			filtered={entries}
			page={page}
			sortOrder={sortOrder}
			onToggleSort={handleToggleSort}
			onPageChange={setPage}
		/>
	);
};
