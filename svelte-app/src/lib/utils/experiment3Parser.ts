export interface DataPoint {
	date: string;
	value: number;
}

export interface BarAnnotation {
	date: string;
	label: string;
	color: string;
	tooltip: string;
}

export interface PointAnnotation {
	date: string;
	value: number;
	label: string;
	tooltip: string;
}

export interface ParsedInput {
	fromDate: string;
	toDate: string;
	data: DataPoint[];
	bar: BarAnnotation | undefined;
	points: PointAnnotation[];
	chartWidth: string | undefined;
	chartHeight: string | undefined;
}

export function parseInputData(input: string): ParsedInput {
	const lines = input.trim().split('\n');
	let fromDate: string | undefined;
	let toDate: string | undefined;
	let bar: BarAnnotation | undefined;
	let chartWidth: string | undefined;
	let chartHeight: string | undefined;
	const data: DataPoint[] = [];
	const points: PointAnnotation[] = [];
	const pointFieldCounts: number[] = [];
	let currentSection = '';

	for (const line of lines) {
		const trimmedLine = line.trim();
		if (trimmedLine.endsWith(':')) {
			currentSection = trimmedLine.slice(0, -1);
			continue;
		}

		if (trimmedLine === '') continue;

		const colonIndex = trimmedLine.indexOf(':');
		if (colonIndex === -1) continue;

		const key = trimmedLine.slice(0, colonIndex).trim();
		const value = trimmedLine.slice(colonIndex + 1).trim();

		switch (currentSection) {
			case '':
				if (key === 'start_date') fromDate = value;
				if (key === 'end_date') toDate = value;
				if (key === 'chart_width') chartWidth = value;
				if (key === 'chart_height') chartHeight = value;
				break;
			case 'bar':
				if (!bar) bar = { date: '', label: '', color: '', tooltip: '' };
				bar[key as keyof BarAnnotation] = value.replace(/"/g, '');
				break;
			case 'point':
				if (!points.length || pointFieldCounts[pointFieldCounts.length - 1] === 4) {
					points.push({ date: '', value: 0, label: '', tooltip: '' });
					pointFieldCounts.push(0);
				}
				if (key === 'value') {
					points[points.length - 1].value = parseFloat(value);
				} else {
					(points[points.length - 1] as unknown as Record<string, string | number>)[key] =
						value.replace(/"/g, '');
				}
				pointFieldCounts[pointFieldCounts.length - 1]++;
				break;
			case 'data':
				data.push({ date: key, value: parseFloat(value) });
				break;
		}
	}

	if (!fromDate || !toDate || data.length === 0) {
		throw new Error('Invalid input format');
	}

	return { fromDate, toDate, data, bar, points, chartWidth, chartHeight };
}
