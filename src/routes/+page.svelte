<script lang="ts">
	import Tooltip from '$lib/Tooltip.svelte';
	import gamesData from './games.json' assert { type: 'json' };

	type Game = {
		Name: string;
		Year?: number;
		Genres?: string;
		Rating?: number;
		Playtime?: number;
		Stars?: string;
		Review?: string;
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

	const uniqueGenres = Array.from(
		new Set(
			games.flatMap((game) => (game.Genres ? game.Genres.split(',').map((g) => g.trim()) : []))
		)
	);

	// Genre colors
	const colors = [
		'#EDACBF',
		'#D7BFE1',
		'#CCD1E3',
		'#D5DBDF',
		'#E2E2E2',
		'#B9CC77',
		'#E0C59F',
		'#E2CCC8',
		'#DFD8DB',
		'#E2E2E2',
		'#95C9EC',
		'#9CD6D5',
		'#C3D9C7',
		'#DBDBD4',
		'#E2E2E2'
	];
	const genreColors: Record<string, string> = {};
	uniqueGenres.forEach((genre, i) => {
		genreColors[genre] = colors[i % colors.length];
	});
</script>

<svelte:head>
	<title>Alexandre Cirilo - Game Reviews</title>
	<meta name="description" content="Reviews of all the games I've played." />
</svelte:head>

<div class="container">
	<header>
		<h1>Game Reviews 🎮</h1>
		<p>Reviews of all the games I've played.</p>
		<hr />
	</header>
	<div class="content">
		<table>
			<thead>
				<tr>
					<th style="cursor:pointer" title="Sort by Name" on:click={() => sortGames('Name')}>
						Name
						<span style="font-size:0.8em;"
							>{sortColumn === 'Name' ? (sortAsc ? '↑' : '↓') : '↕'}</span
						>
					</th>
					<th style="cursor:pointer" title="Sort by Year" on:click={() => sortGames('Year')}>
						Year
						<span style="font-size:0.8em;"
							>{sortColumn === 'Year' ? (sortAsc ? '↑' : '↓') : '↕'}</span
						>
					</th>
					<th class="genres">Genres</th>
					<th
						class="centered"
						style="cursor:pointer"
						title="Sort by Rating"
						on:click={() => sortGames('Rating')}
					>
						Rating
						<span style="font-size:0.8em;"
							>{sortColumn === 'Rating' ? (sortAsc ? '↑' : '↓') : '↕'}</span
						>
					</th>
					<th
						class="centered"
						style="cursor:pointer"
						title="Sort by Playtime"
						on:click={() => sortGames('Playtime')}
					>
						Playtime
						<span style="font-size:0.8em;"
							>{sortColumn === 'Playtime' ? (sortAsc ? '↑' : '↓') : '↕'}</span
						>
					</th>
					<th>Stars</th>
					<th class="centered">Bought</th>
					<th class="centered">Played</th>
				</tr>
			</thead>
			<tbody>
				{#each games as game}
					<tr>
						<td>
							{#if game.URL}
								<a class="game-link" href={game.URL} target="_blank" rel="noopener noreferrer"
									>{game.Name}</a
								>
							{:else}
								{game.Name}
							{/if}
						</td>
						<td>{game.Year}</td>
						<td class="genres">
							{#if game.Genres}
								{#each game.Genres.split(',').map((g) => g.trim()) as genre}
									<span class="chip" style="background:{genreColors[genre] || '#e0c3fc'}"
										>{genre}</span
									>
								{/each}
							{/if}
						</td>
						<td class="centered">{game.Rating}</td>
						<td class="centered">{game.Playtime}</td>
						<td class="centered review">
							<Tooltip title={game.Review ? game.Review : 'No review available'}>
								<span class={game.Review ? 'has-review' : ''}>{game.Stars}</span>
							</Tooltip>
						</td>
						<td class="centered">
							<span style="color: {game.Bought === 'Yes' ? '#2e7d32' : '#b71c1c'}"
								>{game.Bought === 'Yes' ? '✓' : '✗'}</span
							>
						</td>
						<td class="centered">
							<span style="color: {game.Played === 'Yes' ? '#2e7d32' : '#b71c1c'}"
								>{game.Played === 'Yes' ? '✓' : '✗'}</span
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<footer>
		<p>
			Made with ❤️ by <a
				href="https://alxdrcirilo.dev"
				target="_blank"
				rel="noopener noreferrer"
				style="color: inherit;">alxdrcirilo</a
			>
		</p>
		<p>Showing {games.length} games</p>
		<p>
			Last updated: {new Date(
				import.meta.env.VITE_LAST_COMMIT_DATE || Date.now()
			).toLocaleDateString()}
		</p>
	</footer>
</div>

<style>
	:root {
		--imperial-red: #f941424d;
		--orange-crayola: #f3722c4d;
		--carrot-orange: #f8961e4d;
		--coral: #f9844a4d;
		--saffron: #f9c74f4d;
		--pistachio: #90be6d4d;
		--zomp: #43aa8b4d;
		--dark-cyan: #4d908e4d;
		--paynes-gray: #5775904d;
		--cerulean: #277da14d;
		--amethyst: #9b5de54d;
		--magenta: #f725854d;
		--turquoise: #48cae44d;
		--mint: #80ffdb4d;
		--lemon: #ffd60a4d;
	}

	hr {
		border: none;
		border-top: 1px dashed #222;
		opacity: 0.5;
		margin: 12px 0;
	}

	header {
		text-align: center;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	header h1 {
		font-size: 1.5rem;
	}

	header p {
		opacity: 0.75;
		font-size: 0.725rem;
	}

	.chip {
		display: inline-block;
		color: #222;
		border-radius: 12px;
		padding: 2px 8px;
		margin: 2px 4px 2px 0;
		font-size: 0.7rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		opacity: 0.9;
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
		border-bottom: 1px solid #ddd;
		padding: 8px;
		font-size: 0.7rem;
	}

	th {
		position: sticky;
		top: 0;
		z-index: 2;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
	}

	th.genres,
	td.genres {
		width: 20%;
		max-width: 30%;
	}

	/* Hide some columns on mobile */
	/* Genres, Rating, Bought, and Played */
	@media (max-width: 600px) {
		th:nth-child(8),
		td:nth-child(8),
		th:nth-child(7),
		td:nth-child(7),
		th:nth-child(5),
		td:nth-child(5),
		th:nth-child(4),
		td:nth-child(4),
		th:nth-child(3),
		td:nth-child(3) {
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

	footer {
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
		border-top: 1px dashed rgba(34, 34, 34, 0.5);
		padding-left: 1rem;
		padding-right: 1rem;
		box-sizing: border-box;
	}

	footer p {
		font-size: 0.65rem;
		color: #222;
	}
</style>
