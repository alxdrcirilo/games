<script lang="ts">
	import Tooltip from '$lib/Tooltip.svelte';
	import gamesData from './games.json' assert { type: 'json' };
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		CancelCircleIcon,
		ComputerIcon,
		GameboyIcon,
		GameController01Icon,
		NintendoSwitchIcon
	} from '@hugeicons/core-free-icons';

	let showStats = false;

	type Game = {
		Name: string;
		Year?: number;
		Genres?: string;
		Rating?: number;
		Playtime?: number;
		Stars?: string;
		Review?: string;
		Platform?: string;
		Bought?: string;
		Played?: string;
		Store?: string;
		Platforms?: string;
		URL?: string;
	};

	let games: Game[] = Array.isArray(gamesData)
		? gamesData.map((game) => ({
				...game,
				Playtime: typeof game.Playtime === 'string' ? Number(game.Playtime) : game.Playtime,
				Rating: typeof game.Rating === 'string' ? Number(game.Rating) : game.Rating
			}))
		: [];

	// Sorting
	let sortColumn: 'Name' | 'Year' | 'Rating' | 'Playtime' = 'Name';
	let sortAsc = true;

	function sortGames(column: 'Name' | 'Year' | 'Rating' | 'Playtime') {
		if (sortColumn === column) {
			sortAsc = !sortAsc;
		} else {
			sortColumn = column;
			sortAsc = true;
		}
		games = [...games].sort((a, b) => {
			const aVal = a[column] ?? '';
			const bVal = b[column] ?? '';
			if (column === 'Name') {
				return sortAsc
					? String(aVal).localeCompare(String(bVal))
					: String(bVal).localeCompare(String(aVal));
			}
			return sortAsc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
		});
	}

	// Sort by name
	games = [...games].sort((a, b) => a.Name.localeCompare(b.Name));

	// Sorted count by store
	const storeCounts: Record<string, number> = {};
	games.forEach((game) => {
		if (game.Platform) {
			const stores = game.Platform.split(',').map((p) => p.trim());
			stores.forEach((store) => {
				storeCounts[store] = (storeCounts[store] || 0) + 1;
			});
		}
	});
	console.log('Store counts:', storeCounts);

	const uniqueGenres = Array.from(
		new Set(
			games.flatMap((game) => (game.Genres ? game.Genres.split(',').map((g) => g.trim()) : []))
		)
	);

	// Genre colors
	const colors = [
		'var(--pink)',
		'var(--lavender)',
		'var(--periwinkle)',
		'var(--silver)',
		'var(--light-gray)',
		'var(--lime-green)',
		'var(--peach)',
		'var(--dusty-rose)',
		'var(--mauve)',
		'var(--light-gray-2)',
		'var(--sky-blue)',
		'var(--mint)',
		'var(--sage)',
		'var(--warm-gray)',
		'var(--light-gray)'
	];
	const genreColors: Record<string, string> = {};
	uniqueGenres.forEach((genre, i) => {
		genreColors[genre] = colors[i % colors.length];
	});

	const platformColors: Record<string, string> = {
		EA: '#f76310',
		GOG: '#6e23ad',
		Nintendo: '#e60012',
		Physical: '#808080',
		Steam: '#1b5587',
		Ubisoft: '#10182a'
	};

	// Hours per platform
	const hoursPerPlatform: Record<string, number> = {};
	games.forEach((game) => {
		if (game.Platform && game.Playtime) {
			hoursPerPlatform[game.Platform] = (hoursPerPlatform[game.Platform] || 0) + game.Playtime;
		}
	});
	const sortedPlatforms = Object.entries(hoursPerPlatform).sort(([, a], [, b]) => b - a);
	const totalHours = sortedPlatforms.reduce((sum, [, hours]) => sum + hours, 0);
</script>

<svelte:head>
	<title>Alexandre Cirilo - Game Reviews</title>
	<meta name="description" content="Reviews of all the games I've played." />
