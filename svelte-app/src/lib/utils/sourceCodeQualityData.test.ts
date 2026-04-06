import { describe, test, expect } from 'vitest';
import {
	extractComponentData,
	documentation,
	labels,
	type ComponentData
} from './sourceCodeQualityData';

describe('sourceCodeQualityData', () => {
	test('extractComponentData returns array of length 18', () => {
		const component: ComponentData = {
			name: 'Test',
			ui: { design: 3, consistency: 2, accessibility: 4 },
			ux: { intuitiveness: 3, responsiveness: 4, error_handling: 2 },
			architecture: { modularity: 3, scalability: 2, patterns: 4 },
			code_cleanliness: { readability: 3, consistency: 4, documentation: 2 },
			code_extensibility: { extensibility: 3, maintainability: 2, reusability: 4 },
			performance: { runtime: 3, memory_usage: 4, load_time: 2 }
		};

		const result = extractComponentData(component);
		expect(result).toHaveLength(18);
	});

	test('extractComponentData returns values in correct order matching labels', () => {
		const component: ComponentData = {
			name: 'Test',
			ui: { design: 1, consistency: 2, accessibility: 3 },
			ux: { intuitiveness: 4, responsiveness: 0, error_handling: 1 },
			architecture: { modularity: 2, scalability: 3, patterns: 4 },
			code_cleanliness: { readability: 0, consistency: 1, documentation: 2 },
			code_extensibility: { extensibility: 3, maintainability: 4, reusability: 0 },
			performance: { runtime: 1, memory_usage: 2, load_time: 3 }
		};

		const result = extractComponentData(component);
		expect(result).toEqual([1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3]);
	});

	test('documentation has correct number of dimensions (6)', () => {
		expect(documentation.en.dimensions).toHaveLength(6);
	});

	test('documentation dimensions have correct names', () => {
		const names = documentation.en.dimensions.map((d) => d.name);
		expect(names).toEqual([
			'UI',
			'UX',
			'Architecture',
			'Code Cleanliness',
			'Code Extensibility',
			'Performance'
		]);
	});

	test('each dimension has 3 factors', () => {
		documentation.en.dimensions.forEach((dim) => {
			expect(dim.factors).toHaveLength(3);
		});
	});

	test('each factor has 5 levels (0-4)', () => {
		documentation.en.dimensions.forEach((dim) => {
			dim.factors.forEach((factor) => {
				expect(factor.levels).toHaveLength(5);
			});
		});
	});

	test('labels array has 18 entries', () => {
		expect(labels).toHaveLength(18);
	});

	test('labels start with UI and end with Load Time', () => {
		expect(labels[0]).toBe('UI Design');
		expect(labels[17]).toBe('Load Time');
	});
});
