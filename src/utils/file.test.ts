import { describe, expect, it } from 'vitest';
import { readFileAsText } from './file';

describe('readFileAsText', () => {
	it('falls back to Windows-1252 for a legacy DAT file', async () => {
		/*
		 * Plain ASCII except for 0xf1, which is valid as "ñ" under
		 * Windows-1252 but an invalid standalone byte under strict
		 * UTF-8, forcing the fallback path.
		 */
		const file = new File(
			[
				Uint8Array.from([
					0x4e, 0x61, 0x6d, 0x65, 0x3d, 0x43, 0x61, 0xf1, 0x61,
				]),
			],
			'NPCs.dat',
		);

		await expect(readFileAsText(file)).resolves.toBe('Name=Caña');
	});
});
