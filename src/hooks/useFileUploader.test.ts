import { FILE_TYPES } from '@Constants/database';
import type { FileType } from '@Constants/database';
import type { ParsedDat } from '@Helpers/dats';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ValidationResult } from '@Types/database';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getReplacedNames, useFileUploader } from './useFileUploader';

const {
	putFilesMock,
	clearStoreMock,
	upsertDatsMock,
	clearDatsMock,
	validateDatsFilesMock,
} = vi.hoisted(() => {
	return {
		putFilesMock: vi.fn(),
		clearStoreMock: vi.fn(),
		upsertDatsMock: vi.fn(),
		clearDatsMock: vi.fn(),
		validateDatsFilesMock: vi.fn(),
	};
});

vi.mock('@Utils/database', () => {
	return {
		putFiles: putFilesMock,
		clearStore: clearStoreMock,
	};
});

vi.mock('@Stores/datsStore', () => {
	return {
		getDatsActions: () => {
			return { upsertDats: upsertDatsMock, clear: clearDatsMock };
		},
	};
});

vi.mock('@Validators/dats', () => {
	return {
		validateDatsFiles: validateDatsFilesMock,
	};
});

const VALID_DAT_RESULT: ValidationResult = {
	valid: true,
	existingKeys: [],
	parsedDats: [{ name: 'npcs', data: {} } as ParsedDat],
};

const selectFiles = (
	input: HTMLInputElement,
	files: ReadonlyArray<File>,
): void => {
	Object.defineProperty(input, 'files', {
		value: files,
		configurable: true,
	});
	input.dispatchEvent(new Event('change'));
};

describe('useFileUploader', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		document.body.innerHTML = '';
		validateDatsFilesMock.mockResolvedValue(VALID_DAT_RESULT);
		clearStoreMock.mockResolvedValue({ success: true });
	});

	const openAndSelect = (
		result: {
			current: ReturnType<typeof useFileUploader>;
		},
		fileType: FileType,
		files: ReadonlyArray<File>,
	): HTMLInputElement => {
		act(() => {
			result.current.openFilePicker(fileType);
		});
		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		act(() => {
			selectFiles(input, files);
		});
		return input;
	};

	it('does not update the dats store when the persist write fails', async () => {
		putFilesMock.mockRejectedValueOnce(new Error('quota exceeded'));
		const onError = vi.fn();
		const { result } = renderHook(() => {
			return useFileUploader({ onError });
		});

		openAndSelect(result, FILE_TYPES.DATS, [
			{ name: 'npcs.dat' } as File,
		]);

		await waitFor(() => {
			expect(onError).toHaveBeenCalled();
		});
		expect(upsertDatsMock).not.toHaveBeenCalled();
	});

	it('resets the file input after a rejected upload, so reselecting the same file fires change again', async () => {
		validateDatsFilesMock.mockResolvedValueOnce({
			valid: false,
			message: 'Estructura invalida',
		});
		const onError = vi.fn();
		const { result } = renderHook(() => {
			return useFileUploader({ onError });
		});

		const input = openAndSelect(result, FILE_TYPES.DATS, [
			{ name: 'npcs.dat' } as File,
		]);

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith('Estructura invalida');
		});
		expect(input.value).toBe('');
	});

	it('does not clear the in-memory store when the IDB clear fails', async () => {
		clearStoreMock.mockResolvedValueOnce({
			success: false,
			error: new Error('transaction aborted'),
		});
		const onError = vi.fn();
		const { result } = renderHook(() => {
			return useFileUploader({ onError });
		});

		await act(async () => {
			await result.current.clearFiles(FILE_TYPES.DATS);
		});

		expect(onError).toHaveBeenCalled();
		expect(clearDatsMock).not.toHaveBeenCalled();
	});

	it('does not reopen the file picker on a second click while a persist is in flight', async () => {
		let resolvePersist!: () => void;
		putFilesMock.mockReturnValueOnce(
			new Promise<void>((resolve) => {
				resolvePersist = resolve;
			}),
		);
		const onError = vi.fn();
		const { result } = renderHook(() => {
			return useFileUploader({ onError });
		});

		const input = openAndSelect(result, FILE_TYPES.DATS, [
			{ name: 'npcs.dat' } as File,
		]);
		const clickSpy = vi.spyOn(input, 'click');

		await waitFor(() => {
			expect(putFilesMock).toHaveBeenCalledTimes(1);
		});

		act(() => {
			result.current.openFilePicker(FILE_TYPES.DATS);
		});
		expect(clickSpy).not.toHaveBeenCalled();

		resolvePersist();
		await waitFor(() => {
			expect(upsertDatsMock).toHaveBeenCalledTimes(1);
		});
		expect(putFilesMock).toHaveBeenCalledTimes(1);
	});
});

describe('getReplacedNames', () => {
	it('matches the new upload against the stored key case-insensitively', () => {
		const files = [
			{ name: 'Cabezas.json' } as File,
			{ name: 'armas.json' } as File,
		];
		// 'cabezas.json' is the original, already-stored key.
		// 'Cabezas.json' is the new upload being validated.
		expect(getReplacedNames(files, ['cabezas.json'])).toEqual([
			'cabezas.json',
		]);
	});

	it('returns an empty array when nothing collides', () => {
		const files = [{ name: 'armas.json' } as File];
		expect(getReplacedNames(files, ['cabezas.json'])).toEqual([]);
	});

	it('preserves the casing of the stored key, not the new upload', () => {
		const files = [{ name: 'HECHIZOS.DAT' } as File];
		expect(getReplacedNames(files, ['hechizos.dat'])).toEqual([
			'hechizos.dat',
		]);
	});

	it('deduplicates when multiple selected files collide with the same stored key', () => {
		const files = [
			{ name: 'Cabezas.json' } as File,
			{ name: 'CABEZAS.JSON' } as File,
		];
		expect(getReplacedNames(files, ['cabezas.json'])).toEqual([
			'cabezas.json',
		]);
	});

	it('returns an empty array on a first-ever upload, when nothing is stored yet', () => {
		const files = [{ name: 'cabezas.json' } as File];
		expect(getReplacedNames(files, [])).toEqual([]);
	});

	it('returns an empty array when no files were selected', () => {
		expect(getReplacedNames([], ['cabezas.json'])).toEqual([]);
	});

	it('reports every distinct stored key that the selected files collide with', () => {
		const files = [
			{ name: 'cabezas.json' } as File,
			{ name: 'cascos.json' } as File,
			{ name: 'armas.json' } as File,
		];
		expect(
			getReplacedNames(files, ['cabezas.json', 'cascos.json']),
		).toEqual(['cabezas.json', 'cascos.json']);
	});
});
