/* This app only targets Argentinian users, so locale and timezone are
hardcoded rather than derived from the viewer's machine. */
const TIME_ZONE = 'America/Argentina/Buenos_Aires';

/**
 * Formats an ISO timestamp as "dd/mm/yyyy hh:mm" in Argentina time,
 * regardless of the viewer's local timezone.
 */
export const formatDayMonthYearTime = (iso: string): string => {
	const date = new Date(iso);
	const datePart = date.toLocaleDateString('es-AR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		timeZone: TIME_ZONE,
	});
	const timePart = date.toLocaleTimeString('es-AR', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: TIME_ZONE,
	});
	return `${datePart} ${timePart}`;
};
