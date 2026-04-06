import { describe, test, expect } from 'vitest';
import {
	runSingleSimulation,
	runSimulations,
	calculateProbabilityDistribution
} from './burndownSimulator';

describe('runSingleSimulation', () => {
	test('completes when all changes are negative', () => {
		const csvData = [-1, -2, -1];
		const result = runSingleSimulation(csvData, 5);

		const lastResult = result[result.length - 1];
		expect(lastResult.remainingTasks).toBe(0);
	});

	test('respects maxDays limit', () => {
		const csvData = [0, 0, 0];
		const result = runSingleSimulation(csvData, 10, 50);

		expect(result.length).toBeLessThanOrEqual(50);
	});

	test('never goes below 0 remaining tasks', () => {
		const csvData = [-10, -20, -5];
		const result = runSingleSimulation(csvData, 3);

		result.forEach((r) => {
			expect(r.remainingTasks).toBeGreaterThanOrEqual(0);
		});
	});

	test('tracks day numbers correctly', () => {
		const csvData = [-1];
		const result = runSingleSimulation(csvData, 3);

		result.forEach((r, i) => {
			expect(r.day).toBe(i + 1);
		});
	});
});

describe('runSimulations', () => {
	test('returns correct number of completion days for guaranteed completion', () => {
		const csvData = [-1, -2, -1];
		const result = runSimulations(csvData, 3, 100);

		// All simulations should complete since all changes are negative
		expect(result.completionDays.length).toBe(100);
	});

	test('returns an example simulation', () => {
		const csvData = [-1, -2, -1];
		const result = runSimulations(csvData, 5, 10);

		expect(result.exampleSimulation.length).toBeGreaterThan(0);
		const lastStep = result.exampleSimulation[result.exampleSimulation.length - 1];
		expect(lastStep.remainingTasks).toBe(0);
	});

	test('does not count simulations that did not complete', () => {
		const csvData = [0, 0, 0];
		const result = runSimulations(csvData, 10, 10);

		expect(result.completionDays.length).toBe(0);
	});
});

describe('calculateProbabilityDistribution', () => {
	test('accumulated reaches approximately 100% for complete data', () => {
		const completionDays = [3, 4, 4, 5, 5, 5, 6, 6, 7, 8];
		const totalSimulations = 10;
		const result = calculateProbabilityDistribution(completionDays, totalSimulations);

		const lastAccumulated = result.accumulated[result.accumulated.length - 1];
		expect(lastAccumulated).toBeCloseTo(100, 1);
	});

	test('labels are contiguous from min to max', () => {
		const completionDays = [3, 5, 7, 10];
		const totalSimulations = 4;
		const result = calculateProbabilityDistribution(completionDays, totalSimulations);

		expect(result.labels[0]).toBe(3);
		expect(result.labels[result.labels.length - 1]).toBe(10);
		expect(result.labels.length).toBe(10 - 3 + 1);

		for (let i = 1; i < result.labels.length; i++) {
			expect(result.labels[i]).toBe(result.labels[i - 1] + 1);
		}
	});

	test('handles empty completionDays', () => {
		const result = calculateProbabilityDistribution([], 10);

		expect(result.labels).toEqual([]);
		expect(result.probabilities).toEqual([]);
		expect(result.accumulated).toEqual([]);
	});

	test('probabilities sum to correct total', () => {
		const completionDays = [2, 3, 3, 4, 4, 4, 5, 5, 6, 7];
		const totalSimulations = 10;
		const result = calculateProbabilityDistribution(completionDays, totalSimulations);

		const totalProbability = result.probabilities.reduce((sum, p) => sum + p, 0);
		expect(totalProbability).toBeCloseTo(100, 1);
	});
});
