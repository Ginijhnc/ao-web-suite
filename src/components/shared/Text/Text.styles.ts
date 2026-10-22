import { css } from '@emotion/css';
import theme, { BREAKPOINTS } from '@Theme/theme';
import type { TextSize, TextWeight } from './Text.types';

/* Applied to every <Text> instance. Sets the default color, heading sizes/weights
 * scoped to Text, and link decoration behavior. */
export const baseTextStyle = css`
	color: ${theme.palette.text.primary};
	line-height: 1.4;

	h1& {
		font-size: 2.7rem;
		font-weight: 600;
		line-height: 1.1;

		@media (min-width: ${BREAKPOINTS.md}em) {
			font-size: 3.5rem;
		}
	}

	h2& {
		font-size: 2rem;
		font-weight: 600;
		line-height: 1.1;

		@media (min-width: ${BREAKPOINTS.md}em) {
			font-size: 3rem;
		}
	}

	h3& {
		font-size: 1.7rem;
		font-weight: 600;
		line-height: 1.2;

		@media (min-width: ${BREAKPOINTS.md}em) {
			font-size: 2.25rem;
		}
	}

	h4& {
		font-size: 1.3rem;
		font-weight: 500;
		line-height: 1.3;

		@media (min-width: ${BREAKPOINTS.md}em) {
			font-size: 1.5rem;
		}
	}

	h5& {
		font-size: 1.2rem;
		font-weight: 500;
		line-height: 1.3;

		@media (min-width: ${BREAKPOINTS.md}em) {
			font-size: 1.375rem;
		}
	}

	h6& {
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.4;

		@media (min-width: ${BREAKPOINTS.md}em) {
			font-size: 1.125rem;
		}
	}

	a& {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-decoration-color: ${theme.palette.text.primary};

		&:hover {
			text-decoration-thickness: 2px;
		}
	}
`;

// Style preset for the "body" variant.
export const bodyStyle = css`
	font-size: 1rem;
	font-weight: 400;
`;

// Smaller secondary text for field labels and tags.
export const labelStyle = css`
	font-size: 0.875rem;
	font-weight: 500;
	color: ${theme.palette.text.secondary};
`;

// One-off font-size overrides. Only applied when the size prop is explicitly passed.
export const sizeStyles: Record<TextSize, string> = {
	xs: css`
		font-size: 0.75rem;
	`,
	sm: css`
		font-size: 0.875rem;
	`,
	base: css`
		font-size: 1rem;
	`,
	lg: css`
		font-size: 1.125rem;
	`,
	xl: css`
		font-size: 1.25rem;
	`,
};

// One-off font-weight overrides. Only applied when the weight prop is explicitly passed.
export const weightStyles: Record<TextWeight, string> = {
	regular: css`
		font-weight: 400;
	`,
	medium: css`
		font-weight: 500;
	`,
	semiBold: css`
		font-weight: 600;
	`,
	bold: css`
		font-weight: 700;
	`,
};
