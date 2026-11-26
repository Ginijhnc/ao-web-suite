import { HourglassIcon } from '@Components/icons';
import { StatusMessage } from '@Components/shared/StatusMessage';
import { layoutStyle } from './DateadorLayout.styles';

export const DateadorLayout = (): React.ReactElement => {
	return (
		<div className={layoutStyle}>
			<StatusMessage
				icon={<HourglassIcon />}
				title="Próximamente"
				subtitle="Esta sección aún no está disponible."
			/>
		</div>
	);
};
