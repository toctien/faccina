import { writable } from 'svelte/store';
import type { Archive } from './models';
import { preferencesSchema, type ReaderPreferences } from './utils';

export const showBar = writable(true);

export const currentArchive = writable<Archive | undefined>();

export const preferencesOpen = writable(false);
export const previewLayout = writable(false);

export const readerPage = writable<number | undefined>();
export const prevPage = writable<number | undefined>();
export const nextPage = writable<number | undefined>();

export const prefs = writable<ReaderPreferences>(preferencesSchema.parse({}));

export const readerTimeout = (() => {
	let timeout = 0;

	const clear = () => clearTimeout(timeout);
	const reset = () => {
		clear();
		timeout = setTimeout(() => {
			showBar.set(false);
		}, 3000);
	};

	return { reset, clear };
})();
