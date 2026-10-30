import type { IndiceName } from '@Constants/indices';
import type { ParsedIndice } from '@Helpers/indices';
import { describe, it, expect, beforeEach } from 'vitest';
import { getIndicesActions, useIndicesStore } from './indicesStore';

const makeIndice = (
	name: IndiceName,
	entries: Array<unknown> = [],
): ParsedIndice => {
	return { name, entries };
};

const getIndices = () => {
	return useIndicesStore.getState().indices;
};

beforeEach(() => {
	getIndicesActions().clear();
});

describe('setIndices', () => {
	it('populates the map keyed by name', () => {
		getIndicesActions().setIndices([
			makeIndice('armas'),
			makeIndice('cabezas'),
		]);
		const map = getIndices();
		expect(map.size).toBe(2);
		expect(map.has('armas')).toBe(true);
		expect(map.has('cabezas')).toBe(true);
	});

	it('replaces previously loaded indices on a second call', () => {
		getIndicesActions().setIndices([makeIndice('armas')]);
		getIndicesActions().setIndices([makeIndice('cabezas')]);
		const map = getIndices();
		expect(map.size).toBe(1);
		expect(map.has('cabezas')).toBe(true);
		expect(map.has('armas')).toBe(false);
	});
});

describe('upsertIndices', () => {
	it('adds new indices without wiping existing ones', () => {
		getIndicesActions().setIndices([makeIndice('armas')]);
		getIndicesActions().upsertIndices([makeIndice('cabezas')]);
		const map = getIndices();
		expect(map.size).toBe(2);
		expect(map.has('armas')).toBe(true);
		expect(map.has('cabezas')).toBe(true);
	});

	it('overwrites an entry for a name that already exists', () => {
		getIndicesActions().setIndices([makeIndice('armas', [{ id: 1 }])]);
		getIndicesActions().upsertIndices([
			makeIndice('armas', [{ id: 2 }]),
		]);
		expect(getIndices().get('armas')?.entries).toEqual([{ id: 2 }]);
	});

	it('is a no-op on an empty array', () => {
		getIndicesActions().setIndices([makeIndice('armas')]);
		getIndicesActions().upsertIndices([]);
		expect(getIndices().size).toBe(1);
	});

	it('leaves unaffected entries intact when only a subset is upserted', () => {
		getIndicesActions().setIndices([
			makeIndice('armas', [{ id: 1 }]),
			makeIndice('cabezas', [{ id: 2 }]),
			makeIndice('cascos', [{ id: 3 }]),
			makeIndice('cuerpos', [{ id: 4 }]),
		]);
		getIndicesActions().upsertIndices([
			makeIndice('armas', [{ id: 99 }]),
			makeIndice('cabezas', [{ id: 99 }]),
		]);
		const map = getIndices();
		expect(map.size).toBe(4);
		expect(map.get('cascos')?.entries).toEqual([{ id: 3 }]);
		expect(map.get('cuerpos')?.entries).toEqual([{ id: 4 }]);
	});
});

describe('full upload flow', () => {
	it('re-uploading the same indices overwrites their content', () => {
		getIndicesActions().setIndices([]);
		getIndicesActions().upsertIndices([
			makeIndice('armas', [{ id: 1 }]),
			makeIndice('cabezas', [{ id: 2 }]),
		]);
		getIndicesActions().upsertIndices([
			makeIndice('armas', [{ id: 99 }]),
			makeIndice('cabezas', [{ id: 99 }]),
		]);
		const map = getIndices();
		expect(map.size).toBe(2);
		expect(map.get('armas')?.entries).toEqual([{ id: 99 }]);
		expect(map.get('cabezas')?.entries).toEqual([{ id: 99 }]);
	});

	it('re-uploading a subset overwrites only those entries and leaves the rest intact', () => {
		getIndicesActions().setIndices([]);
		getIndicesActions().upsertIndices([
			makeIndice('armas', [{ id: 1 }]),
			makeIndice('cabezas', [{ id: 2 }]),
			makeIndice('cascos', [{ id: 3 }]),
		]);
		getIndicesActions().upsertIndices([
			makeIndice('armas', [{ id: 99 }]),
		]);
		const map = getIndices();
		expect(map.size).toBe(3);
		expect(map.get('armas')?.entries).toEqual([{ id: 99 }]);
		expect(map.get('cabezas')?.entries).toEqual([{ id: 2 }]);
		expect(map.get('cascos')?.entries).toEqual([{ id: 3 }]);
	});
});

describe('clear', () => {
	it('empties the map', () => {
		getIndicesActions().setIndices([
			makeIndice('armas'),
			makeIndice('cabezas'),
		]);
		getIndicesActions().clear();
		const map = getIndices();
		expect(map.size).toBe(0);
		expect(map.has('armas')).toBe(false);
		expect(map.has('cabezas')).toBe(false);
	});
});
