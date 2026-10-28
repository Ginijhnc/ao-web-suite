import type { FileType } from '@Constants/database';

export const CLEAR_SUCCESS = (fileType: FileType) => {
	return `Todos los ${fileType.toLowerCase()} fueron eliminados correctamente.`;
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

export const DATS_MESSAGES = {
	UPLOAD_SUCCESS: 'Todos los dats fueron subidos correctamente.',
	UPLOAD_REPLACED: (names: string) => {
		return `Los dats ${names} fueron reemplazados correctamente.`;
	},
	UNKNOWN_DAT: (list: string) => {
		return `No se reconocen los siguientes dats: ${list}. Se aceptan: NPCs.dat, obj.dat, Hechizos.dat.`;
	},
	EMPTY_FILE: (fileName: string) => {
		return `El dat "${fileName}" está vacío. Se canceló la subida de la selección.`;
	},
	MISSING_HEADER: (fileName: string, header: string) => {
		return `"${fileName}" no contiene el header esperado [INIT] con ${header}=...`;
	},
	NO_ENTRIES: (fileName: string, sectionPrefix: string) => {
		return `"${fileName}" no contiene ninguna sección [${sectionPrefix}N] con datos.`;
	},
	SCHEMA_MISMATCH: (fileName: string) => {
		return `"${fileName}" no tiene la estructura esperada. Revisá los logs para más información.`;
	},
	INVALID_EXTENSION: (fileName: string) => {
		return `"${fileName}" no es un archivo .dat.`;
	},
} as const;
