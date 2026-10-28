import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { makeUnknownKeyRefinement } from './common';
import type { NpcEntry } from './npcs';
import { npcEntrySchema } from './npcs';
import type { ObjEntry } from './obj';
import { objEntrySchema } from './obj';

const runRefinement = (
	data: Record<string, unknown>,
	knownKeys: ReadonlySet<string>,
	reservedKeys: ReadonlySet<string>,
	indexedPrefixes: ReadonlyArray<string>,
) => {
	const refinement = makeUnknownKeyRefinement(
		knownKeys,
		reservedKeys,
		indexedPrefixes,
	);
	const schema = z
		.custom<Record<string, unknown>>()
		.superRefine(refinement);
	return schema.safeParse(data);
};

describe('makeUnknownKeyRefinement', () => {
	it('accepts a key that is in knownKeys', () => {
		const result = runRefinement(
			{ Name: 'Espada' },
			new Set(['Name']),
			new Set(),
			[],
		);
		expect(result.success).toBe(true);
	});

	it('accepts a key that is in reservedKeys', () => {
		const result = runRefinement(
			{ objNumber: 1 },
			new Set(),
			new Set(['objNumber']),
			[],
		);
		expect(result.success).toBe(true);
	});

	it('accepts an indexed-family key whose base name matches a prefix', () => {
		const result = runRefinement(
			{ CP1: 'MAGO' },
			new Set(),
			new Set(),
			['CP'],
		);
		expect(result.success).toBe(true);
	});

	it('matches indexed prefixes case-insensitively', () => {
		const result = runRefinement(
			{ cp1: 'MAGO' },
			new Set(),
			new Set(),
			['CP'],
		);
		expect(result.success).toBe(true);
	});

	it('rejects a key not in knownKeys/reservedKeys and not an indexed family', () => {
		const result = runRefinement({ Wololo: 0 }, new Set(), new Set(), [
			'CP',
		]);
		expect(result.success).toBe(false);
	});

	it('rejects an indexed-looking key whose prefix is not in indexedPrefixes', () => {
		const result = runRefinement({ XY1: 5 }, new Set(), new Set(), [
			'CP',
		]);
		expect(result.success).toBe(false);
	});

	it('reports the offending key and configured prefixes in the issue message', () => {
		const result = runRefinement({ Wololo: 0 }, new Set(), new Set(), [
			'CP',
		]);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe(
				'Clave no reconocida: "Wololo". Solo se permiten campos definidos en el esquema o familias indexadas como CP.',
			);
		}
	});
});

describe('objEntrySchema - unknown key rejection (makeUnknownKeyRefinement integration)', () => {
	const espadaDosManos: ObjEntry = {
		objNumber: 19,
		Name: 'Espada Dos Manos',
		GrhIndex: 5748,
		ObjType: 2,
		Agarrable: 0,
		Anim: 1,
		RazaEnanaAnim: 66,
		MinHit: 4,
		MaxHit: 9,
		Valor: 1120,
		Crucial: 1,
		CP1: 'MAGO',
		CP2: 'DRUIDA',
		CP3: 'LADRON',
		CP4: 'BARDO',
		CP5: 'ASESINO',
		CP6: 'CLERIGO',
		LingH: 16,
		LingP: 0,
		LingO: 0,
		SkHerreria: 20,
	};

	it('accepts a real obj.dat entry with known fields and the CP indexed family', () => {
		expect(objEntrySchema.safeParse(espadaDosManos).success).toBe(
			true,
		);
	});

	it('rejects the same entry when it carries one unrecognized key', () => {
		const withUnknownKey = { ...espadaDosManos, Wololo: 999 };
		expect(objEntrySchema.safeParse(withUnknownKey).success).toBe(
			false,
		);
	});
});

describe('npcEntrySchema - unknown key rejection (makeUnknownKeyRefinement integration)', () => {
	const lobo: NpcEntry = {
		npcNumber: 501,
		Name: 'Lobo',
		NpcType: 0,
		Head: 0,
		Heading: 3,
		Body: 10,
		Movement: 3,
		AguaValida: 0,
		Attackable: 1,
		ReSpawn: 0,
		Hostile: 1,
		Domable: 1250,
		Alineacion: 2,
		Comercia: 0,
		GiveEXP: 100,
		MinHP: 75,
		MaxHP: 75,
		MaxHIT: 18,
		MinHIT: 1,
		DEF: 8,
		PoderAtaque: 80,
		PoderEvasion: 25,
		Snd1: 35,
		Snd2: 9,
		BackUp: 0,
		NROITEMS: 5,
		Drop1: '414-1',
		Drop2: '27-3',
		Drop3: '1002-1',
	};

	it('accepts a real npcs.dat entry with known fields and the Drop/Snd indexed families', () => {
		expect(npcEntrySchema.safeParse(lobo).success).toBe(true);
	});

	it('rejects the same entry when it carries one unrecognized key', () => {
		const withUnknownKey = { ...lobo, Wololo: 999 };
		expect(npcEntrySchema.safeParse(withUnknownKey).success).toBe(
			false,
		);
	});
});
