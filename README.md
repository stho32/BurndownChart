# BurndownChart

A burndown chart for your project data with forecasting and annotations.

GitHub Pages: https://stho32.github.io/BurndownChart/

## Svelte-Migration

Alle Apps wurden von reinem HTML/JS nach **SvelteKit** migriert. Die Svelte-App befindet sich im Verzeichnis `svelte-app/`.

### Setup

```bash
cd svelte-app
npm install
npm run dev
```

### Build und Deploy

```bash
cd svelte-app
npm run build
```

Der statische Build wird im Verzeichnis `svelte-app/build/` erzeugt und ist kompatibel mit GitHub Pages.

## Enthaltene Apps

| App | Beschreibung | Route |
|---|---|---|
| Burndown Chart (Experiment 1) | Einfaches Burndown-Chart | `/experiment1` |
| Burndown Chart (Experiment 2) | Chart.js Burndown mit Trendlinie | `/experiment2` |
| Burndown Chart (Experiment 3) | Erweitertes Burndown-Chart | `/experiment3` |
| Project Quality Chart | Projektqualitaets-Visualisierung | `/pppchart` |
| Source Code Quality Chart | Code-Qualitaets-Tracking | `/source-code-quality` |
| Prio Helper | Lineare Priorisierung von Aufgaben | `/priohelper` |
| Task Burndown Simulator | Simulation von Task-Burndowns | `/task-burndown-simulator` |

## Legacy-Verzeichnisse

Die urspruenglichen HTML/JS-Implementierungen befinden sich weiterhin in den Verzeichnissen `experiment1/`, `experiment2/`, `experiment3/`, `pppchart/`, `priohelper/`, `source-code-quality/` und `task-burndown-simulator/`. Sie werden durch die Svelte-App ersetzt.
