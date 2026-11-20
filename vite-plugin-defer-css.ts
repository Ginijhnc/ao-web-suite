import { Plugin } from 'vite';

export function deferCssPlugin(): Plugin {
	return {
		name: 'defer-css',
		apply: 'build',
		transformIndexHtml(html) {
			return html.replace(
				/<link\s+rel="stylesheet"[^>]*href="([^"]*)"[^>]*>/g,
				'<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'">\n\t\t<noscript><link rel="stylesheet" href="$1"></noscript>',
			);
		},
	};
}
