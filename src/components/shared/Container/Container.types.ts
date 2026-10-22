import type { ComponentPropsWithoutRef } from 'react';
import type { BREAKPOINTS } from '@Theme/theme';

export type ContainerMaxWidth = keyof typeof BREAKPOINTS;

export type ContainerProps = {
	maxWidth: ContainerMaxWidth;
} & ComponentPropsWithoutRef<'div'>;
