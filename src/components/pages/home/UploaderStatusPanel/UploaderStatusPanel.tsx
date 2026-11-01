import { CheckIcon, WarningIcon } from '@Components/icons';
import { Text } from '@Components/shared/Text';
import {
	fileListStyle,
	fileRowStyle,
	infoPanelStyle,
} from './UploaderStatusPanel.styles';
import type {
	ChecklistProps,
	UploaderStatusPanelProps,
} from './UploaderStatusPanel.types';

const ChecklistPanel = ({
	allFiles,
	uploadedFiles,
	extension,
}: ChecklistProps): React.ReactElement => {
	return (
		<aside className={infoPanelStyle}>
			<ul className={fileListStyle}>
				{allFiles.map((name) => {
					const uploaded = uploadedFiles.has(name);
					const Icon = uploaded ? CheckIcon : WarningIcon;
					const ariaLabel = uploaded ? 'subido' : 'faltante';
					return (
						<li key={name} className={fileRowStyle}>
							<Icon aria-label={ariaLabel} />
							<Text renderAs="span" variant="label">
								{name}
								{extension}
							</Text>
						</li>
					);
				})}
			</ul>
		</aside>
	);
};

const getGraphicsLabel = (count: number): string => {
	if (count === 0) return 'Falta subir los gráficos.';
	if (count === 1) return '1 imagen subida.';
	return `${count} imágenes subidas.`;
};

const UploaderStatusPanel = (
	props: UploaderStatusPanelProps,
): React.ReactElement => {
	if (props.variant === 'checklist') {
		return <ChecklistPanel {...props} />;
	}

	const { count } = props;
	const Icon = count > 0 ? CheckIcon : WarningIcon;
	const ariaLabel = count > 0 ? 'subido' : 'faltante';

	return (
		<aside className={infoPanelStyle}>
			<span className={fileRowStyle}>
				<Icon aria-label={ariaLabel} />
				<Text renderAs="span" variant="label">
					{getGraphicsLabel(count)}
				</Text>
			</span>
		</aside>
	);
};

export default UploaderStatusPanel;
