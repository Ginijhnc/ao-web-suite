import type { DATS_ACCEPTED_EXTENSIONS } from '@Constants/dats';
import type { GRAPHICS_ACCEPTED_EXTENSIONS } from '@Constants/graphics';
import type { INDICES_ACCEPTED_EXTENSIONS } from '@Constants/indices';
import type { StoreName, ValidationFn } from '@Types/database';

export type AcceptedExtensions =
	| typeof GRAPHICS_ACCEPTED_EXTENSIONS
	| typeof INDICES_ACCEPTED_EXTENSIONS
	| typeof DATS_ACCEPTED_EXTENSIONS;

export type FileTypeConfig = {
	accept: AcceptedExtensions;
	store: StoreName;
	validate: ValidationFn;
	postProcess: (files: ReadonlyArray<File>) => void;
	onClear: () => void;
};
