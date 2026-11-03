import { AssetsSummary } from '@Components/pages/overview/AssetsSummary';
import { PendingChangesSummary } from '@Components/pages/overview/PendingChangesSummary';
import { contentStyle, summaryRowStyle } from './OverviewLayout.styles';

export const OverviewLayout = (): React.ReactElement => {
	return (
		<div className={contentStyle}>
			<div className={summaryRowStyle}>
				<AssetsSummary />
				<PendingChangesSummary />
			</div>
		</div>
	);
};
