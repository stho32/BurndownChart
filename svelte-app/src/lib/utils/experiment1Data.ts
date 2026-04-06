export interface ChartDataRow {
	date: Date;
	whatsNextRemaining: number | null;
	totalRemaining: number | null;
	annotation: string | null;
}

export interface EventEntry {
	id: number;
	dateDisplay: string;
	title: string;
	details: string;
	chartDate: Date;
}

export const chartConfig = {
	numTasks: 40,
	startDate: new Date(2024, 5, 3),
	endDate: new Date(2024, 6, 25),
	pixelsPerTask: 10,
	pixelsPerDay: 20
};

export const chartData: ChartDataRow[] = [
	{ date: new Date(2024, 5, 3), whatsNextRemaining: 23, totalRemaining: null, annotation: 'start' },
	{ date: new Date(2024, 5, 4), whatsNextRemaining: 15, totalRemaining: null, annotation: null },
	{ date: new Date(2024, 5, 5), whatsNextRemaining: 20, totalRemaining: null, annotation: null },
	{ date: new Date(2024, 5, 6), whatsNextRemaining: 17, totalRemaining: null, annotation: null },
	{ date: new Date(2024, 5, 7), whatsNextRemaining: 18, totalRemaining: 36, annotation: null },
	{ date: new Date(2024, 5, 8), whatsNextRemaining: 18, totalRemaining: 36, annotation: null },
	{ date: new Date(2024, 5, 9), whatsNextRemaining: 18, totalRemaining: 36, annotation: null },
	{ date: new Date(2024, 5, 10), whatsNextRemaining: 18, totalRemaining: 36, annotation: null },
	{ date: new Date(2024, 5, 11), whatsNextRemaining: 21, totalRemaining: 39, annotation: null },
	{ date: new Date(2024, 5, 12), whatsNextRemaining: 18, totalRemaining: 35, annotation: null },
	{ date: new Date(2024, 5, 13), whatsNextRemaining: 16, totalRemaining: 33, annotation: null },
	{ date: new Date(2024, 5, 14), whatsNextRemaining: 15, totalRemaining: 37, annotation: null },
	{ date: new Date(2024, 5, 15), whatsNextRemaining: 15, totalRemaining: 37, annotation: null },
	{ date: new Date(2024, 5, 16), whatsNextRemaining: 15, totalRemaining: 37, annotation: null },
	{ date: new Date(2024, 5, 17), whatsNextRemaining: null, totalRemaining: null, annotation: null },
	{ date: new Date(2024, 5, 18), whatsNextRemaining: null, totalRemaining: null, annotation: null },
	{ date: new Date(2024, 5, 19), whatsNextRemaining: null, totalRemaining: null, annotation: null },
	{ date: new Date(2024, 5, 20), whatsNextRemaining: null, totalRemaining: null, annotation: null },
	{ date: new Date(2024, 5, 21), whatsNextRemaining: null, totalRemaining: null, annotation: 'deadline' }
];

export const events: EventEntry[] = [
	{
		id: 1,
		dateDisplay: '7.6.2024',
		title: 'Demo with Fabian and Pascal',
		details: 'Complained about security problems and timeline concerns.',
		chartDate: new Date(2024, 5, 7)
	},
	{
		id: 2,
		dateDisplay: '7.6.2024',
		title: 'Found Critical Security Bug',
		details: 'Identified the "session sharing bug".',
		chartDate: new Date(2024, 5, 7)
	},
	{
		id: 3,
		dateDisplay: '9.6.2024 - 13.6.2024',
		title: 'Work with Sushrut and Santosh',
		details: 'Fixed 2 major security bugs.',
		chartDate: new Date(2024, 5, 9)
	},
	{
		id: 4,
		dateDisplay: '14.6.2024',
		title: 'Internal Demo & Testing Workshop',
		details: 'Added 6 new tasks after security testing and workshop.',
		chartDate: new Date(2024, 5, 14)
	},
	{
		id: 5,
		dateDisplay: '9.6.2024 - 14.6.2024',
		title: 'Observation: Insufficient Burndown Speed',
		details:
			'Testing in the team is underdeveloped. Increased manual testing duration and quality issues, leading to rework. Plan to add a test automation person to the team.',
		chartDate: new Date(2024, 5, 9)
	}
];

export const extraChartEvents = [
	{
		chartDate: new Date(2024, 6, 16),
		id: 0,
		tooltip: "Jens's presentation"
	}
];

export function toGoogleDataArray(data: ChartDataRow[]): (Date | number | string | null)[][] {
	return data.map((row) => [row.date, row.whatsNextRemaining, row.totalRemaining, row.annotation]);
}
