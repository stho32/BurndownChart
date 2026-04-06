<script lang="ts">
	import { calculateEntwicklungsbedarf } from '$lib/utils/entwicklungsbedarfCalculator';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Chart from 'chart.js/auto';

	let effizienzsteigerung = $state(0);
	let benutzerfreundlichkeit = $state(1);
	let performance_ = $state(2);
	let fehlerhaeufigkeit = $state(1);
	let fehleraufwand = $state(1);
	let deadEnd = $state(1);
	let verdientesGeld = $state(1);

	let canvasEl: HTMLCanvasElement;
	let chart: Chart | undefined;

	const result = $derived(
		calculateEntwicklungsbedarf({
			effizienzsteigerung,
			benutzerfreundlichkeit,
			performance: performance_,
			fehlerhaeufigkeit,
			fehleraufwand,
			deadEnd,
			verdientesGeld
		})
	);

	function initFromUrl() {
		const params = page.url.searchParams;
		if (params.has('effizienzsteigerung'))
			effizienzsteigerung = parseInt(params.get('effizienzsteigerung')!) || 0;
		if (params.has('benutzerfreundlichkeit'))
			benutzerfreundlichkeit = parseInt(params.get('benutzerfreundlichkeit')!) || 1;
		if (params.has('performance'))
			performance_ = parseInt(params.get('performance')!) || 2;
		if (params.has('fehlerhaeufigkeit'))
			fehlerhaeufigkeit = parseInt(params.get('fehlerhaeufigkeit')!) || 1;
		if (params.has('fehleraufwand'))
			fehleraufwand = parseInt(params.get('fehleraufwand')!) || 1;
		if (params.has('deadEnd')) deadEnd = parseInt(params.get('deadEnd')!) || 1;
		if (params.has('verdientesGeld'))
			verdientesGeld = parseInt(params.get('verdientesGeld')!) || 1;
	}

	function updateUrl() {
		const params = new URLSearchParams();
		params.set('effizienzsteigerung', String(effizienzsteigerung));
		params.set('benutzerfreundlichkeit', String(benutzerfreundlichkeit));
		params.set('performance', String(performance_));
		params.set('fehlerhaeufigkeit', String(fehlerhaeufigkeit));
		params.set('fehleraufwand', String(fehleraufwand));
		params.set('deadEnd', String(deadEnd));
		params.set('verdientesGeld', String(verdientesGeld));

		const newUrl = `${page.url.pathname}?${params.toString()}`;
		goto(newUrl, { replaceState: true, keepFocus: true, noScroll: true });
	}

	function createOrUpdateChart() {
		if (!canvasEl) return;
		const data = result.factors;
		if (chart) {
			chart.data.datasets[0].data = data;
			chart.update();
		} else {
			chart = new Chart(canvasEl, {
				type: 'radar',
				data: {
					labels: [
						'Effizienzsteigerung',
						'Benutzerfreundlichkeit',
						'Performance',
						'Fehlerhäufigkeit',
						'Fehleraufwand',
						'Dead End',
						'Verdientes Geld'
					],
					datasets: [
						{
							label: 'Entwicklungsbedarf',
							data: data,
							fill: true,
							backgroundColor: 'rgba(75, 192, 192, 0.2)',
							borderColor: 'rgba(75, 192, 192, 1)',
							pointBackgroundColor: 'rgba(75, 192, 192, 1)',
							pointBorderColor: '#fff',
							pointHoverBackgroundColor: '#fff',
							pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
						}
					]
				},
				options: {
					scales: {
						r: {
							angleLines: { display: true },
							suggestedMin: 0,
							suggestedMax: 10
						}
					}
				}
			});
		}
	}

	$effect(() => {
		initFromUrl();
	});

	$effect(() => {
		result.factors;
		createOrUpdateChart();
	});

	$effect(() => {
		effizienzsteigerung;
		benutzerfreundlichkeit;
		performance_;
		fehlerhaeufigkeit;
		fehleraufwand;
		deadEnd;
		verdientesGeld;
		updateUrl();
	});
</script>

