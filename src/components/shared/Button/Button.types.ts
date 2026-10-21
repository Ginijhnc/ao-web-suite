import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import type { OverrideProperties } from '@Types/utility-types';

export type ButtonProps = OverrideProperties<
	MuiButtonProps,
	{
		children: React.ReactNode;
		variant: 'primary' | 'secondary';
	}
>;
