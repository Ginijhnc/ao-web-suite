import type { FileType } from '@Constants/database';

export const CLEAR_SUCCESS = (fileType: FileType) => {
	return `Todos los ${fileType} fueron eliminados correctamente.`;
};

export const GRAPHICS_MESSAGES = {
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

export const INDICES_MESSAGES = {
	UPLOAD_SUCCESS: 'Todos los índices fueron subidos correctamente.',
	UPLOAD_REPLACED: (names: string) => {
		return `Los índices ${names} fueron reemplazados correctamente.`;
	},
	UNKNOWN_INDICE: (list: string) => {
		return `No se reconocen los siguientes índices: ${list}. Se aceptan: armas, cabezas, cascos, cuerpos, escudos, fxs, graficos.`;
	},
	EMPTY_FILE: (fileName: string) => {
		return `El índice "${fileName}" está vacío. Se canceló la subida de la selección.`;
	},
	INVALID_JSON: (fileName: string) => {
		return `"${fileName}" no es un JSON válido. Revisá los logs para más información.`;
	},
	SCHEMA_MISMATCH: (fileName: string) => {
		return `"${fileName}" no tiene la estructura esperada. Revisá los logs para más información.`;
	},
	INVALID_EXTENSION: (fileName: string) => {
		return `"${fileName}" no es un archivo .json.`;
	},
} as const;
