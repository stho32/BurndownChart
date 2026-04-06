<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import 'chartjs-adapter-date-fns';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import { parseInputData, type BarAnnotation, type PointAnnotation } from '$lib/utils/experiment3Parser';

	Chart.register(...registerables);
	Chart.register(annotationPlugin);

	const defaultInput = `start_date: 2024-01-01
end_date: 2024-01-31
chart_width: 100%
chart_height: 400px

bar:
  date: 2024-01-15
  label: "Milestone"
  color: #ff0000
  tooltip: "Important project milestone"

point:
  date: 2024-01-02
  value: 50
  label: "Idea"
  tooltip: "Bring in more manpower"

data:
  2024-01-01: 100
  2024-01-02: 95
  2024-01-03: 90`;

	let inputText = $state(defaultInput);
	let errorMessage = $state('');
	let throughputRows = $state<{ date: string; throughput: string }[]>([]);
	let chart: Chart | null = null;
	let canvasEl: HTMLCanvasElement;
	let chartContainer: HTMLDivElement;
	let resizeObserver: ResizeObserver | null = null;

	function daysBetween(startDate: string, endDate: string): number {
		const start = new Date(startDate + 'T00:00:00');
		const end = new Date(endDate + 'T00:00:00');
		return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
	}

	function addDays(dateStr: string, days: number): string {
		const date = new Date(dateStr + 'T00:00:00');
		date.setDate(date.getDate() + days);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function updateChart() {
		try {
			const { fromDate, toDate, data, bar, points, chartWidth, chartHeight } =
				parseInputData(inputText);

			if (chartWidth) chartContainer.style.width = chartWidth;
			if (chartHeight) chartContainer.style.height = chartHeight;

			const actualData = data.map((item) => item.value);

			const totalDays = daysBetween(fromDate, toDate) + 1;
			const initialWork = actualData[0];
			const dailyIdealBurndown = initialWork / (totalDays - 1);

			const idealData: number[] = [];
			const allDates: string[] = [];

			for (let i = 0; i < totalDays; i++) {
				const currentDate = addDays(fromDate, i);
				allDates.push(currentDate);
				idealData.push(Math.max(0, initialWork - dailyIdealBurndown * i));
			}

			const sortedActualData: (number | null)[] = allDates.map((date) => {
				const dataPoint = data.find((item) => item.date === date);
				return dataPoint ? dataPoint.value : null;
			});

			updateChartDisplay(allDates, idealData, sortedActualData, bar, points);
			updateThroughputTable(allDates, sortedActualData);
			errorMessage = '';

			if (resizeObserver) resizeObserver.disconnect();
			resizeObserver = new ResizeObserver(() => {
				if (chart) chart.resize();
			});
			resizeObserver.observe(chartContainer);
		} catch (error) {
			errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
			if (chart) {
				chart.destroy();
				chart = null;
			}
			throughputRows = [];
		}
	}

	function updateChartDisplay(
		dates: string[],
		idealData: number[],
		actualData: (number | null)[],
		bar: BarAnnotation | undefined,
		points: PointAnnotation[]
	) {
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		if (chart) {
			chart.destroy();
		}

		const chartData = {
			labels: dates,
			datasets: [
				{
					label: 'Ideal Burndown',
					data: idealData,
					borderColor: 'rgba(75, 192, 192, 1)',
					borderDash: [5, 5],
					fill: false
				},
				{
					label: 'Actual Burndown',
					data: actualData,
					borderColor: 'rgba(255, 99, 132, 1)',
					fill: false
				},
				{
					label: 'Points',
					data: points.map((p) => ({ x: p.date, y: p.value })),
					pointBackgroundColor: 'rgba(255, 206, 86, 1)',
					pointBorderColor: 'rgba(255, 206, 86, 1)',
					pointRadius: 6,
					pointHoverRadius: 8,
					type: 'scatter' as const
				}
			]
		};

		const annotations: Record<string, object> = {};

		if (bar) {
			annotations['barLine'] = {
				type: 'line',
				mode: 'vertical',
				scaleID: 'x',
				value: bar.date,
				borderColor: bar.color,
				borderWidth: 2,
				label: {
					content: bar.label,
					enabled: true,
					position: 'top'
				},
				enter: ({ element }: { element: { options: { borderWidth: number } } }) => {
					element.options.borderWidth = 4;
				},
				leave: ({ element }: { element: { options: { borderWidth: number } } }) => {
					element.options.borderWidth = 2;
				}
			};
		}

		points.forEach((point, index) => {
			annotations[`point${index}`] = {
				type: 'point',
				xValue: point.date,
				yValue: point.value,
				backgroundColor: 'rgba(255, 206, 86, 1)',
				radius: 6,
				borderWidth: 2,
				borderColor: 'black',
				label: {
					content: point.label,
					enabled: false
				},
				enter: ({
					element
				}: {
					element: { options: { radius: number; borderWidth: number } };
				}) => {
					element.options.radius = 8;
					element.options.borderWidth = 3;
				},
				leave: ({
					element
				}: {
					element: { options: { radius: number; borderWidth: number } };
				}) => {
					element.options.radius = 6;
					element.options.borderWidth = 2;
				}
			};
		});

		const config = {
			type: 'line' as const,
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'time' as const,
						time: {
							unit: 'day' as const,
							displayFormats: {
								day: 'yyyy-MM-dd'
							}
						},
						title: {
							display: true,
							text: 'Date'
						}
					},
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Remaining Work'
						},
						ticks: {
							stepSize: 10
						}
					}
				},
				plugins: {
					title: {
						display: true,
						text: 'Sprint Burndown Chart'
					},
					tooltip: {
						callbacks: {
							label: function (context: {
								dataset: { label: string };
								raw: { x: string; y: number };
								formattedValue: string;
							}) {
								if (context.dataset.label === 'Points') {
									const point = points.find(
										(p) => p.date === context.raw.x && p.value === context.raw.y
									);
									if (point) {
										return `${point.label}: ${point.tooltip}`;
									}
								}
								return `${context.dataset.label}: ${context.formattedValue}`;
							}
						}
					},
					annotation: {
						annotations
					}
				},
				onHover: (
					event: { native: { target: HTMLElement } },
					activeElements: Array<{
						datasetIndex: number;
						element: {
							x: number;
							$context: { raw: { x: string; y: number } };
						};
					}>
				) => {
					if (activeElements.length > 0) {
						const element = activeElements[0];
						if (element.datasetIndex === 2) {
							const point = points.find(
								(p) =>
									p.date === element.element.$context.raw.x &&
									p.value === element.element.$context.raw.y
							);
							if (point) {
								event.native.target.style.cursor = 'pointer';
								if (chart) chart.canvas.title = `${point.label}: ${point.tooltip}`;
							}
						} else if (
							bar &&
							chart &&
							element.element.x === chart.scales['x'].getPixelForValue(new Date(bar.date).getTime())
						) {
							event.native.target.style.cursor = 'pointer';
							chart.canvas.title = `${bar.label}: ${bar.tooltip}`;
						} else {
							event.native.target.style.cursor = 'default';
							if (chart) chart.canvas.title = '';
						}
					} else {
						event.native.target.style.cursor = 'default';
						if (chart) chart.canvas.title = '';
					}
				}
			}
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		chart = new Chart(ctx, config as any);
	}

	function updateThroughputTable(dates: string[], actualData: (number | null)[]) {
		const rows: { date: string; throughput: string }[] = [];
		for (let i = 1; i < dates.length; i++) {
			if (actualData[i] !== null && actualData[i - 1] !== null) {
				const throughput = actualData[i - 1]! - actualData[i]!;
				rows.push({ date: dates[i], throughput: throughput.toFixed(2) });
			}
		}
		throughputRows = rows;
	}

	onMount(() => {
		updateChart();
	});

	onDestroy(() => {
		if (resizeObserver) resizeObserver.disconnect();
		if (chart) {
			chart.destroy();
			chart = null;
		}
	});

	function handleInput() {
		updateChart();
	}
