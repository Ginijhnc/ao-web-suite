import firetorchGif from '@Assets/animations/firetorch.gif';
import { Text } from '@Components/shared/Text';
import {
	headerStyle,
	torchImgStyle,
	torchWrapperStyle,
} from './AppHeader.styles';

const Torch = (): React.ReactElement => {
	return (
		<div className={torchWrapperStyle}>
			<img
				src={firetorchGif}
				alt="" // decorative. aria-hidden already hides this from screen readers
				aria-hidden="true"
				className={torchImgStyle}
			/>
		</div>
	);
};

export const AppHeader = (): React.ReactElement => {
	return (
		<header className={headerStyle}>
			<Torch />
			<Text renderAs="h1">AOWeb Suite</Text>
			<Torch />
		</header>
	);
};
