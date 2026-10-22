import { HomeHeader, HomeUploaders } from '@Components/pages/home';
import { Container } from '@Components/shared/Container';

export const HomePage = (): React.ReactElement => {
	return (
		<Container maxWidth="xl">
			<HomeHeader />
			<HomeUploaders />
		</Container>
	);
};
