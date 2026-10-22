import type { IconName } from '@Components/icons';

export type ChipProps = {
	label: string;
	icon?: IconName;
	active?: boolean;
	onClick?: () => void;
};
