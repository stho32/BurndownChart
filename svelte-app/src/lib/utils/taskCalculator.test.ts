import { describe, test, expect } from 'vitest';
import { calculateTasksRemaining } from './taskCalculator';

describe('calculateTasksRemaining', () => {
	test('calculates tasks remaining correctly', () => {
		const initialTasks = 10;
		const accomplishments = [
			{ month: '2024-03-01', tasks: 2 },
			{ month: '2024-04-01', tasks: 3 }
		];
		const labels = ['Mar 2024', 'Apr 2024', 'May 2024'];

		const result = calculateTasksRemaining(initialTasks, accomplishments, labels);
		expect(result).toEqual([10, 8, 5]);
	});

	test('handles no accomplishments correctly', () => {
		const initialTasks = 10;
		const accomplishments: { month: string; tasks: number }[] = [];
		const labels = ['Mar 2024', 'Apr 2024', 'May 2024'];

		const result = calculateTasksRemaining(initialTasks, accomplishments, labels);
		expect(result).toEqual([10]);
	});

	test('handles all tasks completed correctly', () => {
		const initialTasks = 10;
		const accomplishments = [
			{ month: '2024-03-01', tasks: 5 },
			{ month: '2024-04-01', tasks: 5 }
		];
		const labels = ['Mar 2024', 'Apr 2024', 'May 2024'];

		const result = calculateTasksRemaining(initialTasks, accomplishments, labels);
		expect(result).toEqual([10, 5, 0]);
	});

	test('stops returning values after a month with no accomplishments', () => {
		const initialTasks = 10;
		const accomplishments = [{ month: '2024-03-01', tasks: 2 }];
		const labels = ['Mar 2024', 'Apr 2024', 'May 2024'];

		const result = calculateTasksRemaining(initialTasks, accomplishments, labels);
		expect(result).toEqual([10, 8]);
	});
});
