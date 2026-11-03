import { describe, expect, it } from 'vitest';
import { formatDayMonthYearTime } from './date';

describe('formatDayMonthYearTime', () => {
	it('formats a real log entry timestamp in Argentina time', () => {
		expect(formatDayMonthYearTime('2026-06-04T00:40:06.627Z')).toBe(
			'03/06/2026 21:40',
		);
	});

	it('pads single-digit day, month, hour, and minute', () => {
		expect(formatDayMonthYearTime('2026-01-01T04:05:00.000Z')).toBe(
			'01/01/2026 01:05',
		);
	});
});
