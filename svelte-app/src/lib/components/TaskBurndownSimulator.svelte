<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import {
		runSingleSimulation,
		calculateProbabilityDistribution,
		type SimulationResult,
		type ProbabilityDistribution
	} from '$lib/utils/burndownSimulator';

	Chart.register(...registerables);

	let csvInput = $state('-1,0,-1,-2,1,0,-1');
	let remainingTasks = $state(4);
	let progress = $state(0);
	let isRunning = $state(false);
	let showResults = $state(false);

	let distribution: ProbabilityDistribution = $state({
		labels: [],
		probabilities: [],
		accumulated: []
	});
	let exampleSimulation: SimulationResult[] = $state([]);

	let probabilityCanvas: HTMLCanvasElement = $state(undefined as unknown as HTMLCanvasElement);
	let exampleCanvas: HTMLCanvasElement = $state(undefined as unknown as HTMLCanvasElement);
	let probabilityChart: Chart | undefined;
	let exampleChart: Chart | undefined;

	function parseCsvData(): number[] {
		return csvInput.split(',').map(Number);
	}

	function startSimulation() {
		const csvData = parseCsvData();
		const totalSimulations = 1000;
		const maxDays = 1000;
		const batchSize = 50;

		const completionDays: number[] = [];
		let firstExample: SimulationResult[] = [];
		let currentSimulation = 0;

		isRunning = true;
		showResults = false;
		progress = 0;

		function runBatch() {
			const batchEnd = Math.min(currentSimulation + batchSize, totalSimulations);

			for (let i = currentSimulation; i < batchEnd; i++) {
				const simulation = runSingleSimulation(csvData, remainingTasks, maxDays);
				const lastResult = simulation[simulation.length - 1];

				if (lastResult && lastResult.remainingTasks <= 0) {
					completionDays.push(simulation.length);
					if (firstExample.length === 0) {
						firstExample = simulation;
					}
				}
			}

			currentSimulation = batchEnd;
			progress = (currentSimulation / totalSimulations) * 100;

			if (currentSimulation < totalSimulations) {
				setTimeout(runBatch, 0);
			} else {
				distribution = calculateProbabilityDistribution(completionDays, totalSimulations);
				exampleSimulation = firstExample;
				isRunning = false;
				showResults = true;

				// Use tick-like delay so DOM updates before chart rendering
				setTimeout(() => {
					renderProbabilityChart();
					renderExampleChart();
				}, 0);
			}
		}

		setTimeout(runBatch, 0);
	}

	function renderProbabilityChart() {
		if (probabilityChart) {
			probabilityChart.destroy();
		}

		if (!probabilityCanvas || distribution.labels.length === 0) return;

		const ctx = probabilityCanvas.getContext('2d')!;
		probabilityChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: distribution.labels,
				datasets: [
					{
						label: 'Completion Probability',
						data: distribution.probabilities,
						backgroundColor: 'rgba(75, 192, 192, 0.6)',
						order: 2
					},
					{
						label: 'Accumulated Probability',
						data: distribution.accumulated,
						type: 'line',
						borderColor: 'rgba(255, 99, 132, 1)',
						borderWidth: 2,
						fill: false,
						order: 1
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Probability (%)'
						},
						max: 100
					},
					x: {
						title: {
							display: true,
							text: 'Business Days to Completion'
						}
					}
				},
				plugins: {
					title: {
						display: true,
						text: 'Task Burndown Simulation Results'
					},
					tooltip: {
						callbacks: {
							title: (tooltipItems) => {
								return `${tooltipItems[0].label} business days`;
							},
							label: (context) => {
								const datasetLabel = context.dataset.label || '';
								const value = context.parsed.y ?? 0;
								return `${datasetLabel}: ${value.toFixed(2)}%`;
							}
						}
					}
				}
			}
		});
	}

	function renderExampleChart() {
		if (exampleChart) {
			exampleChart.destroy();
		}

		if (!exampleCanvas || exampleSimulation.length === 0) return;

		const labels = exampleSimulation.map((data) => `Day ${data.day}`);
		const remaining = exampleSimulation.map((data) => data.remainingTasks);

		const ctx = exampleCanvas.getContext('2d')!;
		exampleChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Remaining Tasks',
						data: remaining,
						borderColor: 'rgba(75, 192, 192, 1)',
						tension: 0.1
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Remaining Tasks'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Days'
						}
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							label: (context) => {
								const idx = context.dataIndex;
								const sim = exampleSimulation[idx];
								return `Day ${sim.day}: ${sim.change} (Remaining: ${sim.remainingTasks})`;
							}
						}
					}
				}
			}
		});
	}

	onMount(() => {
		return () => {
			probabilityChart?.destroy();
			exampleChart?.destroy();
		};
	});
