import type { FileType } from '@Constants/database';

export const GRAPHICS_MESSAGES = {
	CLEAR_SUCCESS: (fileType: FileType) => {
		return `Todos los ${fileType} fueron eliminados correctamente.`;
	},
	UPLOAD_SUCCESS: 'Todas las imágenes fueron subidas correctamente.',
	UPLOAD_REPLACED: (names: string) => {
		return `Las imágenes ${names} fueron reemplazadas correctamente.`;
	},
	CONFLICT_BATCH: (list: string) => {
		return `Se encontraron imágenes con el mismo nombre pero diferente formato en tu selección: ${list}.`;
	},
	CONFLICT_EXISTING: (list: string) => {
		return `Se encontraron imágenes con el mismo nombre pero diferente formato ya almacenadas: ${list}.`;
	},
	INVALID_EXTENSION: (fileName: string, accepted: string) => {
		return `"${fileName}" tiene una extensión no permitida. Extensiones aceptadas: ${accepted}.`;
	},
	INVALID_MAGIC_BYTES: (fileName: string) => {
		return `"${fileName}" no es una imagen válida. El contenido del archivo no coincide con su extensión.`;
	},
} as const;
