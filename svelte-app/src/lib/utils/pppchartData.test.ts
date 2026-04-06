import { describe, test, expect } from 'vitest';
import { calculateDimensionAverages, documentation } from './pppchartData';
import type { Project } from './pppchartData';

describe('pppchartData', () => {
	test('calculateDimensionAverages returns correct averages', () => {
		const project: Project = {
			name: 'Test Project',
			people: {
				knowledge: 3,
				stability: 2,
				energy: 4,
				work_life_balance: 3
			},
			product: {
				functionality: 3,
				performance: 4,
				extensibility: 2,
				code_quality: 3,
				security: 4,
				maintainability: 2
			},
			process: {
				clarity: 3,
				autonomy: 2,
				quality: 4,
				efficiency: 3
			}
		};

		const averages = calculateDimensionAverages(project);

		expect(averages.people).toBe(3); // (3+2+4+3)/4 = 3
		expect(averages.product).toBe(3); // (3+4+2+3+4+2)/6 = 3
		expect(averages.process).toBe(3); // (3+2+4+3)/4 = 3
	});

	test('documentation has both en and de keys', () => {
		expect(documentation).toHaveProperty('en');
		expect(documentation).toHaveProperty('de');
	});

	test('documentation has correct number of dimensions (3 per language)', () => {
		expect(documentation.en.dimensions).toHaveLength(3);
		expect(documentation.de.dimensions).toHaveLength(3);
	});

	test('People dimension has 4 factors', () => {
		expect(documentation.en.dimensions[0].factors).toHaveLength(4);
		expect(documentation.de.dimensions[0].factors).toHaveLength(4);
	});

	test('Product dimension has 6 factors', () => {
		expect(documentation.en.dimensions[1].factors).toHaveLength(6);
		expect(documentation.de.dimensions[1].factors).toHaveLength(6);
	});

	test('Process dimension has 4 factors', () => {
		expect(documentation.en.dimensions[2].factors).toHaveLength(4);
		expect(documentation.de.dimensions[2].factors).toHaveLength(4);
	});
});
