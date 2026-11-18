import { HomeUploaders } from '@Components/pages/home';
import DemoUploadFab from '@Components/pages/home/DemoUploadFab/DemoUploadFab';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';

export const HomePage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<AppHeader />
			<HomeUploaders />
			<DemoUploadFab />
		</Container>
	);
};
