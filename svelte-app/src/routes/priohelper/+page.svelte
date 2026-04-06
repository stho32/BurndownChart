<script lang="ts">
	import { calculatePriority } from '$lib/utils/prioCalculator';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Chart from 'chart.js/auto';

	let nutzungen = $state(1);
	let mitarbeiter = $state(1);
	let extern_ = $state(1);
	let workaround = $state(1);
	let ersparnis = $state(1);
	let entscheider = $state(1);
	let risiko = $state(1);
	let ziel1 = $state(false);
	let ziel2 = $state(false);
	let ziel3 = $state(false);
	let ziel4 = $state(false);

	let canvasEl: HTMLCanvasElement;
	let chart: Chart | undefined;

	const zieleChecked = $derived([ziel1, ziel2, ziel3, ziel4].filter(Boolean).length);

	const priority = $derived(
		calculatePriority({
			nutzungen,
			mitarbeiter,
			extern: extern_,
			workaround,
			ersparnis,
			zieleChecked,
			entscheider,
			risiko
		})
	);

	// Compute zielpunkte for chart display (same logic as calculator)
	const zielpunkte = $derived(
		(() => {
			const z = zieleChecked === 0 ? 1 : zieleChecked;
			if (z === 1) return 1;
			if (z === 2) return 5;
			if (z === 3) return 7.5;
			if (z === 4) return 10;
			return 1;
		})()
	);

	const chartData = $derived([
		nutzungen,
		mitarbeiter,
		extern_,
		workaround,
		ersparnis,
		zielpunkte,
		entscheider,
		risiko
	]);

	// Read URL params on mount
	function initFromUrl() {
		const params = page.url.searchParams;
		if (params.has('nutzungen')) nutzungen = parseInt(params.get('nutzungen')!) || 1;
		if (params.has('mitarbeiter')) mitarbeiter = parseInt(params.get('mitarbeiter')!) || 1;
		if (params.has('extern')) extern_ = parseInt(params.get('extern')!) || 1;
		if (params.has('workaround')) workaround = parseInt(params.get('workaround')!) || 1;
		if (params.has('ersparnis')) ersparnis = parseInt(params.get('ersparnis')!) || 1;
		if (params.has('entscheider')) entscheider = parseInt(params.get('entscheider')!) || 1;
		if (params.has('risiko')) risiko = parseInt(params.get('risiko')!) || 1;

		const ziele = params.getAll('ziel[]');
		ziel1 = ziele.includes('1');
		ziel2 = ziele.includes('2');
		ziel3 = ziele.includes('3');
		ziel4 = ziele.includes('4');
	}

	function updateUrl() {
		const params = new URLSearchParams();
		params.set('nutzungen', String(nutzungen));
		params.set('mitarbeiter', String(mitarbeiter));
		params.set('extern', String(extern_));
		params.set('workaround', String(workaround));
		params.set('ersparnis', String(ersparnis));
		params.set('entscheider', String(entscheider));
		params.set('risiko', String(risiko));
		if (ziel1) params.append('ziel[]', '1');
		if (ziel2) params.append('ziel[]', '2');
		if (ziel3) params.append('ziel[]', '3');
		if (ziel4) params.append('ziel[]', '4');

		const newUrl = `${page.url.pathname}?${params.toString()}`;
		goto(newUrl, { replaceState: true, keepFocus: true, noScroll: true });
	}

	function createOrUpdateChart() {
		if (!canvasEl) return;
		if (chart) {
			chart.data.datasets[0].data = chartData;
			chart.update();
		} else {
			chart = new Chart(canvasEl, {
				type: 'radar',
				data: {
					labels: [
						'Nutzungen',
						'Mitarbeiter',
						'Extern',
						'Workaround',
						'Ersparnis',
						'Ziele',
						'Entscheider',
						'Risiko'
					],
					datasets: [
						{
							label: 'Priorität',
							data: chartData,
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
		// Access chartData to track it
		chartData;
		createOrUpdateChart();
	});

	$effect(() => {
		// Update URL whenever any value changes
		// Access all reactive values to establish dependencies
		nutzungen;
		mitarbeiter;
		extern_;
		workaround;
		ersparnis;
		entscheider;
		risiko;
		ziel1;
		ziel2;
		ziel3;
		ziel4;
		updateUrl();
	});
</script>

<div class="container">
	<h1>Priorisierungshelfer</h1>

	<div class="row">
		<div class="col input-column">
			<div class="mb-3">
				<label for="nutzungen"><strong>Nutzungen pro Mitarbeiter</strong></label>
				<select id="nutzungen" bind:value={nutzungen}>
					<option value={1}>bis 1</option>
					<option value={2}>bis 5</option>
					<option value={3}>bis 10</option>
					<option value={6}>bis 50</option>
					<option value={9}>bis 100</option>
					<option value={10}>&gt;100 oder es ist gesetzlich notwendig</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="mitarbeiter"><strong>Anzahl der betroffenen MA insg.</strong></label>
				<select id="mitarbeiter" bind:value={mitarbeiter}>
					<option value={1}>bis 1</option>
					<option value={2}>bis 5</option>
					<option value={3}>bis 10</option>
					<option value={6}>bis 25</option>
					<option value={9}>bis alle</option>
					<option value={10}>es ist gesetzlich notwendig oder es sind Externe involviert</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="extern"><strong>Anzahl der DIREKT betroffenen Kunden/Externen</strong></label>
				<select id="extern" bind:value={extern_}>
					<option value={1}>bis 1</option>
					<option value={4}>mehrere</option>
					<option value={6}>alle benötigen es, aber nicht alle haben es</option>
					<option value={10}>alle, wirklich alle</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="workaround"><strong>Workaround vorhanden</strong></label>
				<select id="workaround" bind:value={workaround}>
					<option value={1}>nicht nötig</option>
					<option value={5}>ja</option>
					<option value={10}>nein</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="ersparnis"
					><strong
						>Ersparnis oder zs. Gewinn pro Monat insg. höchster Skalenpunkt zählt</strong
					></label
				>
				<select id="ersparnis" bind:value={ersparnis}>
					<option value={1}>0min; 0 EUR</option>
					<option value={2}>bis 30min; 200 EUR</option>
					<option value={3}>bis 1h; 400 EUR</option>
					<option value={4}>bis 2h; 800 EUR</option>
					<option value={5}>bis 4h; 1600 EUR</option>
					<option value={6}>bis 8h; 3200 EUR</option>
					<option value={7}>bis 16h; 6400 EUR</option>
					<option value={8}>bis 32h; 12800 EUR</option>
					<option value={9}>&gt;32h; 12800 EUR</option>
					<option value={10}>Hilft SWE beim schneller sein</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="entscheider"><strong>Entscheider-Prio</strong></label>
				<select id="entscheider" bind:value={entscheider}>
					<option value={1}>Keine Prio</option>
					<option value={2}>Pascal, normale E-Mail</option>
					<option value={3}>Pascal, rotes Ausrufezeichen / besonders wichtig</option>
					<option value={4}>Fabian, normale E-Mail</option>
					<option value={5}>Fabian, rotes Ausrufezeichen / besonders wichtig</option>
				</select>
			</div>

			<div class="mb-3">
				<label for="risiko"
					><strong>Bei Risken: Risiko-Eintrittswahrscheinlichkeit</strong></label
				>
				<select id="risiko" bind:value={risiko}>
					<option value={1}>nicht bewertet</option>
					<option value={3}>vielleicht in den nächsten Jahren</option>
					<option value={5}>vielleicht im nächsten Jahr</option>
					<option value={7}>vielleicht in den nächsten Monaten</option>
					<option value={9}>vielleicht im nächsten Monat</option>
					<option value={10}>Mit absoluter Sicherheit / System steht</option>
				</select>
			</div>

			<fieldset class="mb-3">
				<legend><strong>Entspricht unseren Zielen</strong></legend>
				<div class="checkbox-group">
					<div class="form-check">
						<input type="checkbox" id="ziel1" bind:checked={ziel1} />
						<label for="ziel1"
							>Mahr EDV ist der Top-Arbeitgeber in Deutschland</label
						>
					</div>
					<div class="form-check">
						<input type="checkbox" id="ziel2" bind:checked={ziel2} />
						<label for="ziel2"
							>Mahr EDV ist das Top-Dienstleistungssystemhaus in Deutschland</label
						>
					</div>
					<div class="form-check">
						<input type="checkbox" id="ziel3" bind:checked={ziel3} />
						<label for="ziel3"
							>Mahr EDV hat die top Cloud- und Managed-Angebote</label
						>
					</div>
					<div class="form-check">
						<input type="checkbox" id="ziel4" bind:checked={ziel4} />
						<label for="ziel4"
							>Wir wachsen auf 250 Mitarbeiter und 9+ Standorte</label
						>
					</div>
				</div>
			</fieldset>

			<p class="nav-link">
				<a href="{base}/priohelper/entwicklungsbedarf/">Entwicklungsbedarf-Helper</a>
				&middot;
				<a href="{base}/priohelper/test/">Test Links</a>
			</p>
		</div>

		<div class="col result-column">
			<div class="result-display">
				<p>Die Priorität beträgt: <strong>{priority.toFixed(2)}</strong></p>
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

	fieldset {
		border: none;
		padding: 0;
		margin: 0;
	}

	legend {
		font-size: 0.85rem;
		margin-bottom: 0.15rem;
		padding: 0;
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

	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.form-check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.form-check input[type='checkbox'] {
		margin: 0;
	}

	.form-check label {
		display: inline;
		margin-bottom: 0;
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
