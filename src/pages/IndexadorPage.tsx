import { IndexadorLayout } from '@Components/pages/indexador/IndexadorLayout';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';
import { PageMetadata } from '@Components/shared/PageMeta';
import { PAGES_META } from '@Constants/seo';

export const IndexadorPage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<PageMetadata {...PAGES_META.INDEXADOR} />
			<AppHeader />
			<IndexadorLayout />
		</Container>
	);
};
