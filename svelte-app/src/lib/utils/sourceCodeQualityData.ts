export interface ComponentFactor {
	[key: string]: number;
}

export interface ComponentData {
	name: string;
	color?: string;
	ui: {
		design: number;
		consistency: number;
		accessibility: number;
	};
	ux: {
		intuitiveness: number;
		responsiveness: number;
		error_handling: number;
	};
	architecture: {
		modularity: number;
		scalability: number;
		patterns: number;
	};
	code_cleanliness: {
		readability: number;
		consistency: number;
		documentation: number;
	};
	code_extensibility: {
		extensibility: number;
		maintainability: number;
		reusability: number;
	};
	performance: {
		runtime: number;
		memory_usage: number;
		load_time: number;
	};
}

export interface ComponentYaml {
	components: ComponentData[];
}

export interface FactorDoc {
	name: string;
	description: string;
	levels: string[];
}

export interface DimensionDoc {
	name: string;
	factors: FactorDoc[];
}

export interface DocumentationLang {
	variables: { name: string; description: string }[];
	dimensions: DimensionDoc[];
}

export interface Documentation {
	en: DocumentationLang;
}

export const labels: string[] = [
	'UI Design',
	'UI Consistency',
	'UI Accessibility',
	'UX Intuitiveness',
	'UX Responsiveness',
	'UX Error Handling',
	'Architecture Modularity',
	'Architecture Scalability',
	'Architecture Patterns',
	'Code Readability',
	'Code Consistency',
	'Code Documentation',
	'Extensibility',
	'Maintainability',
	'Reusability',
	'Runtime Performance',
	'Memory Usage',
	'Load Time'
];

export function extractComponentData(component: ComponentData): number[] {
	return [
		component.ui.design,
		component.ui.consistency,
		component.ui.accessibility,
		component.ux.intuitiveness,
		component.ux.responsiveness,
		component.ux.error_handling,
		component.architecture.modularity,
		component.architecture.scalability,
		component.architecture.patterns,
		component.code_cleanliness.readability,
		component.code_cleanliness.consistency,
		component.code_cleanliness.documentation,
		component.code_extensibility.extensibility,
		component.code_extensibility.maintainability,
		component.code_extensibility.reusability,
		component.performance.runtime,
		component.performance.memory_usage,
		component.performance.load_time
	];
}

