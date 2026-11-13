import { test } from '@playwright/test';
import { assertPageChunkFailureShowsFallback } from './flows/pageChunkError';

test('app: page chunk load failure shows error fallback', async ({
	page,
}) => {
	await assertPageChunkFailureShowsFallback(page);
});
