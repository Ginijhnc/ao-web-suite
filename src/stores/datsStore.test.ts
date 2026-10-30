import type { DatName } from '@Constants/dats';
import type { ParsedDat } from '@Helpers/dats';
import { describe, it, expect, beforeEach } from 'vitest';
import { getDatsActions, useDatsStore } from './datsStore';

const makeDat = (name: DatName, data: unknown = {}): ParsedDat => {
	return { name, data };
};

const getDats = () => {
	return useDatsStore.getState().dats;
};

beforeEach(() => {
	getDatsActions().clear();
});

describe('setDats', () => {
	it('populates the map keyed by name', () => {
		getDatsActions().setDats([makeDat('npcs'), makeDat('obj')]);
		const map = getDats();
		expect(map.size).toBe(2);
		expect(map.has('npcs')).toBe(true);
		expect(map.has('obj')).toBe(true);
	});

	it('replaces previously loaded dats on a second call', () => {
		getDatsActions().setDats([makeDat('npcs')]);
		getDatsActions().setDats([makeDat('obj')]);
		const map = getDats();
		expect(map.size).toBe(1);
		expect(map.has('obj')).toBe(true);
		expect(map.has('npcs')).toBe(false);
	});
});

describe('upsertDats', () => {
	it('adds new dats without wiping existing ones', () => {
		getDatsActions().setDats([makeDat('npcs')]);
		getDatsActions().upsertDats([makeDat('obj')]);
		const map = getDats();
		expect(map.size).toBe(2);
		expect(map.has('npcs')).toBe(true);
		expect(map.has('obj')).toBe(true);
	});

	it('overwrites an entry for a name that already exists', () => {
		getDatsActions().setDats([makeDat('npcs', { numNpcs: 1 })]);
		getDatsActions().upsertDats([makeDat('npcs', { numNpcs: 99 })]);
		expect(getDats().get('npcs')).toEqual({ numNpcs: 99 });
	});

	it('is a no-op on an empty array', () => {
		getDatsActions().setDats([makeDat('npcs')]);
		getDatsActions().upsertDats([]);
		expect(getDats().size).toBe(1);
	});

	it('leaves unaffected entries intact when only a subset is upserted', () => {
		getDatsActions().setDats([
			makeDat('npcs', { numNpcs: 1 }),
			makeDat('obj', { numObjs: 2 }),
			makeDat('hechizos', { numeroHechizos: 3 }),
		]);
		getDatsActions().upsertDats([makeDat('npcs', { numNpcs: 99 })]);
		const map = getDats();
		expect(map.size).toBe(3);
		expect(map.get('obj')).toEqual({ numObjs: 2 });
		expect(map.get('hechizos')).toEqual({ numeroHechizos: 3 });
	});
});

describe('full upload flow', () => {
	it('re-uploading the same dats overwrites their content', () => {
		getDatsActions().setDats([]);
		getDatsActions().upsertDats([
			makeDat('npcs', { numNpcs: 1 }),
			makeDat('obj', { numObjs: 2 }),
		]);
		getDatsActions().upsertDats([
			makeDat('npcs', { numNpcs: 99 }),
			makeDat('obj', { numObjs: 99 }),
		]);
		const map = getDats();
		expect(map.size).toBe(2);
		expect(map.get('npcs')).toEqual({ numNpcs: 99 });
		expect(map.get('obj')).toEqual({ numObjs: 99 });
	});

	it('re-uploading a subset overwrites only those entries and leaves the rest intact', () => {
		getDatsActions().setDats([]);
		getDatsActions().upsertDats([
			makeDat('npcs', { numNpcs: 1 }),
			makeDat('obj', { numObjs: 2 }),
			makeDat('hechizos', { numeroHechizos: 3 }),
		]);
		getDatsActions().upsertDats([makeDat('npcs', { numNpcs: 99 })]);
		const map = getDats();
		expect(map.size).toBe(3);
		expect(map.get('npcs')).toEqual({ numNpcs: 99 });
		expect(map.get('obj')).toEqual({ numObjs: 2 });
		expect(map.get('hechizos')).toEqual({ numeroHechizos: 3 });
	});
});

describe('clear', () => {
	it('empties the map', () => {
		getDatsActions().setDats([makeDat('npcs'), makeDat('obj')]);
		getDatsActions().clear();
		const map = getDats();
		expect(map.size).toBe(0);
		expect(map.has('npcs')).toBe(false);
		expect(map.has('obj')).toBe(false);
	});
});
