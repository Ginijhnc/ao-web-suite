import { AssetsSummary } from '@Components/pages/overview/AssetsSummary';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';

export const OverviewPage = (): React.ReactElement => {
	return (
		<Container maxWidth="xl">
			<AppHeader />
			<AssetsSummary />
		</Container>
	);
};
