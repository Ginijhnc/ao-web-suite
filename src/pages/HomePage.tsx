import { HomeUploaders } from '@Components/pages/home';
import { AppHeader } from '@Components/shared/AppHeader';
import { Container } from '@Components/shared/Container';

export const HomePage = (): React.ReactElement => {
	return (
		<Container maxWidth="lg">
			<AppHeader />
			<HomeUploaders />
		</Container>
	);
};
