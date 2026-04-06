<script lang="ts">
	import GoogleBurndownChart from '$lib/components/GoogleBurndownChart.svelte';
	import EventTable from '$lib/components/EventTable.svelte';
	import {
		chartData,
		events,
		extraChartEvents,
		chartConfig
	} from '$lib/utils/experiment1Data';

	let highlightedEventId = $state<number | null>(null);

	function handleEventHover(id: number | null) {
		highlightedEventId = id;
	}
</script>

<GoogleBurndownChart
	{chartData}
	{events}
	{extraChartEvents}
	config={chartConfig}
	{highlightedEventId}
	onEventHover={handleEventHover}
/>
<EventTable {events} {highlightedEventId} onEventHover={handleEventHover} />
