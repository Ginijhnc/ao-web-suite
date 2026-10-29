import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DAT_ENTRY_KEYS } from '@Types/dats';
import type { HechizosDat } from '@Types/dats/hechizos';
import type { NpcsDat } from '@Types/dats/npcs';
import type { ObjDat } from '@Types/dats/obj';
import { describe, it, expect } from 'vitest';
import {
	extractHeaderComment,
	findCanonicalKey,
	mapPairsToEntry,
	parseDatFile,
	parseHechizoTargets,
	parseHechizoTypes,
	parseIniSections,
	parseNpcCategories,
	parseObjCategories,
	parsePotionCategories,
	stripInlineComment,
} from './dats';

/* Use fixture files when the test needs realistic, multi-section .dat input.
 * Use inline strings for lower-level helpers and rejection cases where a
 * minimal targeted input is clearer than a file on disk. */
const readFixture = (fixturePath: string): string => {
	return readFileSync(
		resolve(__dirname, '../../fixtures/dats', fixturePath),
		'latin1', // matches actual .dat files which use ISO-8859-1
	);
};

describe('stripInlineComment', () => {
	it("preserves apostrophes inside words like O'Riley de Banderbill", () => {
		expect(stripInlineComment("Name=O'Riley de Banderbill")).toBe(
			"Name=O'Riley de Banderbill",
		);
	});

	it("strips a trailing ' comment with leading whitespace from an item definition", () => {
		expect(stripInlineComment("Obj1=138-1000 'Caña de Pescar")).toBe(
			'Obj1=138-1000',
		);
	});

	it('returns the original string when no comment is present in header value', () => {
		expect(stripInlineComment('NumNPCs=923')).toBe('NumNPCs=923');
	});

	it('handles comments in complex field names with many characters', () => {
		expect(
			stripInlineComment(
				"PalabrasMagicas=Incendio Rayo 'Hechizo de fuego",
			),
		).toBe('PalabrasMagicas=Incendio Rayo');
	});
});

describe('extractHeaderComment', () => {
	it('captures the text after the apostrophe in a full NPC section header', () => {
		expect(extractHeaderComment("[NPC41] 'Pescador Quieto")).toBe(
			'Pescador Quieto',
		);
	});

	it('captures comment from complex section header with special characters', () => {
		expect(
			extractHeaderComment(
				"[HECHIZO5] 'Hechizo de Fuego y Hielo Combinado",
			),
		).toBe('Hechizo de Fuego y Hielo Combinado');
	});

	it('returns undefined when no apostrophe is present in header', () => {
		expect(extractHeaderComment('[NPC1]')).toBeUndefined();
	});

	it('handles whitespace correctly in header comments', () => {
		expect(
			extractHeaderComment("[OBJ10]   'Arma  con  espacios   "),
		).toBe('Arma  con  espacios');
	});
});

describe('parseIniSections', () => {
	it('parses [HEADER] lines into sections with key-value pairs', () => {
		const text = `
			[NPC1]
			Name=Test
			Level=5

			[NPC2]
			Name=Another
		`;
		const result = parseIniSections(text);
		expect(result).toHaveLength(2);
		const section0 = result[0];
		const section1 = result[1];
		expect(section0).toBeDefined();
		expect(section1).toBeDefined();
		if (!section0 || !section1) return;
		expect(section0).toMatchObject({
			header: 'NPC1',
			pairs: [
				{ key: 'Name', value: 'Test' },
				{ key: 'Level', value: '5' },
			],
		});
		expect(section1).toMatchObject({
			header: 'NPC2',
			pairs: [{ key: 'Name', value: 'Another' }],
		});
	});

	it('skips comment lines and blank lines', () => {
		const text = `
			# Banner separator
			[NPC1]
			Name=Test
			' inline comment line
			Level=5

			[NPC2]
		`;
		const result = parseIniSections(text);
		expect(result).toHaveLength(2);
		const section0 = result[0];
		expect(section0).toBeDefined();
		if (!section0) return;
		expect(section0.pairs).toHaveLength(2);
	});

	it('drops lines before the first section', () => {
		const text = `
			0 ====== NPCS COMUNES
			1 ====== PUEDE RESUCITAR

			[INIT]
			NumNPCs=60
		`;
		const result = parseIniSections(text);
		expect(result).toHaveLength(1);
		const section0 = result[0];
		expect(section0).toBeDefined();
		if (!section0) return;
		expect(section0.header).toBe('INIT');
	});

	it('captures header comments when present', () => {
		const text = `[NPC1] 'Pescador Quieto
					  Name=Test`;
		const result = parseIniSections(text);
		const section0 = result[0];
		expect(section0).toBeDefined();
		if (!section0) return;
		expect(section0.headerComment).toBe('Pescador Quieto');
	});
});