</script>

<div class="burndown-generator">
	<h1>Burndown Chart Generator</h1>

	<div class="layout">
		<div class="section">
			<h2>Burndown Chart</h2>
			<div class="chart-container" bind:this={chartContainer}>
				<canvas bind:this={canvasEl}></canvas>
			</div>
		</div>

		<div class="section">
			<h2>Daily Throughput</h2>
			<table class="throughput-table">
				<thead>
					<tr>
						<th>Date</th>
						<th>Throughput</th>
					</tr>
				</thead>
				<tbody>
					{#each throughputRows as row}
						<tr>
							<td>{row.date}</td>
							<td>{row.throughput}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="section">
			<h2>Input Data</h2>
			<textarea
				class="input-area"
				rows="15"
				bind:value={inputText}
				oninput={handleInput}
			></textarea>
			{#if errorMessage}
				<div class="error-message">{errorMessage}</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.burndown-generator {
		width: 100%;
	}

	h1 {
		margin-bottom: 1.5rem;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.layout {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section {
		width: 100%;
	}

	.chart-container {
		position: relative;
		height: 400px;
		width: 100%;
	}

	.input-area {
		width: 100%;
		font-family: monospace;
		font-size: 0.9rem;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
		resize: vertical;
	}

	.error-message {
		color: #dc3545;
		margin-top: 0.5rem;
	}

	.throughput-table {
		width: 100%;
		border-collapse: collapse;
	}

	.throughput-table th,
	.throughput-table td {
		padding: 0.5rem 0.75rem;
		text-align: left;
		border-bottom: 1px solid #dee2e6;
	}

	.throughput-table thead th {
		background: #f8f9fa;
		font-weight: 600;
		border-bottom: 2px solid #dee2e6;
	}

	.throughput-table tbody tr:nth-child(odd) {
		background: #f8f9fa;
	}

	.throughput-table tbody tr:hover {
		background: #e9ecef;
	}
</style>
