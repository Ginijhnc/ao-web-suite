import { DATS_MESSAGES } from '@Constants/messages';
import { describe, it, expect } from 'vitest';
import { checkExtensions, checkRecognizedNames } from './dats';

describe('checkExtensions', () => {
	it('returns valid when all files have a .dat extension', () => {
		const files = [new File([], 'NPCs.dat')];
		expect(checkExtensions(files)).toEqual({ valid: true });
	});

	it('rejects the first file with a non-.dat extension', () => {
		const files = [new File([], 'NPCs.exe')];
		const result = checkExtensions(files);
		expect(result.valid).toBe(false);
	});

	it('is case-insensitive', () => {
		const files = [new File([], 'NPCs.DAT')];
		expect(checkExtensions(files)).toEqual({ valid: true });
	});
});

describe('checkRecognizedNames', () => {
	it('returns valid when all basenames are recognized', () => {
		const files = [
			new File([], 'NPCs.dat'),
			new File([], 'obj.dat'),
			new File([], 'Hechizos.dat'),
		];
		expect(checkRecognizedNames(files)).toEqual({ valid: true });
	});

	it('rejects and reports unrecognized basenames', () => {
		const files = [
			new File([], 'NPCs.dat'),
			new File([], 'unknown.dat'),
		];
		const result = checkRecognizedNames(files);
		expect(result.valid).toBe(false);
	});

	it('is case-insensitive for basename matching', () => {
		const files = [new File([], 'npcs.dat')];
		expect(checkRecognizedNames(files)).toEqual({ valid: true });
	});

	it('truncates the unrecognized list when it exceeds the limit', () => {
		const files = [
			new File([], 'a.dat'),
			new File([], 'b.dat'),
			new File([], 'c.dat'),
			new File([], 'd.dat'),
		];
		const result = checkRecognizedNames(files);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.message).toBe(
				DATS_MESSAGES.UNKNOWN_DAT('a.dat, b.dat, c.dat y 1 más'),
			);
		}
	});
});
