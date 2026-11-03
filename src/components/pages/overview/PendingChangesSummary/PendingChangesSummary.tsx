import { Text } from '@Components/shared/Text';
import { cardStyle, titleStyle } from './PendingChangesSummary.styles';

/* TO DO - Pendiente: hardcodeado por ahora. en el futuro consultará
   los cambios pendientes de exportación */
export const PendingChangesSummary = (): React.ReactElement => {
	return (
		<div className={cardStyle}>
			<Text
				renderAs="p"
				variant="label"
				weight="semiBold"
				size="lg"
				className={titleStyle}
			>
				Cambios sin exportar
			</Text>
			<Text renderAs="p" variant="body">
				No hay cambios para exportar.
			</Text>
		</div>
	);
};
