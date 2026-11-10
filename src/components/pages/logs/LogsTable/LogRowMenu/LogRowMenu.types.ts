import type { RefObject } from 'react';

export type LogRowMenuProps = {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	onShowDetail: () => void;
	paperRef: RefObject<HTMLDivElement | null>;
};
