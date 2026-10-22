import { Button } from '@Components/shared/Button';
import { Text } from '@Components/shared/Text';

export const HomePage = (): React.ReactElement => {
	return (
		<div>
			<Text renderAs="h1">AOWeb Suite</Text>
			<Button size="md" variant="primary">
				Get Started
			</Button>
		</div>
	);
};