</script>

<div class="simulator">
	<div class="inputs">
		<div class="input-group">
			<label for="csvData">Daily task changes (comma-separated):</label>
			<textarea id="csvData" bind:value={csvInput} rows="3"
				placeholder="Enter CSV data for task burndown"></textarea>
		</div>
		<div class="input-group">
			<label for="remainingTasks">Initial remaining tasks:</label>
			<input id="remainingTasks" type="number" bind:value={remainingTasks}
				placeholder="Remaining tasks" />
		</div>
	</div>

	<button onclick={startSimulation} disabled={isRunning}>
		{isRunning ? 'Calculating...' : 'Calculate'}
	</button>

	<div class="progress-container">
		<div class="progress-bar" style="width: {progress}%"></div>
	</div>

	{#if showResults}
		<h2>Simulation Results</h2>
		<div class="chart-container">
			<canvas bind:this={probabilityCanvas}></canvas>
		</div>

		{#if exampleSimulation.length > 0}
			<h2>Example Simulation</h2>
			<div class="chart-container">
				<canvas bind:this={exampleCanvas}></canvas>
			</div>

			<table>
				<thead>
					<tr>
						<th>Day</th>
						<th>Change</th>
						<th>Remaining Tasks</th>
					</tr>
				</thead>
				<tbody>
					{#each exampleSimulation as row}
						<tr>
							<td>{row.day}</td>
							<td>{row.change}</td>
							<td>{row.remainingTasks}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	{/if}
</div>

<style>
	.simulator {
		max-width: 100%;
	}

	.inputs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	@media (max-width: 640px) {
		.inputs {
			grid-template-columns: 1fr;
		}
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	label {
		font-weight: 600;
		font-size: 0.9rem;
		color: #333;
	}

	textarea,
	input[type='number'] {
		padding: 0.5rem 0.75rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 0.95rem;
		font-family: inherit;
	}

	textarea:focus,
	input[type='number']:focus {
		outline: none;
		border-color: #2c3e50;
		box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.15);
	}

	button {
		background: #2c3e50;
		color: white;
		border: none;
		padding: 0.6rem 1.5rem;
		border-radius: 6px;
		font-size: 0.95rem;
		cursor: pointer;
		margin-bottom: 1rem;
		transition: background 0.15s;
	}

	button:hover:not(:disabled) {
		background: #34495e;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.progress-container {
		height: 24px;
		background: #e9ecef;
		border-radius: 6px;
		overflow: hidden;
		margin-bottom: 1.5rem;
	}

	.progress-bar {
		height: 100%;
		background: #2c3e50;
		transition: width 0.1s ease;
		border-radius: 6px;
	}

	h2 {
		margin: 1.5rem 0 1rem;
		color: #2c3e50;
	}

	.chart-container {
		background: white;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 1.5rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	th {
		background: #2c3e50;
		color: white;
		padding: 0.75rem 1rem;
		text-align: left;
		font-size: 0.9rem;
	}

	td {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #eee;
		font-size: 0.9rem;
	}

	tr:nth-child(even) {
		background: #f8f9fa;
	}

	tr:last-child td {
		border-bottom: none;
	}
</style>
