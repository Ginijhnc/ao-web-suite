import { cx } from '@emotion/css';
import {
	baseTextStyle,
	bodyStyle,
	labelStyle,
	sizeStyles,
	weightStyles,
} from './Text.styles';
import type { TextElement, TextProps, TextVariant } from './Text.types';

const VARIANT_STYLES: Record<TextVariant, string> = {
	body: bodyStyle,
	label: labelStyle,
};

export const Text = <T extends TextElement = 'p'>({
	variant,
	renderAs,
	size,
	weight,
	className,
	...rest
}: TextProps<T>): React.ReactElement => {
	const Tag = (renderAs ?? 'p') as React.ElementType;

	return (
		<Tag
			className={cx(
				baseTextStyle,
				variant ? VARIANT_STYLES[variant] : undefined,
				size ? sizeStyles[size] : undefined,
				weight ? weightStyles[weight] : undefined,
				className,
			)}
			{...rest}
		/>
	);
};
