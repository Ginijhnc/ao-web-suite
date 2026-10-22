import type { IconName } from '@Components/icons';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import type { OverrideProperties } from '@Types/utility-types';

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonSize = 'sm' | 'md';

export type ButtonProps = OverrideProperties<
	MuiButtonProps,
	{
		children: React.ReactNode;
		variant: ButtonVariant;
		size: ButtonSize;
		startIcon?: IconName;
	}
>;
