import type { FileType } from '@Constants/database';

export type FileTypeSelectorProps = {
	selected: FileType;
	onSelect: (type: FileType) => void;
};

export type UploaderActionsProps = {
	onUpload: () => void;
	onClear: () => void;
};
