import casperGif from '@Assets/animations/casper.gif';
import { Text } from '@Components/shared/Text';
import { loaderStyle, overlayStyle } from './LoadingOverlay.styles';
import type { LoadingOverlayProps } from './LoadingOverlay.types';

export const LoadingOverlay = ({
	visible,
}: LoadingOverlayProps): React.ReactElement | null => {
	if (!visible) {
		return null;
	}

	return (
		<div className={overlayStyle}>
			<div>
				<img src={casperGif} alt="Casper" />
				<div>
					<Text renderAs="h4">Cargando</Text>
					<div className={loaderStyle} />
				</div>
			</div>
		</div>
	);
};
