export type SnackbarProps = {
	message: string;
	actionLabel: string;
	onAction: () => void;
	onClose: () => void;
};
