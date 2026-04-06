<script lang="ts">
	import type { EventEntry } from '$lib/utils/experiment1Data';

	interface Props {
		events: EventEntry[];
		highlightedEventId: number | null;
		onEventHover: (id: number | null) => void;
	}

	let { events, highlightedEventId, onEventHover }: Props = $props();
</script>

<table class="event-table">
	<thead>
		<tr>
			<th>#</th>
			<th>Date</th>
			<th>Event</th>
			<th>Details</th>
		</tr>
	</thead>
	<tbody>
		{#each events as event}
			<tr
				class:highlight={highlightedEventId === event.id}
				onmouseenter={() => onEventHover(event.id)}
				onmouseleave={() => onEventHover(null)}
			>
				<td>{event.id}</td>
				<td>{event.dateDisplay}</td>
				<td>{event.title}</td>
				<td>{event.details}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.event-table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 20px;
	}

	.event-table th,
	.event-table td {
		border: 1px solid #ddd;
		padding: 8px;
	}

	.event-table tr:hover,
	.highlight {
		background-color: #ffeb3b !important;
	}
</style>
