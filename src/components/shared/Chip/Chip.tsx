import { icons } from '@Components/icons';
import { chipStyle } from './Chip.styles';
import type { ChipProps } from './Chip.types';

export const Chip = ({
	label,
	icon,
	active,
	onClick,
}: ChipProps): React.ReactElement => {
	const Icon = icon ? icons[icon] : null;

	return (
		<button
			type="button"
			className={chipStyle}
			aria-pressed={active}
			onClick={onClick}
		>
			{Icon && <Icon />}
			{label}
		</button>
	);
};
