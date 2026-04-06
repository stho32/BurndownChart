<script lang="ts">
	import { base } from '$app/paths';

	const testLinks = [
		{
			label: 'Test 1: Moderate usage, high impact',
			params:
				'nutzungen=3&mitarbeiter=6&extern=4&workaround=5&ersparnis=5&ziel%5B%5D=1&ziel%5B%5D=2&entscheider=3&risiko=5'
		},
		{
			label: 'Test 2: Maximum values',
			params:
				'nutzungen=10&mitarbeiter=9&extern=10&workaround=10&ersparnis=10&ziel%5B%5D=1&ziel%5B%5D=2&ziel%5B%5D=3&ziel%5B%5D=4&entscheider=5&risiko=10'
		},
		{
			label: 'Test 3: Minimum values',
			params: 'nutzungen=1&mitarbeiter=1&extern=1&workaround=1&ersparnis=1&entscheider=1&risiko=1'
		},
		{
			label: 'Test 4: Mixed values',
			params:
				'nutzungen=6&mitarbeiter=3&extern=4&workaround=5&ersparnis=7&ziel%5B%5D=3&entscheider=4&risiko=7'
		},
		{
			label: 'Test 5: Low usage, medium impact',
			params:
				'nutzungen=2&mitarbeiter=3&extern=4&workaround=5&ersparnis=6&ziel%5B%5D=1&ziel%5B%5D=4&entscheider=2&risiko=3'
		},
		{
			label: 'Test 6: High usage, high impact',
			params:
				'nutzungen=9&mitarbeiter=6&extern=6&workaround=10&ersparnis=8&ziel%5B%5D=2&ziel%5B%5D=3&entscheider=5&risiko=9'
		},
		{
			label: 'Test 7: Low external impact',
			params:
				'nutzungen=3&mitarbeiter=2&extern=1&workaround=5&ersparnis=4&ziel%5B%5D=4&entscheider=3&risiko=5'
		},
		{
			label: 'Test 8: High external impact, no workaround needed',
			params:
				'nutzungen=6&mitarbeiter=9&extern=10&workaround=1&ersparnis=9&ziel%5B%5D=1&ziel%5B%5D=2&ziel%5B%5D=3&entscheider=4&risiko=7'
		},
		{
			label: 'Test 9: Average values, no goals selected',
			params:
				'nutzungen=4&mitarbeiter=5&extern=4&workaround=5&ersparnis=3&entscheider=1&risiko=1'
		},
		{
			label: 'Test 10: High values, all goals selected',
			params:
				'nutzungen=8&mitarbeiter=7&extern=6&workaround=10&ersparnis=10&ziel%5B%5D=1&ziel%5B%5D=2&ziel%5B%5D=3&ziel%5B%5D=4&entscheider=5&risiko=8'
		}
	];
</script>

<div class="container">
	<h1>Prio-Helper Test Links</h1>
	<p>Click on the links below to test different parameter combinations for the Priorisierungshelfer:</p>

	<div class="list-group">
		{#each testLinks as link}
			<a href="{base}/priohelper/?{link.params}" class="list-group-item">
				{link.label}
			</a>
		{/each}
	</div>

	<p class="nav-link">
		<a href="{base}/priohelper/">Priorisierungshelfer</a>
		&middot;
		<a href="{base}/priohelper/entwicklungsbedarf/">Entwicklungsbedarf-Helper</a>
	</p>
</div>

<style>
	.container {
		max-width: 800px;
		padding: 20px 0;
		font-size: 14px;
	}

	h1 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.list-group {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.list-group-item {
		display: block;
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		text-decoration: none;
		color: #2c3e50;
		background: white;
		border: 1px solid #dee2e6;
		margin-top: -1px;
		transition: background 0.15s;
	}

	.list-group-item:first-child {
		border-radius: 0.375rem 0.375rem 0 0;
		margin-top: 0;
	}

	.list-group-item:last-child {
		border-radius: 0 0 0.375rem 0.375rem;
	}

	.list-group-item:hover {
		background: #f0f0f0;
	}

	.nav-link {
		margin-top: 1.5rem;
		font-size: 0.85rem;
	}

	.nav-link a {
		color: #2c3e50;
	}
</style>
