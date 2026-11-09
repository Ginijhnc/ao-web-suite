import { CloseIcon } from '@Components/icons';
import { Text } from '@Components/shared/Text';
import { cx } from '@emotion/css';
import Modal from '@mui/material/Modal';
import {
	dialogBaseStyle,
	dialogBodyStyle,
	dialogCloseButtonStyle,
	dialogDividerStyle,
	dialogFooterStyle,
	dialogHeaderStyle,
	dialogIconStyle,
	dialogOverlayStyle,
	dialogSizeStyles,
} from './Dialog.styles';
import type {
	DialogBodyProps,
	DialogCloseButtonProps,
	DialogDividerProps,
	DialogFooterProps,
	DialogHeaderProps,
	DialogIconProps,
	DialogRootProps,
} from './Dialog.types';

const DialogRoot = ({
	open,
	onClose,
	size,
	className,
	children,
}: DialogRootProps) => {
	return (
		<Modal open={open} onClose={onClose}>
			<div className={dialogOverlayStyle}>
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="dialog-title"
					className={cx(
						dialogBaseStyle,
						dialogSizeStyles[size],
						className,
					)}
				>
					<DialogCloseButton onClose={onClose} />
					{children}
				</div>
			</div>
		</Modal>
	);
};

const DialogCloseButton = ({
	onClose,
	...rest
}: DialogCloseButtonProps) => {
	return (
		<button
			type="button"
			className={dialogCloseButtonStyle}
			onClick={onClose}
			aria-label="Cerrar"
			{...rest}
		>
			<CloseIcon />
		</button>
	);
};

const DialogHeader = ({
	title,
	className,
	...rest
}: DialogHeaderProps) => {
	return (
		<div className={cx(dialogHeaderStyle, className)} {...rest}>
			<Text
				renderAs="p"
				id="dialog-title"
				size="xl"
				weight="semiBold"
			>
				{title}
			</Text>
		</div>
	);
};

const DialogIcon = ({ icon, className, ...rest }: DialogIconProps) => {
	const IconComponent = icon;
	return (
		<div className={cx(dialogIconStyle, className)} {...rest}>
			<IconComponent />
		</div>
	);
};

const DialogBody = ({ className, ...rest }: DialogBodyProps) => {
	return <div className={cx(dialogBodyStyle, className)} {...rest} />;
};

const DialogFooter = ({ className, ...rest }: DialogFooterProps) => {
	return <div className={cx(dialogFooterStyle, className)} {...rest} />;
};

const DialogDivider = ({ className, ...rest }: DialogDividerProps) => {
	return <hr className={cx(dialogDividerStyle, className)} {...rest} />;
};

export {
	DialogRoot as Dialog,
	DialogBody,
	DialogCloseButton,
	DialogDivider,
	DialogFooter,
	DialogHeader,
	DialogIcon,
};
