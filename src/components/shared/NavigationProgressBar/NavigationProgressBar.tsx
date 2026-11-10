import { GENERAL_SELECTORS } from '@Constants/selectors';
import { useNavigationProgressBar } from '@Hooks/useNavigationProgressBar';
import { barStyle, trackStyle } from './NavigationProgressBar.styles';

export const NavigationProgressBar = (): React.ReactElement | null => {
	const bar = useNavigationProgressBar();

	if (!bar.visible) return null;

	return (
		<div
			className={trackStyle}
			data-testid={GENERAL_SELECTORS.NAVIGATION_PROGRESS_BAR}
		>
			<div
				className={barStyle}
				style={{ width: `${bar.width}%`, opacity: bar.opacity }}
			/>
		</div>
	);
};
