import dateadorImg from '@Assets/images/pages/dateador.png';
import indexadorImg from '@Assets/images/pages/indexador.png';
import mapeadorImg from '@Assets/images/pages/mapeador.png';
import { ArrowForwardIcon } from '@Components/icons';
import { Text } from '@Components/shared/Text';
import { ROUTES } from '@Constants/routes';
import { useNavigate } from 'react-router';
import {
	arrowStyle,
	cardContentStyle,
	cardImageStyle,
	cardStyle,
	disabledCardStyle,
	overlayStyle,
	sectionStyle,
} from './ToolsNav.styles';
import type { Tool, ToolCardProps } from './ToolsNav.types';

const TOOLS: ReadonlyArray<Tool> = [
	{ title: 'Indexador', route: ROUTES.INDEXADOR, image: indexadorImg },
	{ title: 'Dateador', route: ROUTES.DATEADOR, image: dateadorImg },
	{ title: 'Mapeador', route: null, image: mapeadorImg },
];

const ToolCard = ({
	title,
	route,
	image,
}: ToolCardProps): React.ReactElement => {
	const navigate = useNavigate();
	const isPending = route === null;

	const handleClick = (): void => {
		/* onClick is already gated; this guard exists only to satisfy TypeScript. */
		if (route !== null) {
			void navigate(route);
		}
	};

	return (
		<article
			className={
				isPending ? `${cardStyle} ${disabledCardStyle}` : cardStyle
			}
			onClick={isPending ? undefined : handleClick}
		>
			<img src={image} alt={title} className={cardImageStyle} />
			<div className={overlayStyle} />
			<div className={cardContentStyle}>
				<Text renderAs="p" variant="label" size="lg">
					{title}
				</Text>
				<span className={arrowStyle}>
					<ArrowForwardIcon />
				</span>
			</div>
		</article>
	);
};

export const ToolsNav = (): React.ReactElement => {
	return (
		<div className={sectionStyle}>
			{TOOLS.map((tool) => {
				return (
					<ToolCard
						key={tool.title}
						title={tool.title}
						route={tool.route}
						image={tool.image}
					/>
				);
			})}
		</div>
	);
};
