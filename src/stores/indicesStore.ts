import type { IndiceName } from '@Constants/indices';
import type { ParsedIndice } from '@Helpers/indices';
import { create } from 'zustand';

type IndicesActions = {
	setIndices: (indices: ReadonlyArray<ParsedIndice>) => void;
	upsertIndices: (indices: ReadonlyArray<ParsedIndice>) => void;
	clear: () => void;
};

type IndicesState = {
	// consumers read only; mutations go through actions
	indices: ReadonlyMap<IndiceName, ParsedIndice>;
	actions: IndicesActions;
};

const INDICES_INITIAL_STATE: Pick<IndicesState, 'indices'> = {
	indices: new Map(),
};

export const useIndicesStore = create<IndicesState>()((set, get) => {
	return {
		indices: INDICES_INITIAL_STATE.indices,
		actions: {
			setIndices: (indices) => {
				const map = new Map<IndiceName, ParsedIndice>();
				for (const indice of indices) {
					map.set(indice.name, indice);
				}
				set({ indices: map });
			},
			upsertIndices: (indices) => {
				const map = new Map(get().indices);
				for (const indice of indices) {
					map.set(indice.name, indice);
				}
				set({ indices: map });
			},
			clear: () => {
				set({ indices: INDICES_INITIAL_STATE.indices });
			},
		},
	};
});

export const useIndices = () => {
	return useIndicesStore((state) => {
		return state.indices;
	});
};

export const useIndicesActions = () => {
	return useIndicesStore((state) => {
		return state.actions;
	});
};

export const getIndicesActions = () => {
	return useIndicesStore.getState().actions;
};

export const useIndice = (name: IndiceName): ParsedIndice | undefined => {
	return useIndicesStore((state) => {
		return state.indices.get(name);
	});
};
