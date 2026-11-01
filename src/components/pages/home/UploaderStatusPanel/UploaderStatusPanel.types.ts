import type { DatName } from '@Constants/dats';
import type { DATS_ACCEPTED_EXTENSIONS } from '@Constants/dats';
import type { IndiceName } from '@Constants/indices';
import type { INDICES_ACCEPTED_EXTENSIONS } from '@Constants/indices';

type ChecklistVariant = {
	variant: 'checklist';
	allFiles: ReadonlyArray<DatName | IndiceName>;
	uploadedFiles: ReadonlySet<DatName | IndiceName>;
	extension:
		| typeof DATS_ACCEPTED_EXTENSIONS
		| typeof INDICES_ACCEPTED_EXTENSIONS;
};

type GraphicsVariant = {
	variant: 'graphics';
	count: number;
};

export type ChecklistProps = Omit<ChecklistVariant, 'variant'>;

export type UploaderStatusPanelProps = ChecklistVariant | GraphicsVariant;
