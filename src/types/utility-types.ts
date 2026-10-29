/**
 * Avoids keeping a list of values and a union type in sync by hand.
 * Declare the values once in an object and derive the type from it.
 * It also reads clearer than writing `T[keyof T]` at each call site.
 */
export type ValueOf<T> = T[keyof T];

/**
 * For deriving a type that changes some property types of another.
 * If a replaced property is renamed or removed in the base type, the
 * compiler flags it instead of silently adding a new property.
 */
export type OverrideProperties<
	TOriginal,
	TOverride extends {
		[Key in keyof TOverride]: Key extends keyof TOriginal
			? TOverride[Key]
			: never;
	},
> = Omit<TOriginal, keyof TOverride> & TOverride;

/**
 * For code that builds a read-only structure step by step. The mutable
 * version is derived instead of restated, so adding a field to the
 * read-only type updates both.
 */
export type DeepWriteable<T> =
	T extends Readonly<{
		-readonly [K in keyof T]: T[K];
	}>
		? {
				-readonly [K in keyof T]: DeepWriteable<T[K]>;
			}
		: T;
