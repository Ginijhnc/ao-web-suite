import { renderHook, act } from '@testing-library/react';
import type { FileMeta } from '@Types/database';
import { beforeEach, describe, expect, it } from 'vitest';
import { getGraphicsActions, useGraphicsFiles } from './graphicsStore';

const makeGraphic = (name: string, size: number = 1): FileMeta => {
	return { name, size, type: 'image/png' };
};

beforeEach(() => {
	act(() => {
		getGraphicsActions().clear();
	});
});

describe('setFiles', () => {
	it('populates the list with graphics metadata', () => {
		const { result } = renderHook(() => {
			return useGraphicsFiles();
		});

		act(() => {
			getGraphicsActions().setFiles([
				makeGraphic('3082.png'),
				makeGraphic('4006.png'),
			]);
		});

		expect(result.current).toEqual([
			makeGraphic('3082.png'),
			makeGraphic('4006.png'),
		]);
	});

	it('replaces previously loaded graphics on a second call', () => {
		const { result } = renderHook(() => {
			return useGraphicsFiles();
		});

		act(() => {
			getGraphicsActions().setFiles([makeGraphic('3082.png')]);
		});
		act(() => {
			getGraphicsActions().setFiles([makeGraphic('4006.png')]);
		});

		expect(result.current).toEqual([makeGraphic('4006.png')]);
	});
});

describe('addFiles', () => {
	it('adds new graphics without wiping existing metadata', () => {
		const { result } = renderHook(() => {
			return useGraphicsFiles();
		});

		act(() => {
			getGraphicsActions().setFiles([makeGraphic('3082.png')]);
		});
		act(() => {
			getGraphicsActions().addFiles([makeGraphic('4006.png')]);
		});

		expect(result.current).toEqual([
			makeGraphic('3082.png'),
			makeGraphic('4006.png'),
		]);
	});

	it('replaces metadata for an existing filename without duplicating it', () => {
		const { result } = renderHook(() => {
			return useGraphicsFiles();
		});

		act(() => {
			getGraphicsActions().setFiles([makeGraphic('3082.png', 100)]);
		});
		act(() => {
			getGraphicsActions().addFiles([makeGraphic('3082.png', 200)]);
		});

		expect(result.current).toEqual([makeGraphic('3082.png', 200)]);
		expect(result.current).toHaveLength(1);
	});
});

describe('clear', () => {
	it('empties the graphics list', () => {
		const { result } = renderHook(() => {
			return useGraphicsFiles();
		});

		act(() => {
			getGraphicsActions().setFiles([makeGraphic('3082.png')]);
		});
		act(() => {
			getGraphicsActions().clear();
		});

		expect(result.current).toEqual([]);
	});
});
