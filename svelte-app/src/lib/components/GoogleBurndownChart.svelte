<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChartDataRow, EventEntry } from '$lib/utils/experiment1Data';
	import { toGoogleDataArray } from '$lib/utils/experiment1Data';

	interface Props {
		chartData: ChartDataRow[];
		events: EventEntry[];
		extraChartEvents: { chartDate: Date; id: number; tooltip: string }[];
		config: {
			numTasks: number;
			startDate: Date;
			endDate: Date;
			pixelsPerTask: number;
			pixelsPerDay: number;
		};
		highlightedEventId: number | null;
		onEventHover: (id: number | null) => void;
	}

	let {
		chartData,
		events,
		extraChartEvents,
		config,
		highlightedEventId,
		onEventHover
	}: Props = $props();

	let chartDiv: HTMLDivElement;

	function addEventDot(
		svg: SVGSVGElement,
		cli: google.visualization.ChartLayoutInterface,
		chartArea: { top: number; height: number },
		date: Date,
		eventNumber: number,
		tooltip: string
	) {
		const x = cli.getXLocation(date as unknown as number);
		const y = chartArea.top - 10;

		const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		dot.setAttribute('cx', String(x));
		dot.setAttribute('cy', String(y));
		dot.setAttribute('r', '5');
		dot.setAttribute('fill', 'purple');
		dot.setAttribute('class', 'marker');
		dot.setAttribute('data-event', String(eventNumber));
		dot.setAttribute('title', tooltip);
		svg.appendChild(dot);

		const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute('x1', String(x));
		line.setAttribute('x2', String(x));
		line.setAttribute('y1', String(y));
		line.setAttribute('y2', String(chartArea.top));
		line.setAttribute('stroke', 'purple');
		line.setAttribute('stroke-width', '1');
		svg.appendChild(line);
	}

	function addWeekMarkers(
		svg: SVGSVGElement,
		cli: google.visualization.ChartLayoutInterface,
		chartArea: { top: number; height: number },
		startDate: Date,
		endDate: Date
	) {
		const firstMonday = new Date(startDate);
		while (firstMonday.getDay() !== 1) {
			firstMonday.setDate(firstMonday.getDate() + 1);
		}

		const currentMonday = new Date(firstMonday);
		while (currentMonday <= endDate) {
			const x = cli.getXLocation(currentMonday as unknown as number);
			const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', String(x));
			line.setAttribute('x2', String(x));
			line.setAttribute('y1', String(chartArea.top));
			line.setAttribute('y2', String(chartArea.top + chartArea.height));
			line.setAttribute('stroke', '#cccccc');
			line.setAttribute('stroke-width', '1');
			svg.appendChild(line);
			currentMonday.setDate(currentMonday.getDate() + 7);
		}
	}

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://www.gstatic.com/charts/loader.js';
		script.onload = () => {
			google.charts.load('current', { packages: ['corechart'] });
			google.charts.setOnLoadCallback(drawChart);
		};
		document.head.appendChild(script);

		function drawChart() {
			const numDays =
				(config.endDate.getTime() - config.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
			const chartWidth = numDays * config.pixelsPerDay;
			const chartHeight = config.numTasks * config.pixelsPerTask;

			chartDiv.style.width = `${chartWidth}px`;
			chartDiv.style.height = `${chartHeight}px`;

			const header: (string | { type: string; role: string })[] = [
				'Date',
				"What's next tasks remaining",
				'Total Tasks Remaining',
				{ type: 'string', role: 'annotation' }
			];
			const rows = toGoogleDataArray(chartData);
			const data = google.visualization.arrayToDataTable([header, ...rows]);

			const options = {
				title: 'Project Burndown Chart',
				hAxis: {
					title: 'Date',
					format: 'MMM dd',
					viewWindow: { min: config.startDate, max: config.endDate },
					gridlines: { color: 'transparent' },
					minorGridlines: { count: 1 }
				},
				vAxis: {
					title: 'Tasks',
					viewWindow: { min: 0, max: config.numTasks },
					gridlines: { count: config.numTasks + 1 },
					minorGridlines: { count: 0 }
				},
				legend: { position: 'top' as const },
				interpolateNulls: true,
				trendlines: {
					0: {
						type: 'linear' as const,
						color: 'green',
						lineWidth: 2,
						opacity: 0.3,
						showR2: true,
						visibleInLegend: true,
						labelInLegend: "Trendline: What's next tasks"
					},
					1: {
						type: 'linear' as const,
						color: 'blue',
						lineWidth: 2,
						opacity: 0.3,
						showR2: true,
						visibleInLegend: true,
						labelInLegend: 'Trendline: Total tasks'
					}
				},
				series: {
					0: { color: 'orange', labelInLegend: "What's next tasks remaining" },
					1: { color: 'blue', labelInLegend: 'Total tasks remaining' }
				},
				tooltip: { isHtml: true }
			};

			const chart = new google.visualization.LineChart(chartDiv);

			google.visualization.events.addListener(chart, 'ready', function () {
				const cli = chart.getChartLayoutInterface();
				const chartArea = cli.getChartAreaBoundingBox();
				const svg = chartDiv.getElementsByTagName('svg')[0];

				addWeekMarkers(svg, cli, chartArea, config.startDate, config.endDate);

				for (const extra of extraChartEvents) {
					addEventDot(svg, cli, chartArea, extra.chartDate, extra.id, extra.tooltip);
				}

				for (const event of events) {
					addEventDot(
						svg,
						cli,
						chartArea,
						event.chartDate,
						event.id,
						`${event.title}: ${event.details}`
					);
				}

				// Marker hover handlers
				svg.addEventListener('mouseover', (e) => {
					const target = e.target as SVGElement;
					if (target.classList.contains('marker')) {
						const eventId = parseInt(target.getAttribute('data-event') || '0');
						onEventHover(eventId);
					}
				});
				svg.addEventListener('mouseout', (e) => {
					const target = e.target as SVGElement;
					if (target.classList.contains('marker')) {
						onEventHover(null);
					}
				});
			});

			chart.draw(data, options);
		}

		return () => {
			// cleanup handled by Svelte
		};
	});
</script>

<div bind:this={chartDiv} id="chart"></div>
