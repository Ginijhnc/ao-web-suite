import type { DATS_ACCEPTED_EXTENSIONS } from '@Constants/dats';
import type { GRAPHICS_ACCEPTED_EXTENSIONS } from '@Constants/graphics';
import type { INDICES_ACCEPTED_EXTENSIONS } from '@Constants/indices';
import type { ParsedIndice } from '@Helpers/indices';
import type {
	NamedRecord,
	StoreName,
	ValidationFn,
} from '@Types/database';

export type AcceptedExtensions =
	| typeof GRAPHICS_ACCEPTED_EXTENSIONS
	| typeof INDICES_ACCEPTED_EXTENSIONS
	| typeof DATS_ACCEPTED_EXTENSIONS;

/**
 * Per-file-type configuration consumed by useFileUploader. Each file
 * type (graphics, indices, dats) registers one of these to plug into
 * the shared upload pipeline.
 */
export type FileTypeConfig = {
	/** Comma-separated list passed to the input accept attribute. */
	accept: AcceptedExtensions;
	/** IDB store the validated files are written to. */
	store: StoreName;
	/**
	 * Async validator. Receives the picked files; returns
	 * `valid: true` or a user-facing message.
	 */
	validate: ValidationFn;
	/**
	 * Hook that runs after a successful persist. Used by graphics to
	 * push metadata into Zustand; indices and dats leave it empty.
	 */
	postProcess: (files: ReadonlyArray<File>) => void;
	/**
	 * Hook that runs after the user clicks "Borrar". Used to reset
	 * any in-memory store mirrored from this file type.
	 */
	onClear: () => void;
	/**
	 * Toast strings shown after a successful upload. Error messages are
	 * not configured here because validation errors come directly from
	 * the validator via ValidationResult.message, and storage errors
	 * are a generic IDB failure with no per-file-type distinction.
	 */
	successMessages: {
		/** Shown when no existing record was overwritten. */
		uploadSuccess: string;
		/**
		 * Shown when at least one record was overwritten; receives
		 * a formatted name list.
		 */
		uploadReplaced: (names: string) => string;
	};
	/**
	 * Optional synchronous transform that converts already-validated
	 * parsed data into IDB records. When provided it is called instead
	 * of the default raw-ArrayBuffer path (graphics). Indices supply
	 * this to store parsed entries rather than re-reading the file.
	 */
	buildRecordsFromValidation?: (
		parsedIndices: ReadonlyArray<ParsedIndice>,
	) => ReadonlyArray<NamedRecord>;
};
