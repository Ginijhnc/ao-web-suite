import { LogsPageLayout } from '@Components/pages/logs/LogsPageLayout';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';
import { PageMetadata } from '@Components/shared/PageMeta';
import { PAGES_META } from '@Constants/seo';

export const LogsPage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<PageMetadata {...PAGES_META.LOGS} />
			<AppHeader />
			<LogsPageLayout />
		</Container>
	);
};
