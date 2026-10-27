import { readFileSync } from 'fs';
import { join } from 'path';
import { GRAPHICS_ACCEPTED_EXTENSIONS } from '@Constants/graphics';
import { hasValidExtension } from '@Utils/file';
import { describe, it, expect } from 'vitest';
import {
	checkDuplicateExtensions,
	hasValidMagicBytes,
	validateGraphicsFiles,
} from './graphics';

const fixturesDir = join(
	process.cwd(),
	'fixtures',
	'graphics',
	'magic-byte',
);

/**
 * Loads a binary fixture image by filename and wraps it in a File object.
 * Fixture images are minimal valid or intentionally mismatched files used
 * to test magic byte validation without constructing byte arrays inline.
 */
const loadMagicByteImage = (name: string): File => {
	const buffer = readFileSync(join(fixturesDir, name));
	return new File([buffer], name);
};

describe('hasValidExtension', () => {
	it('accepts a file whose name ends in a listed extension', () => {
		expect(
			hasValidExtension('sprite.png', GRAPHICS_ACCEPTED_EXTENSIONS),
		).toBe(true);
	});

	it('rejects a file with an unlisted extension', () => {
		expect(
			hasValidExtension('archive.exe', GRAPHICS_ACCEPTED_EXTENSIONS),
		).toBe(false);
	});

	it('is case-insensitive', () => {
		expect(
			hasValidExtension('sprite.PNG', GRAPHICS_ACCEPTED_EXTENSIONS),
		).toBe(true);
	});
});

describe('hasValidMagicBytes', () => {
	it('returns true for a valid PNG', async () => {
		expect(
			await hasValidMagicBytes(loadMagicByteImage('valid.png')),
		).toBe(true);
	});

	it('returns true for a valid JPEG', async () => {
		expect(
			await hasValidMagicBytes(loadMagicByteImage('valid.jpg')),
		).toBe(true);
	});

	it('returns true for a valid AVIF (non-zero offset)', async () => {
		expect(
			await hasValidMagicBytes(loadMagicByteImage('valid.avif')),
		).toBe(true);
	});

	it('returns false when bytes do not match the extension', async () => {
		expect(
			await hasValidMagicBytes(loadMagicByteImage('fake.png')),
		).toBe(false);
	});

	it('returns false for an unknown extension', async () => {
		expect(
			await hasValidMagicBytes(loadMagicByteImage('archive.exe')),
		).toBe(false);
	});
});

describe('validateGraphicsFiles', () => {
	it('rejects when extension is valid but magic bytes do not match', async () => {
		const result = await validateGraphicsFiles([
			loadMagicByteImage('fake.png'),
		]);
		expect(result.valid).toBe(false);
	});
});

describe('checkDuplicateExtensions', () => {
	it('allows replacement when batch file matches an existing key exactly', () => {
		const files = [new File([], '4006.png')];
		const existingKeys = ['4006.png'];
		expect(checkDuplicateExtensions(files, existingKeys)).toEqual({
			valid: true,
		});
	});

	it('rejects when batch contains same basename with different extensions', () => {
		const files = [new File([], '4006.png'), new File([], '4006.bmp')];
		const result = checkDuplicateExtensions(files, []);
		expect(result.valid).toBe(false);
	});

	it('rejects when batch file conflicts with an existing key extension', () => {
		const files = [new File([], '4006.bmp')];
		const existingKeys = ['4006.png'];
		const result = checkDuplicateExtensions(files, existingKeys);
		expect(result.valid).toBe(false);
	});

	it('rejects when batch has both a replacement and a conflicting extension', () => {
		const files = [new File([], '4006.png'), new File([], '4006.bmp')];
		const existingKeys = ['4006.png'];
		const result = checkDuplicateExtensions(files, existingKeys);
		expect(result.valid).toBe(false);
	});
});
