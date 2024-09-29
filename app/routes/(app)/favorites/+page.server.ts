import type { DB } from '~shared/types';
import type { OrderByExpression } from 'kysely';

import { libraryItems, search } from '$lib/server/db/queries';
import { error, redirect } from '@sveltejs/kit';
import config from '~shared/config';
import db from '~shared/db';
import { match } from 'ts-pattern';

import { orderSchema, sortSchema } from '~/lib/schemas';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
	if (!config.site.enableUsers) {
		error(404, { message: 'Not Found' });
	}

	if (!locals.user) {
		redirect(302, `/login?to=/favorites`);
	}

	const searchParams = new URLSearchParams(url.searchParams);
	const sort = sortSchema
		.nullish()
		.transform((val) => val ?? config.site.defaultSort)
		.catch(config.site.defaultSort)
		.parse(searchParams.get('sort'));
	const order = orderSchema
		.nullish()
		.transform((val) => val ?? config.site.defaultOrder)
		.catch(config.site.defaultOrder)
		.parse(searchParams.get('order'));
	const blacklist = cookies.get('blacklist');

	if (blacklist) {
		searchParams.set('blacklist', blacklist);
	}

	const orderBy = match(order)
		.with('asc', () => 'created_at asc' as OrderByExpression<DB, 'user_favorites', undefined>)
		.with('desc', () => 'created_at desc' as OrderByExpression<DB, 'user_favorites', undefined>)
		.exhaustive();

	const favorites = (
		await db
			.selectFrom('user_favorites')
			.select('archive_id')
			.where('user_id', '=', locals.user.id)
			.orderBy([orderBy])
			.execute()
	).map(({ archive_id }) => archive_id);

	if (!favorites.length) {
		return {
			libraryPage: {
				archives: [],
				page: 1,
				limit: 24,
				total: 0,
			},
		};
	}

	const { ids, total } = await search(searchParams, !!locals.user?.admin, favorites);

	return {
		libraryPage: {
			archives: await libraryItems(ids, sort === 'saved_at' ? favorites : undefined),
			page: 1,
			limit: 24,
			total,
		},
	};
};
