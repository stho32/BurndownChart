import { describe, test, expect } from 'vitest';
import { calculateTrendline } from './trendlineCalculator';

describe('calculateTrendline', () => {
	test('calculates a declining trendline for decreasing data', () => {
		const data = [10, 8, 5];
		const trendline = calculateTrendline(data, 6);

		expect(trendline).toHaveLength(6);
		// Trendline should start near the first data point (linear regression intercept)
		expect(trendline[0]).toBeCloseTo(10.17, 1);
		// Trendline should decline
		expect(trendline[1]).toBeLessThan(trendline[0]);
		// Values should never go below 0
		trendline.forEach((v) => expect(v).toBeGreaterThanOrEqual(0));
	});

	test('handles single data point', () => {
		const data = [10];
		const trendline = calculateTrendline(data, 5);

		expect(trendline).toHaveLength(5);
		trendline.forEach((v) => expect(v).toBeCloseTo(10, 0));
	});

	test('clamps negative values to zero', () => {
		const data = [10, 5];
		const trendline = calculateTrendline(data, 10);

		trendline.forEach((v) => expect(v).toBeGreaterThanOrEqual(0));
	});

	test('handles flat data (no change)', () => {
		const data = [5, 5, 5];
		const trendline = calculateTrendline(data, 5);

		expect(trendline).toHaveLength(5);
		trendline.forEach((v) => expect(v).toBeCloseTo(5, 0));
	});
});