describe('findCanonicalKey', () => {
	it('matches a direct case-insensitive name', () => {
		expect(findCanonicalKey('attackable', DAT_ENTRY_KEYS.npcs)).toBe(
			'Attackable',
		);
	});

	it('normalizes ALL-CAPS variants to canonical schema casing', () => {
		expect(findCanonicalKey('NROITEMS', DAT_ENTRY_KEYS.npcs)).toBe(
			'NROITEMS',
		);
		expect(findCanonicalKey('DEFm', DAT_ENTRY_KEYS.npcs)).toBe('DefM');
	});

	it('returns null for indexed keys that do not have explicit base in schema', () => {
		expect(findCanonicalKey('obj10', DAT_ENTRY_KEYS.npcs)).toBeNull();
		expect(findCanonicalKey('Drop3', DAT_ENTRY_KEYS.npcs)).toBeNull();
	});

	it('returns null for unknown keys', () => {
		expect(
			findCanonicalKey('Unknown', DAT_ENTRY_KEYS.npcs),
		).toBeNull();
	});
});

describe('mapPairsToEntry', () => {
	it('coerces numeric values and preserves ItemSchema-style strings', () => {
		const entry = mapPairsToEntry(
			[
				{ key: 'NROITEMS', value: '2' },
				{ key: 'Obj1', value: '138-1000' },
			],
			['NROITEMS', 'Obj'],
		);
		expect(entry).toEqual({
			NROITEMS: 2,
			Obj1: '138-1000',
		});
	});
});

describe('parseNpcCategories', () => {
	it('parses every <id> ====== <label> line and stops at [INIT]', () => {
		const text = `
			0 ====== NPCS COMUNES
			1 ====== PUEDE RESUCITAR

			[INIT]
			2 ====== SHOULD NOT BE READ
		`;
		expect(parseNpcCategories(text)).toEqual(
			new Map<number, string>([
				[0, 'NPCS COMUNES'],
				[1, 'PUEDE RESUCITAR'],
			]),
		);
	});
});

const expectedCategories = new Map<number, string>([
	[0, 'NPCS COMUNES'],
	[1, 'PUEDE RESUCITAR'],
	[2, 'GUARDIA'],
]);

describe('parseDatFile (NPCs)', () => {
	it('extracts numNpcs and npcCategories from the preamble', () => {
		const npcsCategoriesData = readFixture('npcs/categories.dat');
		const result = parseDatFile('NPCs.dat', npcsCategoriesData);
		expect(result.success).toBe(true);
		if (!result.success) return;
		const data = result.parsed.data as NpcsDat;
		expect(data.numNpcs).toBe(60);
		expect(data.npcCategories).toEqual(expectedCategories);
	});

	it('parses NPC entries with datComentario and indexed Obj fields', () => {
		const npcsCommentData = readFixture('npcs/with-comments.dat');
		const result = parseDatFile('NPCs.dat', npcsCommentData);
		expect(result.success).toBe(true);
		if (!result.success) return;
		const data = result.parsed.data as NpcsDat;

		expect(data.entries[0]).toMatchObject({
			npcNumber: 41,
			datComentario: 'Pescador Quieto',
			Name: 'Pescador',
			NpcType: 0,
			Desc: 'Bienvenido al gremio',
			Obj1: '138-1000',
			Obj2: '139-1000',
			NROITEMS: 2,
			BackUp: 1,
		});
	});

	it('rejects an entry with unrecognized fields', () => {
		const result = parseDatFile(
			'NPCs.dat',
			'[INIT]\nNumNPCs=1\n[NPC1]\nName=X\nSecondaryName=Test\nWololo=0\n',
		);
		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.reason).toBe('schema-mismatch');
	});

	it('accepts a valid indexed family key and rejects a non-indexed unknown key', () => {
		const valid = parseDatFile(
			'NPCs.dat',
			'[INIT]\nNumNPCs=1\n[NPC1]\nName=X\nDrop3=73-0\n',
		);
		expect(valid.success).toBe(true);

		const invalid = parseDatFile(
			'NPCs.dat',
			'[INIT]\nNumNPCs=1\n[NPC1]\nName=X\nSecondaryDrop=73-0\n',
		);
		expect(invalid.success).toBe(false);
		if (invalid.success) return;
		expect(invalid.reason).toBe('schema-mismatch');
	});

	it('rejects a file missing the [INIT] header', () => {
		const result = parseDatFile('NPCs.dat', '[NPC1]\nName=X\n');
		expect(result.success).toBe(false);
	});

	it('rejects a file with no entries', () => {
		const result = parseDatFile('NPCs.dat', '[INIT]\nNumNPCs=2\n');
		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.reason).toBe('no-entries');
	});
});

describe('parseObjCategories', () => {
	it('parses ObjType labels from the first preamble segment', () => {
		const text = `##############################################
			' 1: Comida
			' 2: Armas
			##############################################
			'1 Modifica la Agilidad
			[INIT]
			NumOBJs=1
		`;
		expect(parseObjCategories(text)).toEqual(
			new Map<number, string>([
				[1, 'Comida'],
				[2, 'Armas'],
			]),
		);
	});
});

