import { Button } from '@Components/shared/Button';
import { Container } from '@Components/shared/Container';
import { Text } from '@Components/shared/Text';

export const HomePage = (): React.ReactElement => {
	return (
		<Container maxWidth="xl">
			<Text renderAs="h1">AOWeb Suite</Text>
			<Button size="md" variant="primary">
				Get Started
			</Button>
		</Container>
	);
};
