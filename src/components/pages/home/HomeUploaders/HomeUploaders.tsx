import { useState } from 'react';
import type { IconName } from '@Components/icons';
import { Button } from '@Components/shared/Button';
import { Chip } from '@Components/shared/Chip';
import { Text } from '@Components/shared/Text';
import {
	actionsRowStyle,
	chipsRowStyle,
	fileSelectorGroupStyle,
	uploadersContainerStyle,
} from './HomeUploaders.styles';
import {
	type FileType,
	type FileTypeSelectorProps,
} from './HomeUploaders.types';

export const FILE_TYPES = ['Gráficos', 'Índices', 'Dats'] as const;

const FILE_TYPE_ICONS: Record<FileType, IconName> = {
	Gráficos: 'ImageIcon',
	Índices: 'IndexingDataIcon',
	Dats: 'DatsIcon',
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
				{FILE_TYPES.map((type) => {
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

const UploaderActions = (): React.ReactElement => {
	return (
		<div className={actionsRowStyle}>
			<Button size="md" variant="primary" startIcon="UploadIcon">
				Subir
			</Button>
			<Button size="md" variant="secondary" startIcon="TrashIcon">
				Borrar
			</Button>
		</div>
	);
};

export const HomeUploaders = (): React.ReactElement => {
	const [selected, setSelected] = useState<FileType>(FILE_TYPES[0]);

	return (
		<section className={uploadersContainerStyle}>
			<FileTypeSelector selected={selected} onSelect={setSelected} />
			<UploaderActions />
		</section>
	);
};
