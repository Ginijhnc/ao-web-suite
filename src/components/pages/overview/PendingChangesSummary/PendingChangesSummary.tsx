import { CloudUploadIcon, CloudDoneIcon } from '@Components/icons';
import { Text } from '@Components/shared/Text';
import {
	cardStyle,
	emptyStateStyle,
	titleStyle,
} from './PendingChangesSummary.styles';

/* TO DO - Pendiente: hardcodeado por ahora. en el futuro consultará
   los cambios pendientes de exportación */
const HAS_PENDING_CHANGES = false as boolean;

const PendingState = (): React.ReactElement => {
	return (
		<>
			<CloudUploadIcon />
			<Text renderAs="span" variant="body">
				Hay cambios pendientes de exportar.
			</Text>
		</>
	);
};

const EmptyState = (): React.ReactElement => {
	return (
		<>
			<CloudDoneIcon />
			<Text renderAs="span" variant="body">
				No hay cambios para exportar.
			</Text>
		</>
	);
};

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
				Exportación
			</Text>
			<div className={emptyStateStyle}>
				{HAS_PENDING_CHANGES ? <PendingState /> : <EmptyState />}
			</div>
		</div>
	);
};
