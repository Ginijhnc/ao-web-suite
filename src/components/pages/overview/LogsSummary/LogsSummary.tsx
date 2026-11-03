import { Button } from '@Components/shared/Button';
import { Text } from '@Components/shared/Text';
import { ROUTES } from '@Constants/routes';
import { cx } from '@emotion/css';
import { useLogEntries } from '@Stores/logStore';
import { formatDayMonthYearTime } from '@Utils/date';
import { useNavigate } from 'react-router';
import {
	cardStyle,
	emptyStyle,
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
			<Text renderAs="span" variant="body" className={messageStyle}>
				{entry.message}
			</Text>
		</div>
	);
};

export const LogsSummary = (): React.ReactElement => {
	const entries = useLogEntries();
	const navigate = useNavigate();
	const recent = entries.slice(-MAX_PREVIEW_ENTRIES).reverse();

	return (
		<div className={cardStyle}>
			<div className={headerRowStyle}>
				<Text
					renderAs="p"
					variant="label"
					weight="semiBold"
					size="lg"
					className={titleStyle}
				>
					Logs
				</Text>
				<Button
					size="md"
					variant="secondary"
					endIcon="ArrowForwardIcon"
					onClick={() => {
						void navigate(ROUTES.LOGS);
					}}
				>
					Ver todos
				</Button>
			</div>
			{recent.length === 0 ? (
				<Text renderAs="p" variant="body" className={emptyStyle}>
					Sin registros recientes.
				</Text>
			) : (
				recent.map((entry) => {
					return <LogEntryRow key={entry.id} entry={entry} />;
				})
			)}
		</div>
	);
};
