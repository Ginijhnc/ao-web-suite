import type { RefObject } from 'react';

import type { IconName } from '@Components/icons';

export type LogRowMenuAction = {
	label: string;
	icon: IconName;
	onClick: () => void;
};

export type LogRowMenuProps = {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	actions: ReadonlyArray<LogRowMenuAction>;
	paperRef: RefObject<HTMLDivElement | null>;
};
