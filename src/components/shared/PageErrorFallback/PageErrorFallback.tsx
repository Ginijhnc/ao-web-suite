import { WarningIcon } from '@Components/icons';
import { Button } from '@Components/shared/Button';
import { Text } from '@Components/shared/Text';
import { containerStyle, iconStyle } from './PageErrorFallback.styles';

export const PageErrorFallback = (): React.ReactElement => {
	const handleReload = () => {
		window.location.reload();
	};

	return (
		<main className={containerStyle}>
			<span className={iconStyle}>
				<WarningIcon />
			</span>
			<Text renderAs="p" variant="body" size="xl" weight="semiBold">
				No se pudo cargar la página
			</Text>
			<Text renderAs="p" variant="body">
				Es posible que haya una nueva versión disponible.
			</Text>
			<Button variant="primary" size="sm" onClick={handleReload}>
				Recargar
			</Button>
		</main>
	);
};