export const documentation: Documentation = {
	en: {
		variables: [
			{ name: 'name', description: 'Component name (required)' },
			{ name: 'color', description: 'Component color in hex format (optional)' }
		],
		dimensions: [
			{
				name: 'UI',
				factors: [
					{
						name: 'design',
						description: 'Visual appeal and layout of the user interface',
						levels: [
							'0 - Poor design, confusing layout',
							'1 - Basic design, some layout issues',
							'2 - Adequate design, functional layout',
							'3 - Good design, intuitive layout',
							'4 - Excellent design, highly intuitive and visually appealing'
						]
					},
					{
						name: 'consistency',
						description: 'Consistency of UI elements and patterns',
						levels: [
							'0 - Highly inconsistent UI elements',
							'1 - Some inconsistencies in UI elements',
							'2 - Mostly consistent UI elements',
							'3 - Consistent UI elements with minor variations',
							'4 - Highly consistent UI elements throughout'
						]
					},
					{
						name: 'accessibility',
						description: 'Accessibility features for users with disabilities',
						levels: [
							'0 - No accessibility features',
							'1 - Basic accessibility features',
							'2 - Some accessibility features implemented',
							'3 - Most accessibility features implemented',
							'4 - Fully accessible, following WCAG guidelines'
						]
					}
				]
			},
			{
				name: 'UX',
				factors: [
					{
						name: 'intuitiveness',
						description: 'Ease of use and learning for users',
						levels: [
							'0 - Confusing and difficult to use',
							'1 - Requires significant learning',
							'2 - Moderately intuitive, some learning required',
							'3 - Intuitive for most users',
							'4 - Highly intuitive, minimal learning curve'
						]
					},
					{
						name: 'responsiveness',
						description: 'Speed and smoothness of user interactions',
						levels: [
							'0 - Very slow and unresponsive',
							'1 - Noticeable delays in responses',
							'2 - Adequate responsiveness',
							'3 - Good responsiveness, minor delays',
							'4 - Highly responsive, smooth interactions'
						]
					},
					{
						name: 'error_handling',
						description: 'Effectiveness of error prevention and recovery',
						levels: [
							'0 - Poor error handling, frequent crashes',
							'1 - Basic error handling, some unhandled errors',
							'2 - Adequate error handling',
							'3 - Good error handling and prevention',
							'4 - Excellent error handling, prevention, and recovery'
						]
					}
				]
			},
			{
				name: 'Architecture',
				factors: [
					{
						name: 'modularity',
						description: 'Degree of component independence and reusability',
						levels: [
							'0 - Monolithic, tightly coupled code',
							'1 - Some modularization, high coupling',
							'2 - Moderate modularization',
							'3 - Good modularization, low coupling',
							'4 - Highly modular, loosely coupled components'
						]
					},
					{
						name: 'scalability',
						description: 'Ability to handle growth and increased load',
						levels: [
							'0 - Poor scalability, significant bottlenecks',
							'1 - Limited scalability',
							'2 - Moderate scalability',
							'3 - Good scalability, some optimizations possible',
							'4 - Highly scalable architecture'
						]
					},
					{
						name: 'patterns',
						description: 'Use of appropriate design patterns',
						levels: [
							'0 - No clear design patterns used',
							'1 - Some design patterns, often misapplied',
							'2 - Basic design patterns used correctly',
							'3 - Good use of design patterns',
							'4 - Excellent use of appropriate design patterns'
						]
					}
				]
			},
			{
				name: 'Code Cleanliness',
				factors: [
					{
						name: 'readability',
						description: 'Ease of understanding the code',
						levels: [
							'0 - Very difficult to read and understand',
							'1 - Poor readability, requires significant effort',
							'2 - Moderate readability',
							'3 - Good readability, easy to understand',
							'4 - Highly readable, self-explanatory code'
						]
					},
					{
						name: 'consistency',
						description: 'Consistent coding style and conventions',
						levels: [
							'0 - Inconsistent coding style throughout',
							'1 - Some consistency, many variations',
							'2 - Moderate consistency',
							'3 - Good consistency, minor variations',
							'4 - Highly consistent coding style'
						]
					},
					{
						name: 'documentation',
						description: 'Quality and completeness of code documentation',
						levels: [
							'0 - No documentation',
							'1 - Minimal documentation, often outdated',
							'2 - Basic documentation',
							'3 - Good documentation, some areas need improvement',
							'4 - Excellent, comprehensive documentation'
						]
					}
				]
			},
			{
				name: 'Code Extensibility',
				factors: [
					{
						name: 'extensibility',
						description: 'Ease of adding new features or modifications',
						levels: [
							'0 - Very difficult to extend or modify',
							'1 - Requires significant effort to extend',
							'2 - Moderately extensible',
							'3 - Good extensibility, most changes are straightforward',
							'4 - Highly extensible, easy to add new features'
						]
					},
					{
						name: 'maintainability',
						description: 'Ease of maintaining and updating the code',
						levels: [
							'0 - Very difficult to maintain',
							'1 - Requires significant effort to maintain',
							'2 - Moderately maintainable',
							'3 - Good maintainability, most updates are straightforward',
							'4 - Highly maintainable, easy to update'
						]
					},
					{
						name: 'reusability',
						description: 'Ability to reuse code across different contexts',
						levels: [
							'0 - No reusable components',
							'1 - Limited reusability',
							'2 - Moderate reusability',
							'3 - Good reusability, some components are reusable',
							'4 - Highly reusable, well-abstracted components'
						]
					}
				]
			},
			{
				name: 'Performance',
				factors: [
					{
						name: 'runtime',
						description: 'Execution speed and efficiency',
						levels: [
							'0 - Very slow execution, unacceptable performance',
							'1 - Slow execution, significant improvements needed',
							'2 - Average execution speed',
							'3 - Fast execution, minor optimizations possible',
							'4 - Very fast execution, highly optimized'
						]
					},
					{
						name: 'memory_usage',
						description: 'Efficient use of memory resources',
						levels: [
							'0 - Excessive memory usage, frequent out of memory errors',
							'1 - High memory usage, some optimizations needed',
							'2 - Moderate memory usage',
							'3 - Good memory efficiency, minor improvements possible',
							'4 - Excellent memory efficiency, optimized resource usage'
						]
					},
					{
						name: 'load_time',
						description: 'Time taken to load and initialize the component',
						levels: [
							'0 - Very slow load times, unacceptable for users',
							'1 - Slow load times, significant improvements needed',
							'2 - Average load times',
							'3 - Fast load times, minor optimizations possible',
							'4 - Very fast load times, highly optimized'
						]
					}
				]
			}
		]
	}
};

export const defaultYaml = `components:
  - name: Component A
    color: '#FF6384'
    ui:
      design: 3
      consistency: 2
      accessibility: 4
    ux:
      intuitiveness: 3
      responsiveness: 4
      error_handling: 2
    architecture:
      modularity: 3
      scalability: 2
      patterns: 4
    code_cleanliness:
      readability: 3
      consistency: 4
      documentation: 2
    code_extensibility:
      extensibility: 3
      maintainability: 2
      reusability: 4
    performance:
      runtime: 3
      memory_usage: 4
      load_time: 2
  - name: Component B
    color: '#36A2EB'
    ui:
      design: 4
      consistency: 3
      accessibility: 3
    ux:
      intuitiveness: 4
      responsiveness: 3
      error_handling: 4
    architecture:
      modularity: 4
      scalability: 3
      patterns: 3
    code_cleanliness:
      readability: 4
      consistency: 3
      documentation: 4
    code_extensibility:
      extensibility: 4
      maintainability: 3
      reusability: 3
    performance:
      runtime: 4
      memory_usage: 3
      load_time: 4`;