</svelte:head>

<div class="container">
	<header>
		<div class="header-left">
			<h1>Game Reviews 🎮</h1>
			<p>Reviews of all the games I've played.</p>
		</div>
		<div class="header-right">
			<p class="last-updated">
				Last updated:
				<a href="https://github.com/alxdrcirilo/games" target="_blank" rel="noopener noreferrer">
					{new Date(import.meta.env.VITE_LAST_COMMIT_DATE || Date.now()).toLocaleDateString()}
				</a>
			</p>
			<p class="game-count">
				<button class="game-count-btn" on:click={() => (showStats = true)} title="View statistics">
					Showing {games.length} games
				</button>
			</p>
		</div>
	</header>
	<div class="content">
		<table>
			<thead>
				<tr>
					<th
						class="names"
						style="cursor:pointer;"
						title="Name of the game"
						on:click={() => sortGames('Name')}
					>
						Name
						<span style="font-size:0.8em;"
							>{sortColumn === 'Name' ? (sortAsc ? '↑' : '↓') : '↕'}</span
						>
					</th>
					<th
						class="year"
						style="cursor:pointer;"
						title="Release year"
						on:click={() => sortGames('Year')}
					>
						Year
						<span style="font-size:0.8em;"
							>{sortColumn === 'Year' ? (sortAsc ? '↑' : '↓') : '↕'}</span
						>
					</th>
					<th class="genres" style="cursor:default;" title="Genres of the game">Genres</th>
					<th
						class="centered"
						style="cursor:pointer;"
						title="IGDB rating"
						on:click={() => sortGames('Rating')}
					>
						IGDB Rating
						<span style="font-size:0.8em;"
							>{sortColumn === 'Rating' ? (sortAsc ? '↑' : '↓') : '↕'}</span
						>
					</th>
					<th
						class="centered"
						style="cursor:pointer;"
						title="Total playtime"
						on:click={() => sortGames('Playtime')}
					>
						Playtime
						<span style="font-size:0.8em;"
							>{sortColumn === 'Playtime' ? (sortAsc ? '↑' : '↓') : '↕'}</span
						>
					</th>
					<th class="stars" style="cursor:default;" title="Personal rating">Stars</th>
					<th class="centered" style="cursor:default;" title="Whether I own the game">Bought</th>
					<th class="centered" style="cursor:default;" title="Whether I have played the game"
						>Played</th
					>
					<th class="centered" style="cursor:default;" title="Store where the game was purchased"
						>Store</th
					>
				</tr>
			</thead>
			<tbody>
				{#each games as game}
					<tr>
						<td class="names">
							<div style="display: flex; justify-content: space-between; align-items: center;">
								{#if game.URL}
									<a class="game-link" href={game.URL} target="_blank" rel="noopener noreferrer"
										>{game.Name}</a
									>
								{:else}
									{game.Name}
								{/if}
								{#if game.Platform}
									<span class="platform-icon">
										{#if game.Platform.toLowerCase() === 'pc'}
											<HugeiconsIcon
												icon={ComputerIcon}
												size={16}
												color="#333333"
												strokeWidth={2}
											/>
										{:else if game.Platform.toLowerCase().includes('playstation')}
											<HugeiconsIcon
												icon={GameController01Icon}
												size={16}
												color="#003791"
												strokeWidth={2}
											/>
										{:else if game.Platform.toLowerCase().includes('game boy')}
											<HugeiconsIcon icon={GameboyIcon} size={16} color="#65547d" strokeWidth={2} />
										{:else if game.Platform.toLowerCase().includes('nintendo switch')}
											<HugeiconsIcon
												icon={NintendoSwitchIcon}
												size={16}
												color="#B71C1C"
												strokeWidth={2}
											/>
										{/if}
									</span>
								{/if}
							</div>
						</td>
						<td class="year">{game.Year}</td>
						<td class="genres">
							{#if game.Genres}
								{#each game.Genres.split(',').map((g) => g.trim()) as genre}
									<span class="chip" style="background:{genreColors[genre] || '#e0c3fc'};"
										>{genre}</span
									>
								{/each}
							{/if}
						</td>
						<td class="centered">{game.Rating}</td>
						<td class="centered">{game.Playtime}</td>
						<td class="centered review stars">
							<Tooltip title={game.Review ? game.Review : 'No review available'}>
								{#if game.Review}
									<span class="has-review"
										>{'★'.repeat((game.Stars || '').split('⭐️').length - 1)}</span
									>
								{/if}
							</Tooltip>
						</td>
						<td class="centered">
							<span style="color: {game.Bought === 'Yes' ? '#2e7d32' : '#b71c1c'};"
								>{game.Bought === 'Yes' ? '✓' : '✗'}</span
							>
						</td>
						<td class="centered">
							<span style="color: {game.Played === 'Yes' ? '#2e7d32' : '#b71c1c'};"
								>{game.Played === 'Yes' ? '✓' : '✗'}</span
							>
						</td>
						<td class="centered">
							{#if game.Store}
								{#each game.Store.split(',').map((s) => s.trim()) as store}
									<span
										class="chip"
										style="background:{platformColors[store] ||
											'#e0c3fc'}; color: #eeeeee; opacity: 0.8;">{store}</span
									>
								{/each}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if showStats}
		<div class="modal-overlay" on:click={() => (showStats = false)} role="presentation">
			<div class="modal" on:click|stopPropagation role="dialog" aria-label="Statistics">
				<div class="modal-header">
					<h2>Statistics</h2>
					<button class="close-btn" on:click={() => (showStats = false)} title="Close">
						<HugeiconsIcon icon={CancelCircleIcon} size={20} color="#222" strokeWidth={2} />
					</button>
				</div>
				<h3>Hours per platform</h3>
				<div class="stats-list">
					{#each sortedPlatforms as [platform, hours]}
						<div class="stat-row">
							<span class="stat-label">{platform}</span>
							<div class="stat-bar-bg">
								<div
									class="stat-bar"
									style="width: {(hours / sortedPlatforms[0][1]) * 100}%;"
								></div>
							</div>
							<span class="stat-value">{hours}h</span>
						</div>
					{/each}
				</div>
				<p class="stat-total">Total: {totalHours} hours</p>
			</div>
		</div>
	{/if}
</div>

<style>
	:root {
		--pink: #edacbf;
		--lavender: #d7bfe1;
		--periwinkle: #ccd1e3;
		--silver: #d5dbdf;
		--light-gray: #e2e2e2;
		--lime-green: #b9cc77;
		--peach: #e0c59f;
		--dusty-rose: #e2ccc8;
		--mauve: #dfd8db;
		--light-gray-2: #e2e2e2;
		--sky-blue: #95c9ec;
		--mint: #9cd6d5;
		--sage: #c3d9c7;
		--warm-gray: #dbdbd4;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: left;
		position: sticky;
		top: 0;
		z-index: 1;
		padding: 0 20px 10px 20px;
	}

	header h1 {
		font-size: 1.3rem;
		margin-bottom: 0;
	}

	header p {
		opacity: 0.75;
		font-size: 0.65rem;
		margin-top: 8px;
	}

	.header-right {
		text-align: right;
	}

	.header-right p {
		margin-top: 0;
	}

	.header-right .last-updated {
		margin-top: 8px;
	}

	.last-updated a {
		color: inherit;
		text-decoration: underline;
	}

	.game-count-btn {
		all: unset;
		cursor: pointer;
		font-family: inherit;
		font-size: inherit;
		color: inherit;
		text-decoration: underline;
	}

	.chip {
		display: inline-block;
		color: #222;
		border: 1px solid #222;
		border-radius: 0;
		padding: 2px 6px;
		margin: 2px 4px 2px 0;
		font-size: 0.65rem;
		box-shadow: 2px 2px 0 #222;
		opacity: 0.95;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		table-layout: fixed;
		overflow-x: hidden;
	}

	.content {
		overflow: auto;
		padding: 0 20px;
	}

	th,
	td {
		border-bottom: 1px dashed #444;
		padding: 8px;
		font-size: 0.7rem;
	}

	th {
		position: sticky;
		top: 0;
		z-index: 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
	}

	th.names,
	td.names {
		width: 20%;
		max-width: 40%;
		/* TODO */
		/* white-space: nowrap; */
	}

	/* Don't apply white-space: nowrap on mobile */
	@media (max-width: 600px) {
		th.names,
		td.names {
			width: 30%;
			/* TODO */
			/* white-space: wrap; */
		}
	}

	th.year,
	td.year {
		width: 5%;
		max-width: 10%;
		white-space: nowrap;
	}

	/* Don't apply white-space: nowrap on mobile */
	@media (max-width: 600px) {
		th.year,
		td.year {
			width: 10%;
			max-width: 20%;
			/* TODO */
			/* white-space: wrap; */
		}
	}

	th.genres,
	td.genres {
		width: 20%;
		max-width: 30%;
	}

	/* Hide some columns on mobile */
	/* Genres, Rating, Bought, and Played */
	@media (max-width: 600px) {
		td:nth-child(3),
		td:nth-child(4),
		td:nth-child(7),
		td:nth-child(8),
		td:nth-child(9),
		th:nth-child(3),
		th:nth-child(4),
		th:nth-child(7),
		th:nth-child(8),
		th:nth-child(9) {
			display: none;
		}
	}

	.centered {
		text-align: center;
		vertical-align: middle;
	}

	.game-link {
		color: inherit;
		font-size: inherit;
	}

	.game-link:hover {
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.review * {
		color: #333;
		font-size: 1.2rem;
		padding: 4px;
	}

	.has-review {
		cursor: pointer;
		text-decoration: dashed underline;
		text-underline-offset: 5px;
		text-decoration-color: rgba(34, 34, 34, 0.5);
	}

	@media (max-width: 600px) {
		.has-review {
			text-decoration: solid underline;
			text-decoration-color: rgba(34, 34, 34, 0.5);
		}
	}

	.platform-icon {
		align-items: center;
		display: flex;
		margin-left: 16px;
		opacity: 0.7;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		background-color: #fcf2ec;
		border: 1px solid #222;
		border-radius: 0;
		padding: 24px 28px;
		min-width: 320px;
		max-width: 420px;
		box-shadow: 4px 4px 0 #222;
	}

	.modal * {
		background-color: transparent;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.modal h2 {
		font-size: 1rem;
		margin: 0;
	}

	.modal h3 {
		font-size: 0.8rem;
		margin: 0 0 12px 0;
		opacity: 0.7;
	}

	.close-btn {
		all: unset;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	.close-btn:hover {
		opacity: 1;
	}

	.stats-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.stat-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.stat-label {
		font-size: 0.7rem;
		width: 110px;
		text-align: right;
		flex-shrink: 0;
	}

	.stat-bar-bg {
		flex: 1;
		height: 14px;
		background-color: #f0e0d6;
		border: 1px solid #222;
		border-radius: 0;
		overflow: hidden;
	}

	.stat-bar {
		height: 100%;
		background-color: #1b5587;
		opacity: 0.5;
		border-radius: 0;
		transition: width 0.3s ease;
	}

	.stat-value {
		font-size: 0.7rem;
		width: 45px;
		text-align: right;
		flex-shrink: 0;
		opacity: 0.7;
	}

	.stat-total {
		font-size: 0.75rem;
		text-align: right;
		margin-top: 14px;
		opacity: 0.7;
	}
</style>
