import { cx } from '@emotion/css';
import { makeSpinnerStyle } from './Spinner.styles';
import type { SpinnerProps } from './Spinner.types';

export const Spinner = ({
	size,
	color,
	className,
}: SpinnerProps): React.ReactElement => {
	return (
		<span
			role="progressbar"
			aria-label="Cargando"
			className={cx(makeSpinnerStyle(size, color), className)}
		/>
	);
};
