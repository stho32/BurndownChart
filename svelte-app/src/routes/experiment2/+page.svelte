<script lang="ts">
	import BurndownChart from '$lib/components/BurndownChart.svelte';
	import { generateMonthLabels } from '$lib/utils/monthLabelGenerator';
	import { calculateTasksRemaining } from '$lib/utils/taskCalculator';
	import { calculateTrendline } from '$lib/utils/trendlineCalculator';

	const initialTasks = 35;
	const accomplishments = [
		{ month: '2024-03-01', tasks: 2 },
		{ month: '2024-04-01', tasks: 2 },
		{ month: '2024-05-01', tasks: 1 }
	];
	const startDate = '2024-03-01';
	const endDate = '2025-12-01';

	const labels = generateMonthLabels(startDate, endDate);
	const tasksRemaining = calculateTasksRemaining(initialTasks, accomplishments, labels);
	const trendlineData = calculateTrendline(tasksRemaining, labels.length);
</script>

<div class="container">
	<h1>My Study Progress</h1>
	<BurndownChart {labels} {tasksRemaining} {trendlineData} />
</div>
