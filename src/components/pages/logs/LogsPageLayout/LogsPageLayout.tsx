import { useMountEffect } from '@Hooks/useMountEffect';
import { useLogEntries } from '@Stores/logStore';
import { prefetchLogRowMenu } from '@Utils/prefetcher';
import { LogsTable } from '../LogsTable';
import { layoutStyle } from './LogsPageLayout.styles';

export const LogsPageLayout = (): React.ReactElement => {
	const entries = useLogEntries();

	useMountEffect(() => {
		if ('requestIdleCallback' in window) {
			requestIdleCallback(() => {
				setTimeout(prefetchLogRowMenu, 2000);
			});
		} else {
			setTimeout(prefetchLogRowMenu, 2000);
		}
	});

	return (
		<div className={layoutStyle}>
			<LogsTable entries={entries} />
		</div>
	);
};
