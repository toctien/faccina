<script lang="ts">
	import LimitOptions from '$lib/components/limit-options.svelte';
	import ListItem from '$lib/components/list-item.svelte';
	import ListPagination from '$lib/components/list-pagination.svelte';
	import SortOptions from '$lib/components/sort-options.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	export let data;

	$: libraryPage = data.libraryPage;
</script>

<svelte:head>
	<title>Favorites • {data.site.name}</title>
</svelte:head>

<main class="container relative flex flex-auto flex-col gap-y-2">
	<p class="text-xl font-semibold text-foreground">Favorites ({libraryPage.total})</p>

	<div class="grid items-end gap-2 md:flex">
		<div class="flex w-full gap-2">
			<LimitOptions pageLimits={data.site.pageLimits} />
			<SortOptions
				class="w-full"
				defaultOrder={data.site.defaultOrder}
				defaultSort={data.site.defaultSort}
				type="favorites"
			/>
		</div>
		<ListPagination
			class="mx-auto w-fit md:mx-0 md:ms-auto"
			limit={libraryPage.limit}
			total={libraryPage.total}
		/>
	</div>

	<Separator />

	{#if libraryPage.archives.length}
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
			{#each libraryPage.archives as archive (archive.id)}
				<ListItem gallery={archive} />
			{/each}
		</div>
	{:else}
		<p class="mx-auto my-auto w-fit text-2xl font-medium">No results found</p>
	{/if}

	<Separator />

	<ListPagination
		class="mx-auto w-fit md:mx-0 md:ms-auto md:flex-grow-0"
		limit={libraryPage.limit}
		total={libraryPage.total}
	/>
</main>
