export const isFirefox = (): boolean => {
	return (
		'netscape' in window &&
		navigator.userAgent.indexOf('rv:') > 1 &&
		navigator.userAgent.indexOf('Gecko') > 1
	);
};
