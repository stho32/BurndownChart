import { describe, test, expect } from 'vitest';
import { calculateEntwicklungsbedarf } from './entwicklungsbedarfCalculator';

describe('calculateEntwicklungsbedarf', () => {
	test('minimum values calculation', () => {
		const result = calculateEntwicklungsbedarf({
			effizienzsteigerung: 0,
			benutzerfreundlichkeit: 1,
			performance: 2,
			fehlerhaeufigkeit: 1,
			fehleraufwand: 1,
			deadEnd: 1,
			verdientesGeld: 10
		});
		// effizienzFaktor = min(ceil(0/16), 10) = 0
		// performanceFaktor = min(ceil((2-1)/3), 10) = 1
		// score = 0 * 1 * 1 * 1 * 1 * 1 * (11-10) = 0
		expect(result.score).toBe(0);
		expect(result.factors).toEqual([0, 1, 1, 1, 1, 1, 10]);
	});

	test('effizienz hours to factor conversion: 0 hours gives 0', () => {
		const result = calculateEntwicklungsbedarf({
			effizienzsteigerung: 0,
			benutzerfreundlichkeit: 1,
			performance: 2,
			fehlerhaeufigkeit: 1,
			fehleraufwand: 1,
			deadEnd: 1,
			verdientesGeld: 1
		});
		expect(result.factors[0]).toBe(0);
	});

	test('effizienz hours to factor conversion: 16 hours gives 1', () => {
		const result = calculateEntwicklungsbedarf({
			effizienzsteigerung: 16,
			benutzerfreundlichkeit: 1,
			performance: 2,
			fehlerhaeufigkeit: 1,
			fehleraufwand: 1,
			deadEnd: 1,
			verdientesGeld: 1
		});
		expect(result.factors[0]).toBe(1);
	});

	test('effizienz hours to factor conversion: 160 hours gives 10', () => {
		const result = calculateEntwicklungsbedarf({
			effizienzsteigerung: 160,
			benutzerfreundlichkeit: 1,
			performance: 2,
			fehlerhaeufigkeit: 1,
			fehleraufwand: 1,
			deadEnd: 1,
			verdientesGeld: 1
		});
		expect(result.factors[0]).toBe(10);
	});

	test('performance seconds to factor conversion: 2 seconds gives 1', () => {
		const result = calculateEntwicklungsbedarf({
			effizienzsteigerung: 16,
			benutzerfreundlichkeit: 1,
			performance: 2,
			fehlerhaeufigkeit: 1,
			fehleraufwand: 1,
			deadEnd: 1,
			verdientesGeld: 1
		});
		// performanceFaktor = ceil((2-1)/3) = ceil(0.333) = 1
		expect(result.factors[2]).toBe(1);
	});

	test('performance seconds to factor conversion: 30 seconds gives 10', () => {
		const result = calculateEntwicklungsbedarf({
			effizienzsteigerung: 16,
			benutzerfreundlichkeit: 1,
			performance: 30,
			fehlerhaeufigkeit: 1,
			fehleraufwand: 1,
			deadEnd: 1,
			verdientesGeld: 1
		});
		// performanceFaktor = min(ceil((30-1)/3), 10) = min(ceil(9.667), 10) = min(10, 10) = 10
		expect(result.factors[2]).toBe(10);
	});

	test('score includes inverted verdientesGeld (11 - value)', () => {
		const resultLow = calculateEntwicklungsbedarf({
			effizienzsteigerung: 16,
			benutzerfreundlichkeit: 1,
			performance: 4,
			fehlerhaeufigkeit: 1,
			fehleraufwand: 1,
			deadEnd: 1,
			verdientesGeld: 1
		});

		const resultHigh = calculateEntwicklungsbedarf({
			effizienzsteigerung: 16,
			benutzerfreundlichkeit: 1,
			performance: 4,
			fehlerhaeufigkeit: 1,
			fehleraufwand: 1,
			deadEnd: 1,
			verdientesGeld: 10
		});

		// Low verdientesGeld (1) -> factor = 11 - 1 = 10
		// High verdientesGeld (10) -> factor = 11 - 10 = 1
		expect(resultLow.score).toBe(resultHigh.score * 10);
	});

	test('all high values produce large score', () => {
		const result = calculateEntwicklungsbedarf({
			effizienzsteigerung: 160,
			benutzerfreundlichkeit: 10,
			performance: 30,
			fehlerhaeufigkeit: 10,
			fehleraufwand: 10,
			deadEnd: 10,
			verdientesGeld: 1
		});
		// 10 * 10 * 10 * 10 * 10 * 10 * 10 = 10_000_000
		expect(result.score).toBe(10_000_000);
	});
});
