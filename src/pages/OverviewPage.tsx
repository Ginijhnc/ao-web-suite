import { OverviewLayout } from '@Components/pages/overview/OverviewLayout';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';
import { PageMetadata } from '@Components/shared/PageMeta';
import { PAGES_META } from '@Constants/seo';

export const OverviewPage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<PageMetadata {...PAGES_META.OVERVIEW} />
			<AppHeader />
			<OverviewLayout />
		</Container>
	);
};
