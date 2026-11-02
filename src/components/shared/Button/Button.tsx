import { icons } from '@Components/icons';
import { cx } from '@emotion/css';
import MuiButton from '@mui/material/Button';
import {
	baseButtonStyle,
	mdSizeStyle,
	smSizeStyle,
	primaryButtonStyle,
	secondaryButtonStyle,
} from './Button.styles';
import type {
	ButtonProps,
	ButtonSize,
	ButtonVariant,
} from './Button.types';

const VARIANT_STYLES: Record<ButtonVariant, string> = {
	primary: primaryButtonStyle,
	secondary: secondaryButtonStyle,
};

const SIZE_STYLES: Record<ButtonSize, string> = {
	md: mdSizeStyle,
	sm: smSizeStyle,
};

export const Button = ({
	children,
	variant,
	size,
	disabled,
	startIcon,
	endIcon,
	className,
	onClick,
	...rest
}: ButtonProps): React.ReactElement => {
	const StartIcon = startIcon ? icons[startIcon] : null;
	const EndIcon = endIcon ? icons[endIcon] : null;

	return (
		<MuiButton
			disableRipple
			disabled={disabled}
			onClick={disabled ? undefined : onClick}
			startIcon={StartIcon ? <StartIcon /> : undefined}
			endIcon={EndIcon ? <EndIcon /> : undefined}
			className={cx(
				baseButtonStyle,
				VARIANT_STYLES[variant],
				SIZE_STYLES[size],
				className,
			)}
			{...rest}
		>
			{children}
		</MuiButton>
	);
};
