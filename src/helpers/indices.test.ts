import { describe, it, expect } from 'vitest';
import {
	armasStripped,
	armasWithZeros,
} from '../../tests/fixtures/indices/armas/armas';
import { stripZeroSentinels } from './indices';

describe('stripZeroSentinels', () => {
	it('removes literal 0 placeholders and returns only object entries', () => {
		expect(stripZeroSentinels(armasWithZeros)).toEqual(armasStripped);
	});

	it('returns an empty array when all entries are zero sentinels', () => {
		expect(stripZeroSentinels([0, 0, 0])).toEqual([]);
	});

	it('returns the same entries when there are no zero sentinels', () => {
		expect(stripZeroSentinels(armasStripped)).toEqual(armasStripped);
	});

	it('returns an empty array for an empty input', () => {
		expect(stripZeroSentinels([])).toEqual([]);
	});
});
