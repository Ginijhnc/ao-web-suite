import firetorchGif from '@Assets/animations/firetorch.gif';
import { Text } from '@Components/shared/Text';
import {
	headerStyle,
	torchImgStyle,
	torchWrapperStyle,
} from './HomeHeader.styles';

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

export const HomeHeader = (): React.ReactElement => {
	return (
		<header className={headerStyle}>
			<Torch />
			<Text renderAs="h1">AOWeb Suite</Text>
			<Torch />
		</header>
	);
};
