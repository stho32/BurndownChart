<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';
	import { page } from '$app/state';

	let { children } = $props();

	const navItems = [
		{ href: `${base}/`, label: 'Home' },
		{ href: `${base}/experiment1/`, label: 'Experiment 1' },
		{ href: `${base}/experiment2/`, label: 'Experiment 2' },
		{ href: `${base}/experiment3/`, label: 'Experiment 3' },
		{ href: `${base}/source-code-quality/`, label: 'Source Code Quality' },
		{ href: `${base}/task-burndown-simulator/`, label: 'Simulator' },
		{ href: `${base}/pppchart/`, label: 'Project Quality' },
		{ href: `${base}/priohelper/`, label: 'Priohelper' }
	];

	let menuOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<header>
		<nav>
			<a href="{base}/" class="logo">BurndownChart</a>
			<button class="menu-toggle" onclick={() => (menuOpen = !menuOpen)} aria-label="Toggle menu">
				{menuOpen ? '✕' : '☰'}
			</button>
			<ul class:open={menuOpen}>
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							class:active={page.url.pathname === item.href || page.url.pathname === item.href.slice(0, -1)}
							onclick={() => (menuOpen = false)}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
		color: #333;
		background: #f5f5f5;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		background: #2c3e50;
		color: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	nav {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 56px;
	}

	.logo {
		color: white;
		text-decoration: none;
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.menu-toggle {
		display: none;
		background: none;
		border: none;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 0.25rem;
	}

	li a {
		color: rgba(255, 255, 255, 0.75);
		text-decoration: none;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.9rem;
		transition: background 0.15s, color 0.15s;
	}

	li a:hover {
		color: white;
		background: rgba(255, 255, 255, 0.1);
	}

	li a.active {
		color: white;
		background: rgba(255, 255, 255, 0.2);
	}

	main {
		flex: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		width: 100%;
		box-sizing: border-box;
	}

	@media (max-width: 640px) {
		.menu-toggle {
			display: block;
		}

		ul {
			display: none;
			position: absolute;
			top: 56px;
			left: 0;
			right: 0;
			background: #2c3e50;
			flex-direction: column;
			padding: 0.5rem;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		}

		ul.open {
			display: flex;
		}

		li a {
			display: block;
			padding: 0.75rem 1rem;
		}
	}
</style>
