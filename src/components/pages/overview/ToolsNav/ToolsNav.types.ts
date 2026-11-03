import type { RouteValue } from '@Constants/routes';

export type Tool = {
	title: string;
	route: RouteValue | null;
	image: string;
};

export type ToolCardProps = Tool;
