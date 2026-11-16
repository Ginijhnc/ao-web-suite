import type { DatName } from '@Constants/dats';
import type { ParsedDat } from '@Helpers/dats';
import type { HechizosDat, NpcsDat, ObjDat } from '@Types/dats';
import { create } from 'zustand';

type DatData = ParsedDat['data'];

type DatsActions = {
	setDats: (dats: ReadonlyArray<ParsedDat>) => void;
	upsertDats: (dats: ReadonlyArray<ParsedDat>) => void;
	clear: () => void;
};

type DatsState = {
	// consumers read only; mutations go through actions
	dats: ReadonlyMap<DatName, DatData>;
	actions: DatsActions;
};

const DATS_INITIAL_STATE: Pick<DatsState, 'dats'> = {
	dats: new Map(),
};

const buildDatsMap = (
	source: ReadonlyMap<DatName, DatData>,
	incoming: ReadonlyArray<ParsedDat>,
): ReadonlyMap<DatName, DatData> => {
	const map = new Map(source);
	for (const dat of incoming) {
		map.set(dat.name, dat.data);
	}
	return map;
};

export const useDatsStore = create<DatsState>()((set, get) => {
	return {
		dats: DATS_INITIAL_STATE.dats,
		actions: {
			setDats: (dats) => {
				set({ dats: buildDatsMap(new Map(), dats) });
			},
			upsertDats: (dats) => {
				set({ dats: buildDatsMap(get().dats, dats) });
			},
			clear: () => {
				set({ dats: DATS_INITIAL_STATE.dats });
			},
		},
	};
});

export const useDats = () => {
	return useDatsStore((state) => {
		return state.dats;
	});
};

export const useDatsActions = () => {
	return useDatsStore((state) => {
		return state.actions;
	});
};

export const getDatsActions = () => {
	return useDatsStore.getState().actions;
};

/**
 * Overloaded hook signature that maps each DatName literal to its
 * concrete validated type, so call sites get full field types with
 * no cast.
 */
type UseDat = {
	(name: 'npcs'): NpcsDat | undefined;
	(name: 'obj'): ObjDat | undefined;
	(name: 'hechizos'): HechizosDat | undefined;
};

export const useDat = ((name: DatName) => {
	return useDatsStore((state) => {
		return state.dats.get(name);
	});
}) as UseDat;
