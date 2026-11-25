import type { FileMeta } from '@Types/database';
import { create } from 'zustand';

type GraphicsActions = {
	setFiles: (files: ReadonlyArray<FileMeta>) => void;
	addFiles: (files: ReadonlyArray<FileMeta>) => void;
	clear: () => void;
};

type GraphicsState = {
	files: ReadonlyArray<FileMeta>;
	actions: GraphicsActions;
};

const GRAPHICS_INITIAL_STATE: Pick<GraphicsState, 'files'> = {
	files: [],
};

const useGraphicsStore = create<GraphicsState>()((set, get) => {
	return {
		files: GRAPHICS_INITIAL_STATE.files,
		actions: {
			setFiles: (files) => {
				set({ files });
			},
			addFiles: (files) => {
				const filesByName = new Map(
					get().files.map((file) => {
						return [file.name, file];
					}),
				);

				for (const file of files) {
					filesByName.set(file.name, file);
				}

				set({ files: Array.from(filesByName.values()) });
			},
			clear: () => {
				set({ files: GRAPHICS_INITIAL_STATE.files });
			},
		},
	};
});

export const useGraphicsFiles = () => {
	return useGraphicsStore((state) => {
		return state.files;
	});
};

export const useGraphicsActions = () => {
	return useGraphicsStore((state) => {
		return state.actions;
	});
};

export const getGraphicsActions = () => {
	return useGraphicsStore.getState().actions;
};
