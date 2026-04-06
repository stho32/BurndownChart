export interface SimulationResult {
	day: number;
	change: number;
	remainingTasks: number;
}

export interface SimulationOutput {
	completionDays: number[];
	exampleSimulation: SimulationResult[];
}

export interface ProbabilityDistribution {
	labels: number[];
	probabilities: number[];
	accumulated: number[];
}

export function runSingleSimulation(
	csvData: number[],
	remainingTasks: number,
	maxDays: number = 1000
): SimulationResult[] {
	let tasks = remainingTasks;
	const results: SimulationResult[] = [];

	for (let day = 1; day <= maxDays && tasks > 0; day++) {
		const randomIndex = Math.floor(Math.random() * csvData.length);
		const change = csvData[randomIndex];
		tasks += change;
		tasks = Math.max(0, tasks);
		results.push({ day, change, remainingTasks: tasks });
	}

	return results;
}

export function runSimulations(
	csvData: number[],
	remainingTasks: number,
	count: number = 1000
): SimulationOutput {
	const completionDays: number[] = [];
	let exampleSimulation: SimulationResult[] = [];

	for (let i = 0; i < count; i++) {
		const simulation = runSingleSimulation(csvData, remainingTasks);
		const lastResult = simulation[simulation.length - 1];

		if (lastResult && lastResult.remainingTasks <= 0) {
			completionDays.push(simulation.length);
			if (exampleSimulation.length === 0) {
				exampleSimulation = simulation;
			}
		}
	}

	return { completionDays, exampleSimulation };
}

export function calculateProbabilityDistribution(
	completionDays: number[],
	totalSimulations: number
): ProbabilityDistribution {
	if (completionDays.length === 0) {
		return { labels: [], probabilities: [], accumulated: [] };
	}

	const sorted = [...completionDays].sort((a, b) => a - b);
	const minDays = sorted[0];
	const maxDays = sorted[sorted.length - 1];

	const counts = new Array(maxDays - minDays + 1).fill(0);
	sorted.forEach((days) => {
		counts[days - minDays]++;
	});

	const labels = Array.from({ length: maxDays - minDays + 1 }, (_, i) => i + minDays);
	const probabilities = counts.map((count) => (count / totalSimulations) * 100);
	const accumulated = probabilities.reduce<number[]>((acc, value) => {
		acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + value);
		return acc;
	}, []);

	return { labels, probabilities, accumulated };
}
