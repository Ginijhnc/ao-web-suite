import MuiButton from '@mui/material/Button';
import type { ButtonProps } from './Button.types';

export const Button = ({
	children,
	variant,
	...rest
}: ButtonProps): React.ReactElement => {
	return (
		<MuiButton variant={variant} {...rest}>
			{children}
		</MuiButton>
	);
};
