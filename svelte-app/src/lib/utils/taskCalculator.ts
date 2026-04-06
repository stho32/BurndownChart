export interface Accomplishment {
	month: string;
	tasks: number;
}

export function calculateTasksRemaining(
	initialTasks: number,
	accomplishments: Accomplishment[],
	labels: string[]
): number[] {
	let remainingTasks = initialTasks;
	const tasksRemaining: number[] = [];

	for (const label of labels) {
		const [month, year] = label.split(' ');
		const labelDate = new Date(`${year}-${month}-01`);
		const accomplishment = accomplishments.find((acc) => {
			const accDate = new Date(acc.month);
			return accDate.getFullYear() === labelDate.getFullYear() && accDate.getMonth() === labelDate.getMonth();
		});

		if (accomplishment) {
			remainingTasks -= accomplishment.tasks;
			tasksRemaining.push(remainingTasks);
		} else {
			break;
		}
	}

	tasksRemaining.unshift(initialTasks);
	return tasksRemaining;
}
