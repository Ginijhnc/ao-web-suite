import type { DirectionalEntry } from '@Types/indices';

export const armasWithZeros: Array<DirectionalEntry | number> = [
	0,
	{ down: 4719, left: 4718, right: 4720, id: 1, up: 4721 },
	0,
	{ down: 4723, left: 4722, right: 4724, id: 3, up: 4725 },
	{ down: 23621, left: 23623, right: 23624, id: 75, up: 23622 },
	{ down: 10269, left: 10268, right: 10270, id: 4, up: 10271 },
	0,
	0,
	0,
];

export const armasStripped: Array<DirectionalEntry> = [
	{ down: 4719, left: 4718, right: 4720, id: 1, up: 4721 },
	{ down: 4723, left: 4722, right: 4724, id: 3, up: 4725 },
	{ down: 23621, left: 23623, right: 23624, id: 75, up: 23622 },
	{ down: 10269, left: 10268, right: 10270, id: 4, up: 10271 },
];
