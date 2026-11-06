import { LogsTable } from '../LogsTable';
import { layoutStyle } from './LogsPageLayout.styles';

export const LogsPageLayout = (): React.ReactElement => {
	return (
		<div className={layoutStyle}>
			<LogsTable />
		</div>
	);
};
