<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';

	Chart.register(...registerables);

	interface Props {
		labels: string[];
		tasksRemaining: number[];
		trendlineData: number[];
	}

	let { labels, tasksRemaining, trendlineData }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | undefined;

	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Tasks Remaining',
						data: tasksRemaining.map((value) => Math.max(value, 0)),
						borderColor: 'rgba(75, 192, 192, 1)',
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
						fill: true,
						tension: 0.1
					},
					{
						label: 'Trendline',
						data: trendlineData,
						borderColor: 'rgba(255, 165, 0, 1)',
						borderWidth: 2,
						fill: false,
						pointRadius: 0,
						borderDash: [5, 5]
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Tasks Remaining'
						},
						min: 0
					},
					x: {
						title: {
							display: true,
							text: 'Months'
						}
					}
				}
			}
		});

		return () => {
			chart?.destroy();
		};
	});
</script>

<canvas bind:this={canvas}></canvas>
