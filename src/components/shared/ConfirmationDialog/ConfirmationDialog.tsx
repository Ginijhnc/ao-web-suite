import { WarningIcon } from '@Components/icons';
import { Button } from '@Components/shared/Button';
import {
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	DialogIcon,
} from '@Components/shared/Dialog';
import { Text } from '@Components/shared/Text';
import type { ConfirmationDialogProps } from './ConfirmationDialog.types';

export const ConfirmationDialog = ({
	open,
	title,
	message,
	confirmLabel = 'Confirmar',
	cancelLabel = 'Cancelar',
	onConfirm,
	onCancel,
}: ConfirmationDialogProps) => {
	return (
		<Dialog open={open} onClose={onCancel} size="sm">
			<DialogIcon icon={WarningIcon} />
			<DialogHeader title={title} />
			<DialogBody>
				<Text renderAs="p" variant="body" size="sm">
					{message}
				</Text>
			</DialogBody>
			<DialogFooter>
				<Button variant="secondary" size="sm" onClick={onCancel}>
					{cancelLabel}
				</Button>
				<Button variant="primary" size="sm" onClick={onConfirm}>
					{confirmLabel}
				</Button>
			</DialogFooter>
		</Dialog>
	);
};
