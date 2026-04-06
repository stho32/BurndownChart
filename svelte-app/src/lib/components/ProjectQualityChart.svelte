<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import yaml from 'js-yaml';
	import {
		calculateDimensionAverages,
		generateDocumentationHtml,
		generateProjectSummaryHtml,
		documentation,
		type ProjectConfig
	} from '$lib/utils/pppchartData';

	Chart.register(...registerables);

	const defaultYaml = `projects:
  - name: Project A
    color: '#FF6384'
    people:
      knowledge: 3
      stability: 2
      energy: 4
      work_life_balance: 3
    product:
      functionality: 3
      performance: 4
      extensibility: 2
      code_quality: 3
      security: 4
      maintainability: 2
    process:
      clarity: 3
      autonomy: 2
      quality: 4
      efficiency: 3
  - name: Project B
    color: '#36A2EB'
    people:
      knowledge: 4
      stability: 3
      energy: 3
      work_life_balance: 4
    product:
      functionality: 4
      performance: 3
      extensibility: 4
      code_quality: 4
      security: 3
      maintainability: 3
    process:
      clarity: 4
      autonomy: 3
      quality: 3
      efficiency: 4`;

	let yamlText = $state(defaultYaml);
	let docLanguage = $state<'en' | 'de'>('en');
	let summaryLanguage = $state<'en' | 'de'>('en');
	let documentationHtml = $state('');
	let projectSummaryHtml = $state('');
	let errorMessage = $state('');

	let canvas: HTMLCanvasElement;
	let chart: Chart | undefined;

	function updateChart() {
		try {
			const config = yaml.load(yamlText) as ProjectConfig;
			errorMessage = '';

			const data = {
				labels: ['People', 'Product', 'Process'],
				datasets: config.projects.map((project) => {
					const averages = calculateDimensionAverages(project);
					return {
						label: project.name,
						data: [averages.people, averages.product, averages.process],
						fill: true,
						backgroundColor: project.color
							? `${project.color}33`
							: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
						borderColor:
							project.color ||
							`rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
						pointBackgroundColor:
							project.color ||
							`rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
						pointBorderColor: '#fff',
						pointHoverBackgroundColor: '#fff',
						pointHoverBorderColor:
							project.color ||
							`rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
					};
				})
			};

			if (chart) {
				chart.destroy();
			}

			const ctx = canvas.getContext('2d')!;
			chart = new Chart(ctx, {
				type: 'radar',
				data: data,
				options: {
					scales: {
						r: {
							angleLines: {
								display: true
							},
							suggestedMin: 0,
							suggestedMax: 4
						}
					}
				}
			});

			projectSummaryHtml = generateProjectSummaryHtml(config, summaryLanguage);
		} catch (e) {
			errorMessage = `YAML Error: ${e instanceof Error ? e.message : String(e)}`;
		}
	}

	function toggleDocLanguage() {
		docLanguage = docLanguage === 'en' ? 'de' : 'en';
		documentationHtml = generateDocumentationHtml(docLanguage);
	}

	function toggleSummaryLanguage() {
		summaryLanguage = summaryLanguage === 'en' ? 'de' : 'en';
		try {
			const config = yaml.load(yamlText) as ProjectConfig;
			projectSummaryHtml = generateProjectSummaryHtml(config, summaryLanguage);
		} catch {
			// keep previous summary on error
		}
	}

	async function copyDocumentation() {
		const langDoc = documentation[docLanguage];
		let text = 'Project Quality Documentation\n\n';

		text += 'Variables:\n';
		langDoc.variables.forEach((v) => {
			text += `${v.name}: ${v.description}\n`;
		});
		text += '\n';

		langDoc.dimensions.forEach((dim) => {
			text += `${dim.name}:\n`;
			dim.factors.forEach((factor) => {
				text += `  ${factor.name}: ${factor.description}\n`;
				factor.levels.forEach((level, index) => {
					text += `    ${index}: ${level}\n`;
				});
				text += '\n';
			});
		});

		await navigator.clipboard.writeText(text);
		alert('Detailed documentation copied to clipboard!');
	}

	onMount(() => {
		documentationHtml = generateDocumentationHtml(docLanguage);
		updateChart();
	});
</script>

<div class="container">
	<h1>Project Quality</h1>
	<div class="row">
		<div class="chart-area">
			<canvas bind:this={canvas}></canvas>
			{#if errorMessage}
				<div class="error">{errorMessage}</div>
			{/if}
			<div class="project-summary">
				{@html projectSummaryHtml}
			</div>
		</div>
		<div class="editor-area">
			<textarea
				class="yaml-editor"
				bind:value={yamlText}
				spellcheck="false"
			></textarea>
			<button class="btn btn-primary" onclick={updateChart}>Update Chart</button>
		</div>
	</div>
	<div class="documentation-section">
		<h2>Documentation</h2>
		<div class="doc-buttons">
			<button class="btn btn-secondary" onclick={toggleDocLanguage}>
				{docLanguage === 'en' ? 'Switch to German' : 'Zu Englisch wechseln'}
			</button>
			<button class="btn btn-secondary" onclick={toggleSummaryLanguage}>
				{summaryLanguage === 'en' ? 'Switch Summary to German' : 'Zusammenfassung auf Englisch'}
			</button>
			<button class="btn btn-info" onclick={copyDocumentation}>
				Copy Documentation
			</button>
		</div>
		<div class="documentation-content">
			{@html documentationHtml}
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 1.5rem;
	}

	.row {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1.5rem;
	}

	.chart-area {
		min-width: 0;
	}

	.editor-area {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.yaml-editor {
		width: 100%;
		min-height: 500px;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.85rem;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		resize: vertical;
		tab-size: 2;
		line-height: 1.4;
		box-sizing: border-box;
	}

	.error {
		color: #dc3545;
		margin-top: 0.5rem;
		padding: 0.5rem;
		background: #f8d7da;
		border-radius: 4px;
	}

	.project-summary {
		margin-top: 1.5rem;
	}

	.documentation-section {
		margin-top: 2rem;
	}

	.doc-buttons {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.btn-primary {
		background: #0d6efd;
		color: white;
	}

	.btn-primary:hover {
		background: #0b5ed7;
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
	}

	.btn-secondary:hover {
		background: #5c636a;
	}

	.btn-info {
		background: #0dcaf0;
		color: #000;
	}

	.btn-info:hover {
		background: #31d2f2;
	}

	.documentation-content :global(details) {
		margin-bottom: 0.25rem;
	}

	.documentation-content :global(summary) {
		cursor: pointer;
		padding: 0.25rem 0;
	}

	.documentation-content :global(ul) {
		margin: 0.25rem 0 0.5rem 1.5rem;
	}

	@media (max-width: 768px) {
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
