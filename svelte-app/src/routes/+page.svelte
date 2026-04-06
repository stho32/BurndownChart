<script lang="ts">
	import { base } from '$app/paths';
</script>

<h1>BurndownChart</h1>
<p class="subtitle">A burndown chart for your project data with forecasting and annotations</p>

<div class="cards">
	<a href="{base}/experiment1/" class="card">
		<h2>Experiment 1</h2>
		<p>Project Burndown Chart with Google Charts, event annotations and interactive event table.</p>
	</a>
	<a href="{base}/experiment2/" class="card">
		<h2>Experiment 2</h2>
		<p>Monthly Burndown Chart with Chart.js, task tracking and linear regression trendline.</p>
	</a>
	<a href="{base}/experiment3/" class="card">
		<h2>Experiment 3</h2>
		<p>Burndown Chart Generator with text-based input, annotation support and daily throughput table.</p>
	</a>
	<a href="{base}/source-code-quality/" class="card">
		<h2>Source Code Quality</h2>
		<p>Radar chart for visualizing source code quality across 6 dimensions with 18 data points per component.</p>
	</a>
	<a href="{base}/task-burndown-simulator/" class="card">
		<h2>Task Burndown Simulator</h2>
		<p>Monte Carlo simulation for task completion forecasting with probability distribution charts.</p>
	</a>
	<a href="{base}/pppchart/" class="card">
		<h2>Project Quality</h2>
		<p>People/Product/Process radar chart for assessing project quality with bilingual documentation.</p>
	</a>
	<a href="{base}/priohelper/" class="card">
		<h2>Priohelper</h2>
		<p>Priorisierungshelfer und Entwicklungsbedarf-Helper mit Radar-Charts und URL-State.</p>
	</a>
</div>

<style>
	h1 {
		margin-bottom: 0.25rem;
	}

	.subtitle {
		color: #666;
		margin-bottom: 2rem;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.card {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.15s, transform 0.15s;
	}

	.card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(-2px);
	}

	.card h2 {
		margin: 0 0 0.5rem;
		color: #2c3e50;
	}

	.card p {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
		line-height: 1.4;
	}
</style>
