import { useLogEntries } from '@Stores/logStore';
import { LogsTable } from '../LogsTable';
import { layoutStyle } from './LogsPageLayout.styles';

export const LogsPageLayout = (): React.ReactElement => {
	const entries = useLogEntries();

	return (
		<div className={layoutStyle}>
			<LogsTable entries={entries} />
		</div>
	);
};
