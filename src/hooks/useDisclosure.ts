import { useState } from 'react';

/**
 * Manages a boolean open/close state for dialogs and overlays.
 * Centralizes the repetitive open/close handler pairs that would
 * otherwise be duplicated across every component that owns a dialog.
 */
export const useDisclosure = () => {
	const [isOpen, setIsOpen] = useState(false);

	const onOpen = () => {
		setIsOpen(true);
	};

	const onClose = () => {
		setIsOpen(false);
	};

	return { isOpen, onOpen, onClose };
};
