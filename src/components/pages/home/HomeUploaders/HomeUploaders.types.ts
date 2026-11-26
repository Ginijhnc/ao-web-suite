import type { FileType } from '@Constants/database';
import type { PendingUpload } from '@Hooks/useFileUploader';

export type FileTypeSelectorProps = {
	selected: FileType;
	onSelect: (type: FileType) => void;
};

export type UploaderActionsProps = {
	onUpload: () => void;
	onClear: () => void;
	isClearDisabled: boolean;
	isUploading: boolean;
};

export type UploadReplaceDialogProps = {
	pendingUpload: PendingUpload | null;
	onConfirm: () => void;
	onCancel: () => void;
};
