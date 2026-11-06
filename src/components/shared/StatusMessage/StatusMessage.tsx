import { Text } from '@Components/shared/Text';
import { containerStyle, iconStyle } from './StatusMessage.styles';
import type { StatusMessageProps } from './StatusMessage.types';

/**
 * Full-area state placeholder that replaces content inside a page
 * or section when there is nothing to display (empty, filtered-out,
 * error, etc.). It's not a toast or a snackbar. Instead, it occupies
 * layout space and stays visible while the condition holds.
 */
export const StatusMessage = ({
	icon,
	title,
	subtitle,
}: StatusMessageProps): React.ReactElement => {
	return (
		<div className={containerStyle}>
			<span className={iconStyle}>{icon}</span>
			<Text renderAs="p" variant="body" size="xl" weight="semiBold">
				{title}
			</Text>
			<Text renderAs="p" variant="label">
				{subtitle}
			</Text>
		</div>
	);
};
