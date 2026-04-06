import { describe, test, expect } from 'vitest';
import { chartData, events, extraChartEvents, chartConfig, toGoogleDataArray } from './experiment1Data';

describe('experiment1Data', () => {
	test('chartData has 19 rows', () => {
		expect(chartData).toHaveLength(19);
	});

	test('chartData first row is start annotation', () => {
		expect(chartData[0].annotation).toBe('start');
		expect(chartData[0].whatsNextRemaining).toBe(23);
	});

	test('chartData last row is deadline annotation', () => {
		expect(chartData[chartData.length - 1].annotation).toBe('deadline');
	});

	test('events has 5 entries', () => {
		expect(events).toHaveLength(5);
	});

	test('all events have required fields', () => {
		events.forEach((event) => {
			expect(event.id).toBeGreaterThan(0);
			expect(event.dateDisplay).toBeTruthy();
			expect(event.title).toBeTruthy();
			expect(event.details).toBeTruthy();
			expect(event.chartDate).toBeInstanceOf(Date);
		});
	});

	test('extraChartEvents has presentation event', () => {
		expect(extraChartEvents).toHaveLength(1);
		expect(extraChartEvents[0].tooltip).toBe("Jens's presentation");
	});

	test('chartConfig has correct task count', () => {
		expect(chartConfig.numTasks).toBe(40);
		expect(chartConfig.startDate).toBeInstanceOf(Date);
		expect(chartConfig.endDate).toBeInstanceOf(Date);
	});

	test('toGoogleDataArray converts correctly', () => {
		const result = toGoogleDataArray(chartData.slice(0, 2));
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual([chartData[0].date, 23, null, 'start']);
		expect(result[1]).toEqual([chartData[1].date, 15, null, null]);
	});
});
