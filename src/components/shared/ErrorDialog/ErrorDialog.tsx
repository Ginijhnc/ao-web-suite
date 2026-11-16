import { ErrorOutlineIcon } from '@Components/icons';
import { Button } from '@Components/shared/Button';
import {
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	DialogIcon,
} from '@Components/shared/Dialog';
import { Text } from '@Components/shared/Text';
import type { ErrorDialogProps } from './ErrorDialog.types';

/**
 * A barebones, generic error dialog: icon + title + message + a single
 * dismiss button. For anything beyond this layout, build a purpose-specific
 * dialog using the Dialog primitives. For an example of that, see
 * LogDetailDialog.
 */
const ErrorDialog = ({
	open,
	title,
	message,
	onClose,
}: ErrorDialogProps) => {
	return (
		<Dialog open={open} onClose={onClose} size="sm">
			<DialogIcon icon={ErrorOutlineIcon} />
			<DialogHeader title={title} />
			<DialogBody>
				<Text renderAs="p" variant="body" size="sm">
					{message}
				</Text>
			</DialogBody>
			<DialogFooter>
				<Button variant="primary" size="sm" onClick={onClose}>
					Aceptar
				</Button>
			</DialogFooter>
		</Dialog>
	);
};

export default ErrorDialog;
