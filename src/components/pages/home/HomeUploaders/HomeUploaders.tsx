import { useState } from 'react';
import type { IconName } from '@Components/icons';
import { Button } from '@Components/shared/Button';
import { Chip } from '@Components/shared/Chip';
import { Text } from '@Components/shared/Text';
import { FILE_TYPES } from '@Constants/database';
import type { FileType } from '@Constants/database';
import { HOME_SELECTORS } from '@Constants/selectors';
import { useFileUploader } from '@Hooks/useFileUploader';
import {
	actionsRowStyle,
	chipsRowStyle,
	fileSelectorGroupStyle,
	uploadersContainerStyle,
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
}: UploaderActionsProps): React.ReactElement => {
	return (
		<div className={actionsRowStyle}>
			<Button
				size="md"
				variant="primary"
				startIcon="UploadIcon"
				onClick={onUpload}
				data-testid={HOME_SELECTORS.UPLOAD_BUTTON}
			>
				Subir
			</Button>
			<Button
				size="md"
				variant="secondary"
				startIcon="TrashIcon"
				onClick={onClear}
				data-testid={HOME_SELECTORS.CLEAR_BUTTON}
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

	const handleUpload = (): void => {
		openFilePicker(selected);
	};

	const handleClear = (): void => {
		void clearFiles(selected);
	};

	return (
		<section className={uploadersContainerStyle}>
			<FileTypeSelector selected={selected} onSelect={setSelected} />
			<UploaderActions
				onUpload={handleUpload}
				onClear={handleClear}
			/>
		</section>
	);
};
