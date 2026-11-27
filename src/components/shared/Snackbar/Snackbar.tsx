import { CloseIcon } from '@Components/icons';
import { Text } from '@Components/shared/Text';
import {
	snackbarStyle,
	snackbarActionStyle,
	snackbarCloseButtonStyle,
} from './Snackbar.styles';
import type { SnackbarProps } from './Snackbar.types';

export const Snackbar = ({
	message,
	actionLabel,
	onAction,
	onClose,
}: SnackbarProps): React.ReactElement => {
	return (
		<div className={snackbarStyle}>
			<Text renderAs="span" weight="regular">
				{message}
			</Text>
			<button
				type="button"
				className={snackbarActionStyle}
				onClick={onAction}
			>
				<Text renderAs="span" weight="bold">
					{actionLabel}
				</Text>
			</button>
			<button
				type="button"
				aria-label="Cerrar notificación"
				className={snackbarCloseButtonStyle}
				onClick={onClose}
			>
				<CloseIcon />
			</button>
		</div>
	);
};
