export function calculatePriority(params: {
	nutzungen: number;
	mitarbeiter: number;
	extern: number;
	workaround: number;
	ersparnis: number;
	zieleChecked: number;
	entscheider: number;
	risiko: number;
}): number {
	const { nutzungen, mitarbeiter, extern, workaround, ersparnis, zieleChecked, entscheider, risiko } =
		params;

	// Convert checked goals count to zielpunkte
	const ziele = zieleChecked === 0 ? 1 : zieleChecked;
	let zielpunkte = 1;
	if (ziele === 1) zielpunkte = 1;
	if (ziele === 2) zielpunkte = 5;
	if (ziele === 3) zielpunkte = 7.5;
	if (ziele === 4) zielpunkte = 10;

	const risikoWert = risiko > 1 ? risiko / 10.0 : 1;

	let prio = nutzungen * mitarbeiter * extern * workaround * ersparnis * zielpunkte * risikoWert;

	switch (entscheider) {
		case 2:
			prio += 500;
			break;
		case 3:
			prio += 1000;
			break;
		case 4:
			prio += 1000;
			break;
		case 5:
			prio += 2000;
			break;
	}

	return prio;
}
