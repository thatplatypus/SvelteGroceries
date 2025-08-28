import { writable, derived, get } from 'svelte/store';

import type { Readable } from 'svelte/store';
export type AsyncValue<T> = Promise<T>;
export type Updater<T> = (value: T) => AsyncValue<T> | T;
export type Stores = Readable<T> | [Readable<T>, ...Array<Readable<T>>];
export type StoresValues<T> = T extends Readable<infer U> ? U : never;

export interface Asyncable<T> extends Readable<AsyncValue<T>> {
    get: () => AsyncValue<T>;
    set: (value: T) => void;
    update: (updater: Updater<T>) => void;
}

export declare function asyncable<T>(
    getter: () => AsyncValue<T> | T,
    setter?: ((newValue: T, oldValue: T) => AsyncValue<T> | T) | unknown
): Asyncable<T>;

export declare function asyncable<T, S extends Stores>(
    getter: (...values: StoresValues<S>[]) => AsyncValue<T> | T,
    setter: ((newValue: T, oldValue: T) => AsyncValue<T> | T) | unknown,
    stores: S
): Asyncable<T>;

export declare function syncable<T>(
    stores: Stores,
    initialValue?: T
): Readable<T>;

export function asyncable(getter, setter = () => {}, stores = []) {
	let resolve;
	const initial = new Promise((res) => (resolve = res));

	const derived$ = derived(stores, (values) => values);

	const store$ = writable(initial, (set) => {
		return derived$.subscribe(async (values = []) => {
			let value = getter(...values);
			if (value === undefined) return;
			value = Promise.resolve(value);
			set(value);
			resolve(value);
		});
	});

	async function set(newValue, oldValue) {
		if (newValue === oldValue) return;
		store$.set(Promise.resolve(newValue));
		try {
			await setter(newValue, oldValue);
		} catch (err) {
			store$.set(Promise.resolve(oldValue));
			throw err;
		}
	}

	return {
		subscribe: store$.subscribe,
		async update(reducer) {
			if (!setter) return;
			let oldValue;
			let newValue;
			try {
				oldValue = await get(store$);
				newValue = await reducer(shallowCopy(oldValue));
			} finally {
				await set(newValue, oldValue);
			}
		},
		async set(newValue) {
			if (!setter) return;
			let oldValue;
			try {
				oldValue = await get(store$);
				newValue = await newValue;
			} finally {
				await set(newValue, oldValue);
			}
		},
		get() {
			return get(store$);
		},
	};
}

export function syncable(stores, initialValue) {
	return derived(
		stores,
		($values, set) =>
			(Array.isArray(stores) ? Promise.allSettled : Promise.resolve)
				.call(Promise, $values)
				.then(set),
		initialValue
	);
}

function shallowCopy(value) {
	if (typeof value !== 'object' || value === null) return value;
	return Array.isArray(value) ? [...value] : { ...value };
}