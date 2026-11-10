/**
 * Builds a prefetch function for a lazy-loaded page's chunk, so the
 * Suspense fallback rarely has anything to wait on by the time the
 * user actually navigates there. The returned function is safe to
 * call on every render: the import only fires once per page thanks
 * to the guard, and the browser's module cache makes repeat imports
 * free regardless.
 */
export const createPagePrefetcher = (
	importPage: () => Promise<unknown>,
): (() => void) => {
	let prefetched = false;

	return (): void => {
		if (prefetched) {
			return;
		}
		prefetched = true;
		void importPage();
	};
};

/**
 * Issues a GET for each given image URL ahead of time, so the
 * response is likely already in the browser's HTTP cache by the
 * time the real <img> tags render.
 */
const prefetchImages = (sources: ReadonlyArray<string>): void => {
	sources.forEach((src) => {
		const img = new Image();
		img.src = src;
	});
};

export const prefetchOverviewPage = createPagePrefetcher(async () => {
	const [
		overviewPageModule,
		{ default: dateadorImg },
		{ default: indexadorImg },
		{ default: mapeadorImg },
	] = await Promise.all([
		import('@Pages/OverviewPage'),
		import('@Assets/images/pages/dateador.png'),
		import('@Assets/images/pages/indexador.png'),
		import('@Assets/images/pages/mapeador.png'),
	]);

	prefetchImages([dateadorImg, indexadorImg, mapeadorImg]);

	return overviewPageModule;
});

export const prefetchLogsPage = createPagePrefetcher(async () => {
	return import('@Pages/LogsPage');
});

export const prefetchLogRowActions = createPagePrefetcher(async () => {
	const [, , { default: borderSquareImg }] = await Promise.all([
		import('@Components/pages/logs/LogsTable/LogRowMenu'),
		import('@Components/pages/logs/LogsTable/LogDetailDialog'),
		import('@Assets/images/textures/border_square.png'),
	]);

	prefetchImages([borderSquareImg]);
});
