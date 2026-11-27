import { useEffect } from 'react';
import { UploadIcon } from '@Components/icons/UploadIcon';
import { Spinner } from '@Components/shared/Spinner';
import { Tooltip } from '@Components/shared/Tooltip';
import { useDemoUpload } from '@Hooks/useDemoUpload';
import { useHydrated } from '@Hooks/useHydrateStores';
import { useDats } from '@Stores/datsStore';
import { useGraphicsFiles } from '@Stores/graphicsStore';
import { useIndices } from '@Stores/indicesStore';
import theme from '@Theme/theme';
import { fabStyle } from './DemoUploadFab.styles';

const DemoUploadFab = (): React.ReactElement | null => {
	const isHydrated = useHydrated();
	const graphicsFiles = useGraphicsFiles();
	const dats = useDats();
	const indices = useIndices();
	const { isLoading, start } = useDemoUpload();

	const hasData =
		graphicsFiles.length > 0 || dats.size > 0 || indices.size > 0;
	const isFabVisible = isHydrated && !hasData;

	useEffect(() => {
		document.body.dataset['fabVisible'] = String(isFabVisible);
		return () => {
			delete document.body.dataset['fabVisible'];
		};
	}, [isFabVisible]);

	if (!isHydrated || hasData) return null;

	const handleClick = (): void => {
		void start();
	};

	return (
		<Tooltip title="Cargar datos de demo" placement="left">
			<button
				className={fabStyle}
				onClick={handleClick}
				disabled={isLoading}
				aria-label="Cargar datos de demo"
				type="button"
			>
				{isLoading ? (
					<Spinner
						size={1.4}
						color={theme.palette.text.secondary}
					/>
				) : (
					<UploadIcon />
				)}
			</button>
		</Tooltip>
	);
};

export default DemoUploadFab;
