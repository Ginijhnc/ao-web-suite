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
 * Reads a File as an ArrayBuffer and decodes it as text. Tries UTF-8
 * first (fatal mode rejects invalid byte sequences); if that fails,
 * falls back to Windows-1252, which is what the legacy VB6 tooling
 * used for accented characters. This handles both modern UTF-8 .dat
 * files and original game client files transparently.
 */
export const readFileAsText = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const buffer = reader.result;
			if (!(buffer instanceof ArrayBuffer)) {
				reject(new Error(`Error al leer ${file.name}`));
				return;
			}
			try {
				resolve(
					new TextDecoder('utf-8', { fatal: true }).decode(
						buffer,
					),
				);
			} catch {
				resolve(new TextDecoder('windows-1252').decode(buffer));
			}
		};
		reader.onerror = () => {
			reject(new Error(`Error al leer ${file.name}`));
		};
		reader.readAsArrayBuffer(file);
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
