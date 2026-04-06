# R00001 — Migration experiment2 (Chart.js Burndown) nach Svelte

**Quelle:** GitHub Issue: #3
**Status:** Offen
**Typ:** Enhancement / Migration

## Beschreibung

Die bestehende Burndown-Chart-Anwendung in `experiment2/` wird von reinem HTML/JS nach Svelte migriert. Dies ist der erste Schritt der Gesamtmigration (#1) und dient als Grundlage fuer die Svelte-Projektstruktur des gesamten Repositories.

## Ist-Zustand

- `experiment2/index.html` — Haupt-HTML mit eingebettetem Konfigurations-Script
- `experiment2/monthLabelGenerator.js` — Generiert Monatslabels fuer Datumsbereich
- `experiment2/taskCalculator.js` — Berechnet verbleibende Tasks basierend auf Accomplishments
- `experiment2/trendlineCalculator.js` — Lineare Regression fuer Trendlinie
- `experiment2/monthlyBurndown.js` — Chart-Renderer-Klasse (Chart.js)
- `experiment2/taskCalculator.test.js` — Jest-Tests (4 Tests)
- Alle JS-Module nutzen CommonJS-Exports (`module.exports`) fuer Node.js/Testing

## Soll-Zustand

### Svelte-Projektstruktur

- SvelteKit-Projekt mit Static Adapter (fuer GitHub Pages Deployment)
- Vitest als Test-Framework (ersetzt Jest)
- Projekt im Root-Verzeichnis des Repositories

### Funktionale Anforderungen

1. **Burndown Chart anzeigen**: Chart mit Tasks-Remaining-Linie und Trendlinie
2. **Monatslabels**: Automatische Generierung basierend auf Start-/Enddatum
3. **Task-Berechnung**: Verbleibende Tasks basierend auf initialen Tasks und monatlichen Accomplishments berechnen
4. **Trendlinie**: Lineare Regression ueber vorhandene Datenpunkte, projiziert auf gesamten Zeitraum
5. **Chart-Rendering**: Chart.js Line-Chart mit korrekter Konfiguration (Y-Achse ab 0, Labels, Fill, Trendlinie gestrichelt)

### Nicht-funktionale Anforderungen

1. **GitHub Pages kompatibel**: Statischer Build, deploybar unter `stho32.github.io/BurndownChart/experiment2/`
2. **Bestehende URLs erhalten**: Die Seite muss unter dem gleichen Pfad erreichbar bleiben
3. **Testabdeckung**: Alle bestehenden 4 Tests migriert + neue Tests fuer bisher ungetestete Module

## Akzeptanzkriterien

- [ ] SvelteKit-Projekt mit Static Adapter ist konfiguriert
- [ ] `generateMonthLabels()` funktioniert identisch zum Original
- [ ] `calculateTasksRemaining()` funktioniert identisch zum Original
- [ ] `calculateTrendline()` funktioniert identisch zum Original
- [ ] Burndown-Chart wird korrekt gerendert (Chart.js in Svelte-Komponente)
- [ ] Alle 4 bestehenden Tests sind nach Vitest migriert und gruen
- [ ] Neue Tests fuer `generateMonthLabels` und `calculateTrendline`
- [ ] `npm run build` erzeugt statisches Output
- [ ] Die alte `experiment2/`-Verzeichnisstruktur bleibt als Build-Output erhalten (URL-Kompatibilitaet)

## Technische Details

### Betroffene Dateien (Quelle)

| Datei | Funktion |
|---|---|
| `experiment2/index.html` | Haupt-UI, Konfigurationsdaten |
| `experiment2/monthLabelGenerator.js` | `generateMonthLabels(startDate, endDate)` |
| `experiment2/taskCalculator.js` | `calculateTasksRemaining(initialTasks, accomplishments, labels)` |
| `experiment2/trendlineCalculator.js` | `calculateTrendline(data, length)` |
| `experiment2/monthlyBurndown.js` | `MonthlyBurndownChart` Klasse |
| `experiment2/taskCalculator.test.js` | 4 Jest-Tests |

### Ziel-Dateien (Svelte)

| Datei | Funktion |
|---|---|
| `src/lib/utils/monthLabelGenerator.js` | ESM-Export der Funktion |
| `src/lib/utils/taskCalculator.js` | ESM-Export der Funktion |
| `src/lib/utils/trendlineCalculator.js` | ESM-Export der Funktion |
| `src/lib/components/BurndownChart.svelte` | Chart.js Svelte-Komponente |
| `src/routes/experiment2/+page.svelte` | Seite mit Konfiguration und Chart |
| `src/lib/utils/monthLabelGenerator.test.js` | Vitest-Tests |
| `src/lib/utils/taskCalculator.test.js` | Vitest-Tests (migriert) |
| `src/lib/utils/trendlineCalculator.test.js` | Vitest-Tests |

## Teststrategie

- **Unit-Tests**: Alle 3 Utility-Funktionen einzeln testen (Vitest)
- **Komponenten-Tests**: BurndownChart-Komponente rendert korrekt mit Testdaten
- **Migration**: Bestehende 4 Jest-Tests 1:1 nach Vitest ueberfuehren
