export function calculateTrendline(data: number[], length: number): number[] {
	const n = data.length;

	if (n <= 1) {
		const value = n === 1 ? data[0] : 0;
		return Array.from({ length }, () => Math.max(value, 0));
	}

	const sumX = (n * (n - 1)) / 2;
	const sumY = data.reduce((a, b) => a + b, 0);
	const sumXY = data.reduce((sum, y, x) => sum + x * y, 0);
	const sumX2 = ((n - 1) * n * (2 * n - 1)) / 6;

	const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	return Array.from({ length }, (_, x) => Math.max(slope * x + intercept, 0));
}
