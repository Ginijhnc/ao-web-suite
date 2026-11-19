import { HomeUploaders } from '@Components/pages/home';
import DemoUploadFab from '@Components/pages/home/DemoUploadFab/DemoUploadFab';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';
import { PageMetadata } from '@Components/shared/PageMeta';
import { PAGES_META } from '@Constants/seo';

export const HomePage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<PageMetadata {...PAGES_META.RECURSOS} />
			<AppHeader />
			<HomeUploaders />
			<DemoUploadFab />
		</Container>
	);
};
