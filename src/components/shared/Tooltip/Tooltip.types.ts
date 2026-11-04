export type TooltipPlacement = 'right' | 'top' | 'bottom' | 'left';

export type TooltipProps = {
	title: string;
	children: React.ReactElement;
	placement: TooltipPlacement;
};
