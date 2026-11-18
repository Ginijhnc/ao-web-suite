import type { FileType } from '@Constants/database';
import { DAT_NAMES } from '@Constants/dats';
import { INDICES_NAMES } from '@Constants/indices';

export const RESOURCES_MESSAGES = {
	CLEAR_SUCCESS: (fileType: FileType) => {
		return `Todos los ${fileType.toLowerCase()} fueron eliminados correctamente.`;
	},
	CLEAR_CONFIRM: (fileType: FileType) => {
		return `Se eliminarán todos los ${fileType.toLowerCase()} cargados. Esta acción no se puede deshacer.`;
	},
	DEMO_UPLOAD_ERROR: 'Error al cargar los datos de demo.',
	DEMO_UPLOAD_CANCELLED:
		'Carga de demo interrumpida: es posible que no todos los archivos se hayan subido correctamente.',
} as const;

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
		return `No se reconocen los siguientes índices: ${list}. Se aceptan: ${Object.values(INDICES_NAMES).join(', ')}.`;
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
		return `No se reconocen los siguientes dats: ${list}. Se aceptan: ${Object.values(DAT_NAMES).join(', ')}.`;
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
	DUPLICATE_IDS: (fileName: string) => {
		return `"${fileName}" contiene IDs duplicados. Revisá los logs para más información.`;
	},
	DUPLICATE_FIELDS: (fileName: string) => {
		return `"${fileName}" contiene campos duplicados dentro de una misma entrada. Revisá los logs para más información.`;
	},
} as const;

export const LOGS_MESSAGES = {
	COPY_SUCCESS: 'Log copiado exitosamente.',
	COPY_ERROR: 'No se pudo copiar el log.',
	DELETE_CONFIRM: '¿Está seguro que quiere eliminar el log?',
	DELETE_SUCCESS: 'Log eliminado correctamente.',
	DELETE_NOT_FOUND:
		'No se encontró el log. Es posible que ya haya sido eliminado.',
	MENU_CHUNK_ERROR:
		'No se pudo cargar el menú. Intentá recargar la página.',
	DIALOG_CHUNK_ERROR:
		'No se pudo cargar el popup de detalle. Intentá recargar la página.',
} as const;
