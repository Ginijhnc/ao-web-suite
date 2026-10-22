import type { ComponentPropsWithoutRef } from 'react';

export type TextElement = keyof Pick<
	React.JSX.IntrinsicElements,
	'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'a'
>;

export type TextVariant = 'body' | 'label';

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

export type TextWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

export type TextProps<T extends TextElement = 'p'> = {
	variant?: TextVariant;
	renderAs?: T;
	size?: TextSize;
	weight?: TextWeight;
} & ComponentPropsWithoutRef<T>;
