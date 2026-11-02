import { Text } from '@Components/shared/Text';
import { useDat } from '@Stores/datsStore';
import { useGraphicsFiles } from '@Stores/graphicsStore';
import { useIndice } from '@Stores/indicesStore';
import {
	cardStyle,
	gridStyle,
	statRowStyle,
	titleStyle,
} from './AssetsSummary.styles';
import type { AssetStat } from './AssetsSummary.types';

/**
 * Returns the entry count for a store slice. Returns 0 when the slice
 * is undefined. This is safe because the route guard in OverviewPage
 * guarantees all stores are loaded before this component renders.
 */
const entryCount = (
	store: { entries: ReadonlyArray<unknown> } | undefined,
): number => {
	return store?.entries.length ?? 0;
};

const StatRow = ({ label, count }: AssetStat): React.ReactElement => {
	return (
		<div className={statRowStyle}>
			<Text renderAs="span" variant="body">
				{label}
			</Text>
			<Text renderAs="span" variant="body" weight="bold">
				{count.toLocaleString('es-AR')}
			</Text>
		</div>
	);
};

export const AssetsSummary = (): React.ReactElement => {
	const graphics = useGraphicsFiles();
	const npcs = useDat('npcs');
	const obj = useDat('obj');
	const hechizos = useDat('hechizos');
	const armas = useIndice('armas');
	const cabezas = useIndice('cabezas');
	const cascos = useIndice('cascos');
	const cuerpos = useIndice('cuerpos');
	const escudos = useIndice('escudos');
	const fxs = useIndice('fxs');
	const graficosIndice = useIndice('graficos');

	const stats: ReadonlyArray<AssetStat> = [
		{ label: 'Gráficos', count: graphics.length },
		{ label: 'NPCs', count: entryCount(npcs) },
		{ label: 'Objetos', count: entryCount(obj) },
		{ label: 'Hechizos', count: entryCount(hechizos) },
		{ label: 'Armas', count: entryCount(armas) },
		{ label: 'Cabezas', count: entryCount(cabezas) },
		{ label: 'Cascos', count: entryCount(cascos) },
		{ label: 'Cuerpos', count: entryCount(cuerpos) },
		{ label: 'Escudos', count: entryCount(escudos) },
		{ label: 'FXs', count: entryCount(fxs) },
		{ label: 'GRHs', count: entryCount(graficosIndice) },
		{ label: 'Mapas', count: 0 },
	];

	return (
		<div className={cardStyle}>
			<Text
				renderAs="p"
				variant="label"
				weight="semiBold"
				size="lg"
				className={titleStyle}
			>
				Assets
			</Text>
			<div className={gridStyle}>
				{stats.map((stat) => {
					return (
						<StatRow
							key={stat.label}
							label={stat.label}
							count={stat.count}
						/>
					);
				})}
			</div>
		</div>
	);
};
