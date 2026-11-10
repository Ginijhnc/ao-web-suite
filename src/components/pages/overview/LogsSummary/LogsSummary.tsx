import { LogsIcon } from '@Components/icons';
import { Button } from '@Components/shared/Button';
import { Text } from '@Components/shared/Text';
import { ROUTES } from '@Constants/routes';
import { cx } from '@emotion/css';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLogEntries } from '@Stores/logStore';
import theme from '@Theme/theme';
import { formatDayMonthYearTime } from '@Utils/date';
import { prefetchLogsPage } from '@Utils/prefetcher';
import { useNavigate } from 'react-router';
import {
	cardStyle,
	emptyStateStyle,
	entryStyle,
	headerRowStyle,
	levelBadgeBaseStyle,
	levelErrorStyle,
	levelWarnStyle,
	messageStyle,
	timestampStyle,
	titleStyle,
} from './LogsSummary.styles';
import type { LogEntryRowProps } from './LogsSummary.types';

const MAX_PREVIEW_ENTRIES = 5;

const EmptyState = (): React.ReactElement => {
	return (
		<div className={emptyStateStyle}>
			<LogsIcon />
			<Text renderAs="span" variant="body">
				Sin registros recientes.
			</Text>
		</div>
	);
};

const LogEntryRow = ({ entry }: LogEntryRowProps): React.ReactElement => {
	return (
		<div className={entryStyle}>
			<Text
				renderAs="span"
				variant="body"
				size="xs"
				className={cx(
					levelBadgeBaseStyle,
					entry.level === 'error'
						? levelErrorStyle
						: levelWarnStyle,
				)}
			>
				{entry.level === 'error' ? 'Error' : 'Warn'}
			</Text>
			<Text
				renderAs="span"
				variant="body"
				size="sm"
				className={timestampStyle}
			>
				{formatDayMonthYearTime(entry.timestamp)}
			</Text>
			<Text
				renderAs="span"
				variant="body"
				size="sm"
				className={messageStyle}
			>
				{entry.message}
			</Text>
		</div>
	);
};

export const LogsSummary = (): React.ReactElement => {
	const entries = useLogEntries();
	const navigate = useNavigate();
	const isMobile = useMediaQuery(
		`(max-width: ${theme.breakpoints.values.md}em)`,
	);
	const recent = entries.slice(-MAX_PREVIEW_ENTRIES).reverse();

	return (
		<div className={cardStyle} onMouseEnter={prefetchLogsPage}>
			<div className={headerRowStyle}>
				<Text
					renderAs="p"
					variant="label"
					weight="semiBold"
					size="lg"
					className={titleStyle}
				>
					Últimos logs
				</Text>
				<Button
					size={isMobile ? 'sm' : 'md'}
					variant="secondary"
					endIcon="ArrowForwardIcon"
					disabled={recent.length === 0}
					onClick={() => {
						void navigate(ROUTES.LOGS);
					}}
				>
					Ver todos
				</Button>
			</div>
			{recent.length === 0 ? (
				<EmptyState />
			) : (
				recent.map((entry) => {
					return <LogEntryRow key={entry.id} entry={entry} />;
				})
			)}
		</div>
	);
};
