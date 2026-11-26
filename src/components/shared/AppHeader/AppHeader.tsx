import firetorchGif from '@Assets/animations/firetorch.gif';
import { Text } from '@Components/shared/Text';
import { APP_NAME, ROUTES } from '@Constants/routes';
import { useAssetsReady } from '@Hooks/useAssetsReady';
import { isFirefox } from '@Utils/browser';
import { Link } from 'react-router';
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
	const assetsReady = useAssetsReady();
	const destination = assetsReady ? ROUTES.OVERVIEW : ROUTES.RECURSOS;

	return (
		<header className={headerStyle}>
			<Torch />
			<Link
				to={destination}
				aria-label="Ir al inicio"
				viewTransition={!isFirefox()}
			>
				<Text renderAs="h1">{APP_NAME}</Text>
			</Link>
			<Torch />
		</header>
	);
};
