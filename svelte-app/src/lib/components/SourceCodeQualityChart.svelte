<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import yaml from 'js-yaml';
	import {
		labels,
		extractComponentData,
		documentation,
		defaultYaml,
		type ComponentYaml,
		type DimensionDoc
	} from '$lib/utils/sourceCodeQualityData';

	Chart.register(...registerables);

	let yamlText = $state(defaultYaml);
	let errorMessage = $state('');
	let currentLanguage = $state<'en'>('en');
	let canvas: HTMLCanvasElement;
	let chart: Chart | undefined;
	let componentSummaries = $state<{ name: string; dimensions: { name: string; avg: number }[] }[]>(
		[]
	);

	function updateChart() {
		errorMessage = '';
		try {
			const config = yaml.load(yamlText) as ComponentYaml;
			if (!config || !config.components || !Array.isArray(config.components)) {
				errorMessage = 'Invalid YAML: must have a "components" array.';
				return;
			}

			const datasets = config.components.map((component) => {
				const color = component.color || '#' + Math.floor(Math.random() * 16777215).toString(16);
				return {
					label: component.name,
					data: extractComponentData(component),
					fill: true,
					backgroundColor: color + '33',
					borderColor: color,
					pointBackgroundColor: color,
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: color
				};
			});

			if (chart) {
				chart.destroy();
			}

			const ctx = canvas.getContext('2d')!;
			chart = new Chart(ctx, {
				type: 'radar',
				data: {
					labels,
					datasets
				},
				options: {
					scales: {
						r: {
							angleLines: { display: true },
							suggestedMin: 0,
							suggestedMax: 4
						}
					}
				}
			});

			// Generate summaries
			componentSummaries = config.components.map((component) => {
				const dimensionKeys = [
					{
						name: 'UI',
						values: [component.ui.design, component.ui.consistency, component.ui.accessibility]
					},
					{
						name: 'UX',
						values: [
							component.ux.intuitiveness,
							component.ux.responsiveness,
							component.ux.error_handling
						]
					},
					{
						name: 'Architecture',
						values: [
							component.architecture.modularity,
							component.architecture.scalability,
							component.architecture.patterns
						]
					},
					{
						name: 'Code Cleanliness',
						values: [
							component.code_cleanliness.readability,
							component.code_cleanliness.consistency,
							component.code_cleanliness.documentation
						]
					},
					{
						name: 'Code Extensibility',
						values: [
							component.code_extensibility.extensibility,
							component.code_extensibility.maintainability,
							component.code_extensibility.reusability
						]
					},
					{
						name: 'Performance',
						values: [
							component.performance.runtime,
							component.performance.memory_usage,
							component.performance.load_time
						]
					}
				];

				return {
					name: component.name,
					dimensions: dimensionKeys.map((d) => ({
						name: d.name,
						avg: d.values.reduce((a, b) => a + b, 0) / d.values.length
					}))
				};
			});
		} catch (e) {
			errorMessage = `YAML parse error: ${e instanceof Error ? e.message : String(e)}`;
		}
	}

	function generateDocumentationHtml(lang: 'en'): string {
		const doc = documentation[lang];
		let html = '<h3>Variables</h3><ul>';
		doc.variables.forEach((v) => {
			html += `<li><strong>${v.name}</strong>: ${v.description}</li>`;
		});
		html += '</ul>';

		doc.dimensions.forEach((dim: DimensionDoc) => {
			html += `<h3>${dim.name}</h3>`;
			dim.factors.forEach((factor) => {
				html += `<details>
					<summary><strong>${factor.name}</strong>: ${factor.description}</summary>
					<ul>
						${factor.levels.map((level) => `<li>${level}</li>`).join('')}
					</ul>
				</details>`;
			});
		});

		return html;
	}

	function copyDocumentation() {
		const doc = documentation[currentLanguage];
		let text = 'Source Code Quality Documentation\n\n';
		text += 'Variables:\n';
		doc.variables.forEach((v) => {
			text += `  ${v.name}: ${v.description}\n`;
		});
		text += '\n';
		doc.dimensions.forEach((dim) => {
			text += `${dim.name}:\n`;
			dim.factors.forEach((factor) => {
				text += `  ${factor.name}: ${factor.description}\n`;
				factor.levels.forEach((level) => {
					text += `    ${level}\n`;
				});
				text += '\n';
			});
		});
		navigator.clipboard.writeText(text);
	}

	onMount(() => {
		updateChart();
		return () => {
			chart?.destroy();
		};
	});
</script>

<h1>Source Code Quality Chart</h1>

<div class="layout">
	<div class="chart-area">
		<canvas bind:this={canvas} width="800" height="800"></canvas>

		{#if componentSummaries.length > 0}
			<div class="summary">
				{#each componentSummaries as comp}
					<h4>{comp.name}</h4>
					<p>
						{#each comp.dimensions as dim}
							<strong>{dim.name}:</strong> Avg {dim.avg.toFixed(1)}<br />
						{/each}
					</p>
				{/each}
			</div>
		{/if}
	</div>

	<div class="editor-area">
		<textarea
			class="yaml-editor"
			bind:value={yamlText}
			rows="30"
			spellcheck="false"
		></textarea>
		<button class="btn btn-primary" onclick={updateChart}>Update Chart</button>
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
	</div>
</div>

<div class="documentation-section">
	<h2>Documentation</h2>
	<div class="doc-controls">
		<button class="btn btn-secondary" onclick={copyDocumentation}>Copy Documentation</button>
	</div>
	<div class="documentation">
		{@html generateDocumentationHtml(currentLanguage)}
	</div>
</div>

<style>
	h1 {
		margin-bottom: 1rem;
	}

	.layout {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.chart-area {
		min-width: 0;
	}

	.chart-area canvas {
		width: 100% !important;
		height: auto !important;
	}

	.editor-area {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.yaml-editor {
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 0.85rem;
		line-height: 1.4;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		resize: vertical;
		width: 100%;
		box-sizing: border-box;
		tab-size: 2;
		background: #fafafa;
	}

	.yaml-editor:focus {
		outline: none;
		border-color: #2c3e50;
		box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.15);
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background 0.15s;
	}

	.btn-primary {
		background: #2c3e50;
		color: white;
	}

	.btn-primary:hover {
		background: #1a252f;
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
	}

	.btn-secondary:hover {
		background: #545b62;
	}

	.error {
		color: #dc3545;
		font-size: 0.85rem;
		margin: 0;
	}

	.summary {
		margin-top: 1rem;
	}

	.summary h4 {
		margin: 0.75rem 0 0.25rem;
		color: #2c3e50;
	}

	.summary p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.documentation-section {
		margin-top: 1rem;
	}

	.doc-controls {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.documentation :global(h3) {
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	.documentation :global(details) {
		margin-bottom: 0.5rem;
	}

	.documentation :global(summary) {
		cursor: pointer;
		padding: 0.25rem 0;
	}

	.documentation :global(ul) {
		margin: 0.25rem 0 0.5rem 1.5rem;
		padding: 0;
	}

	.documentation :global(li) {
		margin-bottom: 0.15rem;
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}
</style>
