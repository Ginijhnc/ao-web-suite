import { OverviewLayout } from '@Components/pages/overview/OverviewLayout';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';

export const OverviewPage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<AppHeader />
			<OverviewLayout />
		</Container>
	);
};
