import { describe, it, expect } from 'vitest';
import { getReplacedNames } from './useFileUploader';

describe('getReplacedNames', () => {
	it('matches the new upload against the stored key case-insensitively', () => {
		const files = [
			{ name: 'Cabezas.json' } as File,
			{ name: 'armas.json' } as File,
		];
		// 'cabezas.json' is the original, already-stored key.
		// 'Cabezas.json' is the new upload being validated.
		expect(getReplacedNames(files, ['cabezas.json'])).toEqual([
			'cabezas.json',
		]);
	});

	it('returns an empty array when nothing collides', () => {
		const files = [{ name: 'armas.json' } as File];
		expect(getReplacedNames(files, ['cabezas.json'])).toEqual([]);
	});

	it('preserves the casing of the stored key, not the new upload', () => {
		const files = [{ name: 'HECHIZOS.DAT' } as File];
		expect(getReplacedNames(files, ['hechizos.dat'])).toEqual([
			'hechizos.dat',
		]);
	});

	it('deduplicates when multiple selected files collide with the same stored key', () => {
		const files = [
			{ name: 'Cabezas.json' } as File,
			{ name: 'CABEZAS.JSON' } as File,
		];
		expect(getReplacedNames(files, ['cabezas.json'])).toEqual([
			'cabezas.json',
		]);
	});

	it('returns an empty array on a first-ever upload, when nothing is stored yet', () => {
		const files = [{ name: 'cabezas.json' } as File];
		expect(getReplacedNames(files, [])).toEqual([]);
	});

	it('returns an empty array when no files were selected', () => {
		expect(getReplacedNames([], ['cabezas.json'])).toEqual([]);
	});

	it('reports every distinct stored key that the selected files collide with', () => {
		const files = [
			{ name: 'cabezas.json' } as File,
			{ name: 'cascos.json' } as File,
			{ name: 'armas.json' } as File,
		];
		expect(
			getReplacedNames(files, ['cabezas.json', 'cascos.json']),
		).toEqual(['cabezas.json', 'cascos.json']);
	});
});
