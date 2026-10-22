/* FILE_TYPES is a constant, but we use `import type` because in this file it's only
   referenced as `typeof FILE_TYPES` to derive FileType, never as a value. `import type`
   is valid here since TypeScript erases type-only imports at compile time, avoiding
   a circular value dependency at runtime */
import type { FILE_TYPES } from './HomeUploaders';

export type FileType = (typeof FILE_TYPES)[number];

export type FileTypeSelectorProps = {
	selected: FileType;
	onSelect: (type: FileType) => void;
};
