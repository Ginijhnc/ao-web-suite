import { icons } from '@Components/icons';
import type { IconName } from '@Components/icons';
import { Spinner } from '@Components/shared/Spinner';
import { cx } from '@emotion/css';
import MuiButton from '@mui/material/Button';
import theme from '@Theme/theme';
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

const getStartIcon = (
	loading: boolean | undefined,
	startIcon: IconName | undefined,
): React.ReactElement | undefined => {
	if (loading) {
		return <Spinner size={0.9} color={theme.palette.text.secondary} />;
	}
	if (startIcon) {
		const Icon = icons[startIcon];
		return <Icon />;
	}
	return undefined;
};

export const Button = ({
	children,
	variant,
	size,
	disabled,
	startIcon,
	endIcon,
	loading,
	className,
	onClick,
	...rest
}: ButtonProps): React.ReactElement => {
	const EndIcon = endIcon ? icons[endIcon] : null;
	const isDisabled = Boolean(disabled) || Boolean(loading);

	return (
		<MuiButton
			disableRipple
			disabled={isDisabled}
			onClick={isDisabled ? undefined : onClick}
			startIcon={getStartIcon(loading, startIcon)}
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
