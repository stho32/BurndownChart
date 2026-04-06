export function calculateEntwicklungsbedarf(params: {
	effizienzsteigerung: number;
	benutzerfreundlichkeit: number;
	performance: number;
	fehlerhaeufigkeit: number;
	fehleraufwand: number;
	deadEnd: number;
	verdientesGeld: number;
}): { score: number; factors: number[] } {
	const {
		effizienzsteigerung,
		benutzerfreundlichkeit,
		performance,
		fehlerhaeufigkeit,
		fehleraufwand,
		deadEnd,
		verdientesGeld
	} = params;

	// Convert efficiency hours (0-160) to 1-10 scale
	const effizienzFaktor = Math.min(Math.ceil(effizienzsteigerung / 16), 10);

	// Convert performance wait time (2-30 seconds) to 1-10 scale
	const performanceFaktor = Math.min(Math.ceil((performance - 1) / 3), 10);

	const score =
		effizienzFaktor *
		benutzerfreundlichkeit *
		performanceFaktor *
		fehlerhaeufigkeit *
		fehleraufwand *
		deadEnd *
		(11 - verdientesGeld);

	return {
		score,
		factors: [
			effizienzFaktor,
			benutzerfreundlichkeit,
			performanceFaktor,
			fehlerhaeufigkeit,
			fehleraufwand,
			deadEnd,
			verdientesGeld
		]
	};
}
