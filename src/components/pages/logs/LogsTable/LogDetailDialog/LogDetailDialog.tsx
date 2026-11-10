import { CodeBlock } from '@Components/shared/CodeBlock';
import {
	Dialog,
	DialogBody,
	DialogHeader,
} from '@Components/shared/Dialog';
import { Text } from '@Components/shared/Text';
import { cx } from '@emotion/css';
import { formatDayMonthYearTime } from '@Utils/date';
import {
	levelBadgeBaseStyle,
	levelErrorStyle,
	levelWarnStyle,
} from '../LogsTable.styles';
import { dateTextStyle, metaRowStyle } from './LogDetailDialog.styles';
import type {
	LogDetailDialogProps,
	LogMetaProps,
} from './LogDetailDialog.types';

const LogMeta = ({ level, timestamp }: LogMetaProps) => {
	return (
		<div className={metaRowStyle}>
			<div>
				<Text renderAs="span" variant="label">
					{'Nivel: '}
				</Text>
				<Text
					renderAs="span"
					variant="body"
					size="xs"
					weight="semiBold"
					className={cx(
						levelBadgeBaseStyle,
						level === 'error'
							? levelErrorStyle
							: levelWarnStyle,
					)}
				>
					{level === 'error' ? 'Error' : 'Warn'}
				</Text>
			</div>
			<div>
				<Text renderAs="span" variant="label">
					{'Fecha: '}
				</Text>
				<Text
					renderAs="span"
					variant="body"
					size="sm"
					className={dateTextStyle}
				>
					{formatDayMonthYearTime(timestamp)}
				</Text>
			</div>
		</div>
	);
};

export const LogDetailDialog = ({
	entry,
	open,
	onClose,
}: LogDetailDialogProps) => {
	return (
		<Dialog open={open} onClose={onClose} size="lg">
			<DialogHeader title="Detalle del log" />
			<DialogBody>
				<CodeBlock code={entry.message} />
				<LogMeta level={entry.level} timestamp={entry.timestamp} />
			</DialogBody>
		</Dialog>
	);
};
