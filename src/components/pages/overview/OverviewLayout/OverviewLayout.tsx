import { AssetsSummary } from '@Components/pages/overview/AssetsSummary';
import { LogsSummary } from '@Components/pages/overview/LogsSummary';
import { PendingChangesSummary } from '@Components/pages/overview/PendingChangesSummary';
import { ToolsNav } from '@Components/pages/overview/ToolsNav';
import { contentStyle, summaryRowStyle } from './OverviewLayout.styles';

export const OverviewLayout = (): React.ReactElement => {
	return (
		<div className={contentStyle}>
			<div className={summaryRowStyle}>
				<AssetsSummary />
				<PendingChangesSummary />
			</div>
			<ToolsNav />
			<LogsSummary />
		</div>
	);
};
