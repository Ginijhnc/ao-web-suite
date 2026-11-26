import { DateadorLayout } from '@Components/pages/dateador/DateadorLayout';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';
import { PageMetadata } from '@Components/shared/PageMeta';
import { PAGES_META } from '@Constants/seo';

export const DateadorPage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<PageMetadata {...PAGES_META.DATEADOR} />
			<AppHeader />
			<DateadorLayout />
		</Container>
	);
};
