import type { MagicByteCheck } from '@Types/database';

export const GRAPHICS_ACCEPTED_EXTENSIONS =
	'.jpg,.jpeg,.png,.webp,.bmp,.avif';

export const GRAPHICS_MAGIC_BYTES: ReadonlyArray<MagicByteCheck> = [
	{ extension: '.jpg', offset: 0, bytes: [0xff, 0xd8, 0xff] },
	{ extension: '.jpeg', offset: 0, bytes: [0xff, 0xd8, 0xff] },
	{ extension: '.png', offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] },
	{ extension: '.webp', offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
	{ extension: '.bmp', offset: 0, bytes: [0x42, 0x4d] },
	{
		extension: '.avif',
		offset: 4,
		bytes: [0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66],
	},
];

export const GRAPHICS_MAGIC_BYTE_HEADER_SIZE = 12;
