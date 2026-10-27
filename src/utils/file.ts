import { FILE_LIST_TRUNCATE_AT } from '@Constants/database';

/**
 * Joins up to `truncateAt` names with ", " and appends a "y N más"
 * suffix for the overflow. Used by validators and the upload hook to
 * produce user-facing file lists without overwhelming the toast.
 */
export const truncateNameList = (
	names: ReadonlyArray<string>,
	truncateAt: number = FILE_LIST_TRUNCATE_AT,
): string => {
	const listed = names.slice(0, truncateAt).join(', ');
	const overflow =
		names.length > truncateAt
			? ` y ${names.length - truncateAt} más`
			: '';
	return `${listed}${overflow}`;
};

/**
 * Reads a File as UTF-8 text. Used for any text-based upload (índices
 * JSON, .dat INI-style files); graphics use ArrayBuffer for binary
 * handling instead.
 */
export const readFileAsText = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const data = reader.result;
			if (typeof data !== 'string') {
				reject(new Error(`Error al leer ${file.name}`));
				return;
			}
			resolve(data);
		};
		reader.onerror = () => {
			reject(new Error(`Error al leer ${file.name}`));
		};
		reader.readAsText(file);
	});
};

/**
 * Guards against the browser's accept attribute being bypassed by
 * typing a path manually or drag-dropping unsupported files. Used by
 * every file-type validator (graphics, indices, dats).
 */
export const hasValidExtension = (
	fileName: string,
	acceptedExtensions: string,
): boolean => {
	const extensions = acceptedExtensions.split(',').map((ext) => {
		return ext.trim().toLowerCase();
	});
	const fileLower = fileName.toLowerCase();
	return extensions.some((ext) => {
		return fileLower.endsWith(ext);
	});
};
