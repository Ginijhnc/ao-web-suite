import { useState } from 'react';
import type { IconName } from '@Components/icons';
import { Button } from '@Components/shared/Button';
import { Chip } from '@Components/shared/Chip';
import { Text } from '@Components/shared/Text';
import { FILE_TYPES } from '@Constants/database';
import type { FileType } from '@Constants/database';
import { DAT_NAMES, DATS_ACCEPTED_EXTENSIONS } from '@Constants/dats';
import {
	INDICES_ACCEPTED_EXTENSIONS,
	INDICES_NAMES,
} from '@Constants/indices';
import { ROUTES } from '@Constants/routes';
import { useFileUploader } from '@Hooks/useFileUploader';
import { useDats } from '@Stores/datsStore';
import { useGraphicsFiles } from '@Stores/graphicsStore';
import { useIndices } from '@Stores/indicesStore';
import { useNavigate } from 'react-router';
import UploaderStatusPanel from '../UploaderStatusPanel/UploaderStatusPanel';
import {
	actionsAndPanelGroupStyle,
	actionsRowStyle,
	chipsRowStyle,
	dashboardRowStyle,
	fileSelectorGroupStyle,
	uploadersContainerStyle,
	uploadersSectionStyle,
} from './HomeUploaders.styles';

import {
	type FileTypeSelectorProps,
	type UploaderActionsProps,
} from './HomeUploaders.types';

const FILE_TYPE_ICONS: Record<FileType, IconName> = {
	[FILE_TYPES.GRAPHICS]: 'ImageIcon',
	[FILE_TYPES.INDICES]: 'IndexingDataIcon',
	[FILE_TYPES.DATS]: 'DatsIcon',
};

const FileTypeSelector = ({
	selected,
	onSelect,
}: FileTypeSelectorProps): React.ReactElement => {
	return (
		<div className={fileSelectorGroupStyle}>
			<Text renderAs="p" variant="body">
				Seleccionar tipo de archivo
			</Text>
			<div className={chipsRowStyle}>
				{Object.values(FILE_TYPES).map((type) => {
					return (
						<Chip
							key={type}
							label={type}
							icon={FILE_TYPE_ICONS[type]}
							active={selected === type}
							onClick={() => {
								onSelect(type);
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};

const UploaderActions = ({
	onUpload,
	onClear,
	isClearDisabled,
}: UploaderActionsProps): React.ReactElement => {
	return (
		<div className={actionsRowStyle}>
			<Button
				size="md"
				variant="primary"
				startIcon="UploadIcon"
				onClick={onUpload}
			>
				Subir
			</Button>
			<Button
				size="md"
				variant="secondary"
				startIcon="TrashIcon"
				onClick={onClear}
				disabled={isClearDisabled}
			>
				Borrar
			</Button>
		</div>
	);
};

export const HomeUploaders = (): React.ReactElement => {
	const [selected, setSelected] = useState<FileType>(
		FILE_TYPES.GRAPHICS,
	);
	const { openFilePicker, clearFiles } = useFileUploader();
	const graphicsFiles = useGraphicsFiles();
	const dats = useDats();
	const indices = useIndices();
	const navigate = useNavigate();

	const EXPECTED_DATS_COUNT = Object.values(DAT_NAMES).length;
	const EXPECTED_INDICES_COUNT = Object.values(INDICES_NAMES).length;

	const storeSizes: Record<FileType, number> = {
		[FILE_TYPES.GRAPHICS]: graphicsFiles.length,
		[FILE_TYPES.DATS]: dats.size,
		[FILE_TYPES.INDICES]: indices.size,
	};
	const isClearDisabled = storeSizes[selected] === 0;
	const isDashboardEnabled =
		graphicsFiles.length > 0 &&
		dats.size === EXPECTED_DATS_COUNT &&
		indices.size === EXPECTED_INDICES_COUNT;

	const uploadedDats = new Set(dats.keys());
	const uploadedIndices = new Set(indices.keys());

	const getStatusPanel = (): React.ReactElement => {
		if (selected === FILE_TYPES.DATS) {
			return (
				<UploaderStatusPanel
					variant="checklist"
					allFiles={Object.values(DAT_NAMES)}
					uploadedFiles={uploadedDats}
					extension={DATS_ACCEPTED_EXTENSIONS}
				/>
			);
		}

		if (selected === FILE_TYPES.INDICES) {
			return (
				<UploaderStatusPanel
					variant="checklist"
					allFiles={Object.values(INDICES_NAMES)}
					uploadedFiles={uploadedIndices}
					extension={INDICES_ACCEPTED_EXTENSIONS}
				/>
			);
		}

		return (
			<UploaderStatusPanel
				variant="graphics"
				count={graphicsFiles.length}
			/>
		);
	};

	const handleUpload = (): void => {
		openFilePicker(selected);
	};

	const handleClear = (): void => {
		void clearFiles(selected);
	};

	return (
		<section className={uploadersSectionStyle}>
			<div className={uploadersContainerStyle}>
				<FileTypeSelector
					selected={selected}
					onSelect={setSelected}
				/>
				<div className={actionsAndPanelGroupStyle}>
					<UploaderActions
						onUpload={handleUpload}
						onClear={handleClear}
						isClearDisabled={isClearDisabled}
					/>
					{getStatusPanel()}
				</div>
			</div>
			<div className={dashboardRowStyle}>
				<Button
					variant="primary"
					size="md"
					endIcon="ArrowForwardIcon"
					disabled={!isDashboardEnabled}
					onClick={() => {
						void navigate(ROUTES.OVERVIEW);
					}}
				>
					Siguiente
				</Button>
			</div>
		</section>
	);
};
