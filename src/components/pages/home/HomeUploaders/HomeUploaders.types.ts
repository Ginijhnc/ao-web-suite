import type { FILE_TYPES } from '@Constants/database';
import type { ValueOf } from '@Types/utility-types';

export type FileType = ValueOf<typeof FILE_TYPES>;

export type FileTypeSelectorProps = {
	selected: FileType;
	onSelect: (type: FileType) => void;
};

export type UploaderActionsProps = {
	onUpload: () => void;
	onClear: () => void;
};