describe('parsePotionCategories', () => {
	it('parses TipoPocion labels from the second preamble segment', () => {
		const text = `##############################################
			' 1: Comida
			' 2: Armas
			##############################################
			'1 Modifica la Agilidad
			'2 Modifica la Fuerza
			[INIT]
			NumOBJs=1
		`;
		expect(parsePotionCategories(text)).toEqual(
			new Map<number, string>([
				[1, 'Modifica la Agilidad'],
				[2, 'Modifica la Fuerza'],
			]),
		);
	});
});

describe('parseHechizoTypes', () => {
	it('parses Tipo labels before the Targets marker', () => {
		const text = `'1 actuan sobre HP,MANA,STA,HAM y SED.
			'2 actuan sobre los estados de los usuarios.
			'Targets....
			'1.....Usuario.
		`;
		expect(parseHechizoTypes(text)).toEqual(
			new Map<number, string>([
				[1, 'actuan sobre HP,MANA,STA,HAM y SED.'],
				[2, 'actuan sobre los estados de los usuarios.'],
			]),
		);
	});
});

describe('parseHechizoTargets', () => {
	it('parses Target labels after the Targets marker', () => {
		const text = `'1 actuan sobre HP,MANA,STA,HAM y SED.
			'Targets....
			'1.....Usuario.
			'2.....Npc.
		`;
		expect(parseHechizoTargets(text)).toEqual(
			new Map<number, string>([
				[1, 'Usuario.'],
				[2, 'Npc.'],
			]),
		);
	});
});

describe('parseDatFile (Obj)', () => {
	it('extracts numObjs, objCategories and potionCategories from a valid obj.dat file', () => {
		const objData = readFixture('obj/valid.dat');
		const result = parseDatFile('obj.dat', objData);
		expect(result.success).toBe(true);
		if (!result.success) return;
		const data = result.parsed.data as ObjDat;
		expect(data.numObjs).toBe(2);
		expect(data.entries).toHaveLength(2);
		expect(data.objCategories).toEqual(
			new Map<number, string>([
				[1, 'Comida'],
				[2, 'Armas'],
			]),
		);
		expect(data.potionCategories).toEqual(
			new Map<number, string>([
				[1, 'Modifica la Agilidad'],
				[2, 'Modifica la Fuerza'],
			]),
		);
	});

	it('parses OBJ entries with correct field names and values', () => {
		const objData = readFixture('obj/valid.dat');
		const result = parseDatFile('obj.dat', objData);
		expect(result.success).toBe(true);
		if (!result.success) return;
		const data = result.parsed.data as ObjDat;
		expect(data.entries[0]).toMatchObject({
			objNumber: 1,
			Name: 'TestItem',
			GrhIndex: 1,
			ObjType: 0,
			Valor: 100,
		});
	});

	it('rejects a file missing the [INIT] header with NumOBJs key', () => {
		const result = parseDatFile('obj.dat', '[OBJ1]\nName=Sword\n');
		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.reason).toBe('missing-header');
	});
});

describe('parseDatFile (Hechizos)', () => {
	it('extracts numeroHechizos, hechizoTypes and hechizoTargets from a valid hechizos.dat file', () => {
		const hechizosData = readFixture('hechizos/valid.dat');
		const result = parseDatFile('Hechizos.dat', hechizosData);
		expect(result.success).toBe(true);
		if (!result.success) return;
		const data = result.parsed.data as HechizosDat;
		expect(data.numeroHechizos).toBe(1);
		expect(data.entries).toHaveLength(1);
		expect(data.hechizoTypes).toEqual(
			new Map<number, string>([
				[1, 'actuan sobre HP,MANA,STA,HAM y SED.'],
				[2, 'actuan sobre los estados de los usuarios.'],
			]),
		);
		expect(data.hechizoTargets).toEqual(
			new Map<number, string>([
				[1, 'Usuario.'],
				[2, 'Npc.'],
			]),
		);
	});

	it('parses Hechizo entries with spell-specific fields and values', () => {
		const hechizosData = readFixture('hechizos/valid.dat');
		const result = parseDatFile('Hechizos.dat', hechizosData);
		expect(result.success).toBe(true);
		if (!result.success) return;
		const data = result.parsed.data as HechizosDat;
		expect(data.entries[0]).toMatchObject({
			hechizoNumber: 1,
			Nombre: 'Hechizo Prueba',
			Desc: 'Un hechizo de prueba',
			PalabrasMagicas: 'Prueba',
			ManaRequerido: 10,
		});
	});

	it('rejects a file missing the [INIT] header with NumeroHechizos key', () => {
		const result = parseDatFile(
			'Hechizos.dat',
			'[HECHIZO1]\nNombre=Fuego\n',
		);
		expect(result.success).toBe(false);
		if (result.success) return;
		expect(result.reason).toBe('missing-header');
	});
});