<div class="container">
	<h1>Entwicklungsbedarf-Helper</h1>

	<div class="row">
		<div class="col input-column">
			<div class="mb-3">
				<label for="effizienzsteigerung"><strong>Effizienzsteigerung</strong></label>
				<div class="inline-input">
					<input
						type="number"
						id="effizienzsteigerung"
						min="0"
						max="160"
						bind:value={effizienzsteigerung}
					/>
					<span>{effizienzsteigerung} Stunden pro Monat</span>
				</div>
			</div>

			<div class="mb-3">
				<label for="benutzerfreundlichkeit"><strong>Benutzerfreundlichkeit</strong></label>
				<select id="benutzerfreundlichkeit" bind:value={benutzerfreundlichkeit}>
					<option value={1}>Sehr gut</option>
					<option value={3}>Gut</option>
					<option value={5}>Mittel</option>
					<option value={7}>Schlecht</option>
					<option value={10}>Sehr schlecht</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="performance">Performance (Wartezeit in Sekunden):</label>
				<div class="inline-input">
					<input
						type="range"
						id="performance"
						min="2"
						max="30"
						step="1"
						bind:value={performance_}
					/>
					<span>{performance_} Sekunden</span>
				</div>
			</div>

			<div class="mb-3">
				<label for="fehlerhaeufigkeit"><strong>Fehlerhäufigkeit</strong></label>
				<select id="fehlerhaeufigkeit" bind:value={fehlerhaeufigkeit}>
					<option value={1}>Sehr selten</option>
					<option value={3}>Selten</option>
					<option value={5}>Gelegentlich</option>
					<option value={7}>Häufig</option>
					<option value={10}>Sehr häufig</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="fehleraufwand"
					><strong>Durchschn. Fehleraufwand pro Fall</strong></label
				>
				<select id="fehleraufwand" bind:value={fehleraufwand}>
					<option value={1}>Sehr gering</option>
					<option value={3}>Gering</option>
					<option value={5}>Mittel</option>
					<option value={7}>Hoch</option>
					<option value={10}>Sehr hoch</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="deadEnd"
					><strong
						>Dead End (z.B. Lieferant stellt kritische Technologie ein)</strong
					></label
				>
				<select id="deadEnd" bind:value={deadEnd}>
					<option value={1}>Kein Risiko</option>
					<option value={3}>Geringes Risiko</option>
					<option value={5}>Mittleres Risiko</option>
					<option value={7}>Hohes Risiko</option>
					<option value={10}>Sehr hohes Risiko</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="verdientesGeld"><strong>Verdientes Geld pro Monat</strong></label>
				<select id="verdientesGeld" bind:value={verdientesGeld}>
					<option value={1}>0 - 1.000 EUR</option>
					<option value={3}>1.001 - 5.000 EUR</option>
					<option value={5}>5.001 - 10.000 EUR</option>
					<option value={7}>10.001 - 50.000 EUR</option>
					<option value={10}>&gt; 50.000 EUR</option>
				</select>
			</div>

			<p class="nav-link">
				<a href="{base}/priohelper/">Priorisierungshelfer</a>
				&middot;
				<a href="{base}/priohelper/test/">Test Links</a>
			</p>
		</div>

		<div class="col result-column">
			<div class="result-display">
				<p>
					Der Entwicklungsbedarf beträgt: <strong>{result.score.toFixed(2)}</strong>
				</p>
			</div>
			<div class="chart-container">
				<canvas bind:this={canvasEl}></canvas>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		padding: 20px 0;
		font-size: 14px;
	}

	h1 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.row {
		display: flex;
		gap: 2rem;
	}

	.col {
		flex: 1;
		min-width: 0;
	}

	.input-column {
		max-height: calc(100vh - 140px);
		overflow-y: auto;
	}

	.mb-3 {
		margin-bottom: 0.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.15rem;
		font-size: 0.85rem;
	}

	select {
		width: 100%;
		padding: 0.375rem 0.75rem;
		font-size: 0.8rem;
		border: 1px solid #ced4da;
		border-radius: 0.375rem;
		background-color: #fff;
	}

	input[type='number'] {
		width: 80px;
		padding: 0.375rem 0.75rem;
		font-size: 0.8rem;
		border: 1px solid #ced4da;
		border-radius: 0.375rem;
	}

	input[type='range'] {
		flex: 1;
	}

	.inline-input {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
	}

	.result-display {
		margin-bottom: 1rem;
	}

	.chart-container {
		max-height: 400px;
	}

	.nav-link {
		margin-top: 1rem;
		font-size: 0.85rem;
	}

	.nav-link a {
		color: #2c3e50;
	}

	@media (max-width: 768px) {
		.row {
			flex-direction: column;
		}

		.input-column {
			max-height: none;
		}
	}
</style>
