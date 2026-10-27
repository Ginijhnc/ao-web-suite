import { INDICES_MESSAGES } from '@Constants/messages';
import { truncateNameList } from '@Utils/file';
import { describe, it, expect } from 'vitest';
import { checkExtensions, checkRecognizedNames } from './indices';

describe('truncateNameList', () => {
	it('joins all names when count is within the limit', () => {
		expect(truncateNameList(['armas', 'cabezas'])).toBe(
			'armas, cabezas',
		);
	});

	it('truncates and appends overflow suffix', () => {
		expect(
			truncateNameList(['armas', 'cabezas', 'cascos', 'cuerpos']),
		).toBe('armas, cabezas, cascos y 1 más');
	});

	it('returns a single name with no suffix', () => {
		expect(truncateNameList(['armas'])).toBe('armas');
	});
});

describe('checkExtensions', () => {
	it('returns valid when all files have a .json extension', () => {
		const files = [new File([], 'armas.json')];
		expect(checkExtensions(files)).toEqual({ valid: true });
	});

	it('rejects the first file with a non-.json extension', () => {
		const files = [new File([], 'armas.exe')];
		const result = checkExtensions(files);
		expect(result.valid).toBe(false);
	});

	it('is case-insensitive', () => {
		const files = [new File([], 'armas.JSON')];
		expect(checkExtensions(files)).toEqual({ valid: true });
	});
});

describe('checkRecognizedNames', () => {
	it('returns valid when all basenames are recognized', () => {
		const files = [
			new File([], 'armas.json'),
			new File([], 'cabezas.json'),
		];
		expect(checkRecognizedNames(files)).toEqual({ valid: true });
	});

	it('rejects and reports all unrecognized basenames', () => {
		const files = [
			new File([], 'armas.json'),
			new File([], 'unknown.json'),
		];
		const result = checkRecognizedNames(files);
		expect(result.valid).toBe(false);
	});

	it('truncates the unrecognized list when it exceeds the limit', () => {
		const files = [
			new File([], 'a.json'),
			new File([], 'b.json'),
			new File([], 'c.json'),
			new File([], 'd.json'),
		];
		const result = checkRecognizedNames(files);
		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.message).toBe(
				INDICES_MESSAGES.UNKNOWN_INDICE(
					'a.json, b.json, c.json y 1 más',
				),
			);
		}
	});
});
