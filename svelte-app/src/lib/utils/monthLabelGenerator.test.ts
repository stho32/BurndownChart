import { describe, test, expect } from 'vitest';
import { generateMonthLabels } from './monthLabelGenerator';

describe('generateMonthLabels', () => {
	test('generates labels for a date range', () => {
		const labels = generateMonthLabels('2024-03-01', '2024-06-01');
		expect(labels).toHaveLength(4);
		expect(labels[0]).toContain('2024');
		expect(labels[3]).toContain('2024');
	});

	test('generates single label when start equals end', () => {
		const labels = generateMonthLabels('2024-03-01', '2024-03-01');
		expect(labels).toHaveLength(1);
	});

	test('generates labels spanning year boundary', () => {
		const labels = generateMonthLabels('2024-11-01', '2025-02-01');
		expect(labels).toHaveLength(4);
		expect(labels[0]).toContain('2024');
		expect(labels[3]).toContain('2025');
	});

	test('returns empty array when start is after end', () => {
		const labels = generateMonthLabels('2025-01-01', '2024-01-01');
		expect(labels).toHaveLength(0);
	});
});
