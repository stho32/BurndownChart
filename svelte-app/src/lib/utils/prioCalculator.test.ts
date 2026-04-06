import { describe, test, expect } from 'vitest';
import { calculatePriority } from './prioCalculator';

describe('calculatePriority', () => {
	test('minimum values return 1', () => {
		const result = calculatePriority({
			nutzungen: 1,
			mitarbeiter: 1,
			extern: 1,
			workaround: 1,
			ersparnis: 1,
			zieleChecked: 0,
			entscheider: 1,
			risiko: 1
		});
		expect(result).toBe(1);
	});

	test('maximum values return high number', () => {
		const result = calculatePriority({
			nutzungen: 10,
			mitarbeiter: 10,
			extern: 10,
			workaround: 10,
			ersparnis: 10,
			zieleChecked: 4,
			entscheider: 5,
			risiko: 10
		});
		// 10*10*10*10*10*10*(10/10) + 2000 = 1000000 + 2000
		expect(result).toBe(1_000_000 + 2000);
	});

	test('entscheider bonus is added correctly', () => {
		const baseParams = {
			nutzungen: 1,
			mitarbeiter: 1,
			extern: 1,
			workaround: 1,
			ersparnis: 1,
			zieleChecked: 0,
			risiko: 1
		};

		expect(calculatePriority({ ...baseParams, entscheider: 1 })).toBe(1);
		expect(calculatePriority({ ...baseParams, entscheider: 2 })).toBe(501);
		expect(calculatePriority({ ...baseParams, entscheider: 3 })).toBe(1001);
		expect(calculatePriority({ ...baseParams, entscheider: 4 })).toBe(1001);
		expect(calculatePriority({ ...baseParams, entscheider: 5 })).toBe(2001);
	});

	test('ziele mapping works: 0 checked gives zielpunkte=1', () => {
		const result = calculatePriority({
			nutzungen: 1,
			mitarbeiter: 1,
			extern: 1,
			workaround: 1,
			ersparnis: 1,
			zieleChecked: 0,
			entscheider: 1,
			risiko: 1
		});
		expect(result).toBe(1);
	});

	test('ziele mapping works: 4 checked gives zielpunkte=10', () => {
		const result = calculatePriority({
			nutzungen: 1,
			mitarbeiter: 1,
			extern: 1,
			workaround: 1,
			ersparnis: 1,
			zieleChecked: 4,
			entscheider: 1,
			risiko: 1
		});
		expect(result).toBe(10);
	});

	test('ziele mapping: 2 checked gives zielpunkte=5', () => {
		const result = calculatePriority({
			nutzungen: 1,
			mitarbeiter: 1,
			extern: 1,
			workaround: 1,
			ersparnis: 1,
			zieleChecked: 2,
			entscheider: 1,
			risiko: 1
		});
		expect(result).toBe(5);
	});

	test('ziele mapping: 3 checked gives zielpunkte=7.5', () => {
		const result = calculatePriority({
			nutzungen: 1,
			mitarbeiter: 1,
			extern: 1,
			workaround: 1,
			ersparnis: 1,
			zieleChecked: 3,
			entscheider: 1,
			risiko: 1
		});
		expect(result).toBe(7.5);
	});

	test('risiko factor: risiko=1 gives multiplier=1', () => {
		const result = calculatePriority({
			nutzungen: 2,
			mitarbeiter: 2,
			extern: 2,
			workaround: 2,
			ersparnis: 2,
			zieleChecked: 0,
			entscheider: 1,
			risiko: 1
		});
		// 2*2*2*2*2*1*1 = 32
		expect(result).toBe(32);
	});

	test('risiko factor: risiko=5 gives multiplier=0.5', () => {
		const result = calculatePriority({
			nutzungen: 2,
			mitarbeiter: 2,
			extern: 2,
			workaround: 2,
			ersparnis: 2,
			zieleChecked: 0,
			entscheider: 1,
			risiko: 5
		});
		// 2*2*2*2*2*1*0.5 = 16
		expect(result).toBe(16);
	});
});
