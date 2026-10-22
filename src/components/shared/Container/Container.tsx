import { cx } from '@emotion/css';
import { baseContainerStyle, maxWidthStyles } from './Container.styles';
import type { ContainerProps } from './Container.types';

export const Container = ({
	maxWidth,
	className,
	children,
	...rest
}: ContainerProps): React.ReactElement => {
	return (
		<div
			className={cx(
				baseContainerStyle,
				maxWidthStyles[maxWidth],
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	);
};
