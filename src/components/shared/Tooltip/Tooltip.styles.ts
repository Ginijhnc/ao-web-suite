import { css } from '@emotion/css';
import theme from '@Theme/theme';

export const tooltipPopperStyle = css`
	& .MuiTooltip-tooltip {
		background-color: ${theme.palette.background.default};
		border: 2px solid ${theme.palette.divider};
		border-radius: 0.4em;
		padding: 0.5em 0.8em;
		font-family: inherit;
		font-size: 0.85rem;
		color: ${theme.palette.text.secondary};
	}

	& .MuiTooltip-arrow::before {
		background-color: ${theme.palette.background.default};
		border: 2px solid ${theme.palette.divider};
	}
`;
