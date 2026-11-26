import { SettingsLayout } from '@Components/pages/settings/SettingsLayout';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';
import { PageMetadata } from '@Components/shared/PageMeta';
import { PAGES_META } from '@Constants/seo';

export const SettingsPage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<PageMetadata {...PAGES_META.CONFIGURACION} />
			<AppHeader />
			<SettingsLayout />
		</Container>
	);
};
