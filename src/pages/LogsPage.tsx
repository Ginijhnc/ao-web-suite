import { LogsPageLayout } from '@Components/pages/logs/LogsPageLayout';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';

export const LogsPage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<AppHeader />
			<LogsPageLayout />
		</Container>
	);
};
