import { describe, test, expect } from 'vitest';
import { parseInputData } from './experiment3Parser';

describe('experiment3Parser', () => {
	const validInput = `
start_date: 2024-01-01
end_date: 2024-01-31

data:
  2024-01-01: 100
  2024-01-02: 95
  2024-01-03: 90
`;

	test('parses valid input correctly', () => {
		const result = parseInputData(validInput);
		expect(result.fromDate).toBe('2024-01-01');
		expect(result.toDate).toBe('2024-01-31');
		expect(result.data).toHaveLength(3);
		expect(result.data[0]).toEqual({ date: '2024-01-01', value: 100 });
		expect(result.data[1]).toEqual({ date: '2024-01-02', value: 95 });
		expect(result.data[2]).toEqual({ date: '2024-01-03', value: 90 });
	});

	test('throws on missing start_date', () => {
		const input = `
end_date: 2024-01-31

data:
  2024-01-01: 100
`;
		expect(() => parseInputData(input)).toThrow('Invalid input format');
	});

	test('throws on missing end_date', () => {
		const input = `
start_date: 2024-01-01

data:
  2024-01-01: 100
`;
		expect(() => parseInputData(input)).toThrow('Invalid input format');
	});

	test('throws on missing data section', () => {
		const input = `
start_date: 2024-01-01
end_date: 2024-01-31
`;
		expect(() => parseInputData(input)).toThrow('Invalid input format');
	});

	test('parses bar annotations', () => {
		const input = `
start_date: 2024-01-01
end_date: 2024-01-31

bar:
  date: 2024-01-15
  label: "Milestone"
  color: #ff0000
  tooltip: "Important project milestone"

data:
  2024-01-01: 100
`;
		const result = parseInputData(input);
		expect(result.bar).toBeDefined();
		expect(result.bar!.date).toBe('2024-01-15');
		expect(result.bar!.label).toBe('Milestone');
		expect(result.bar!.color).toBe('#ff0000');
		expect(result.bar!.tooltip).toBe('Important project milestone');
	});

	test('parses point annotations', () => {
		const input = `
start_date: 2024-01-01
end_date: 2024-01-31

point:
  date: 2024-01-02
  value: 50
  label: "Idea"
  tooltip: "Bring in more manpower"

data:
  2024-01-01: 100
`;
		const result = parseInputData(input);
		expect(result.points).toHaveLength(1);
		expect(result.points[0].date).toBe('2024-01-02');
		expect(result.points[0].value).toBe(50);
		expect(result.points[0].label).toBe('Idea');
		expect(result.points[0].tooltip).toBe('Bring in more manpower');
	});

	test('parses chart dimensions', () => {
		const input = `
start_date: 2024-01-01
end_date: 2024-01-31
chart_width: 100%
chart_height: 400px

data:
  2024-01-01: 100
`;
		const result = parseInputData(input);
		expect(result.chartWidth).toBe('100%');
		expect(result.chartHeight).toBe('400px');
	});

	test('returns undefined for optional fields when not provided', () => {
		const result = parseInputData(validInput);
		expect(result.bar).toBeUndefined();
		expect(result.points).toHaveLength(0);
		expect(result.chartWidth).toBeUndefined();
		expect(result.chartHeight).toBeUndefined();
	});
});
