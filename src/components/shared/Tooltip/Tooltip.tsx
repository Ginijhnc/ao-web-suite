import { useState } from 'react';
import type { ComponentType } from 'react';
import Fade from '@mui/material/Fade';
import type { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';
import { tooltipPopperStyle } from './Tooltip.styles';
import type { TooltipProps } from './Tooltip.types';

const TOOLTIP_ENTER_DELAY_MS = 300;
const TOOLTIP_FADE_DURATION_MS = 150;

let cachedMuiTooltip: ComponentType<MuiTooltipProps> | null = null;
let pendingMuiTooltipImport: Promise<
	ComponentType<MuiTooltipProps>
> | null = null;

export const loadMuiTooltip = (): Promise<
	ComponentType<MuiTooltipProps>
> => {
	if (cachedMuiTooltip) {
		return Promise.resolve(cachedMuiTooltip);
	}
	pendingMuiTooltipImport ??= import('@mui/material/Tooltip').then(
		(module) => {
			cachedMuiTooltip = module.default;
			return module.default;
		},
	);
	return pendingMuiTooltipImport;
};

export const Tooltip = ({
	title,
	children,
	placement,
}: TooltipProps): React.ReactElement => {
	const [MuiTooltip, setMuiTooltip] =
		useState<ComponentType<MuiTooltipProps> | null>(cachedMuiTooltip);

	const handlePointerEnter = (): void => {
		if (MuiTooltip) {
			return;
		}
		void loadMuiTooltip().then(setMuiTooltip);
	};

	if (!MuiTooltip) {
		return (
			<span
				onPointerEnter={handlePointerEnter}
				style={{ display: 'contents' }}
			>
				{children}
			</span>
		);
	}

	return (
		<MuiTooltip
			title={title}
			placement={placement}
			arrow
			enterDelay={TOOLTIP_ENTER_DELAY_MS}
			enterNextDelay={TOOLTIP_ENTER_DELAY_MS}
			slots={{ transition: Fade }}
			slotProps={{
				popper: { className: tooltipPopperStyle },
				transition: { timeout: TOOLTIP_FADE_DURATION_MS },
			}}
		>
			{children}
		</MuiTooltip>
	);
};
