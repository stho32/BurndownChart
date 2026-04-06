export function generateMonthLabels(startDate: string, endDate: string): string[] {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const labels: string[] = [];

	while (start <= end) {
		const month = start.toLocaleString('default', { month: 'short' });
		const year = start.getFullYear();
		labels.push(`${month} ${year}`);
		start.setMonth(start.getMonth() + 1);
	}

	return labels;
}
