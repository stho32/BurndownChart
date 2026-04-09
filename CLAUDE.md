# CLAUDE.md

## Projektbeschreibung

BurndownChart ist eine Sammlung von Projekt-Tracking-Tools: Burndown-Charts mit Forecasting und Annotations, ein Source-Code-Quality-Chart, ein Project-Quality-Chart, ein Prio-Helper und ein Task-Burndown-Simulator. Alle Apps werden als Multi-Page SvelteKit-Anwendung bereitgestellt und via GitHub Pages deployt.

## TechStack

- **Framework:** SvelteKit (Svelte 5 mit Runes) — migriert von reinem HTML/JS
- **Sprache:** TypeScript
- **Charts:** Chart.js mit chartjs-plugin-annotation
- **Build:** Vite, Static Adapter (GitHub Pages)
- **Tests:** Vitest (Unit), Playwright (E2E)
- **Architektur-Vorlage:** svelte-app-architecture

## Projektstruktur

```
svelte-app/           # SvelteKit-Anwendung
  src/
    lib/
      components/     # Svelte-Komponenten (Charts etc.)
      utils/          # Hilfsfunktionen (Berechnungen, Generatoren)
    routes/           # SvelteKit-Seiten (eine pro App)
      experiment1/
      experiment2/
      experiment3/
      pppchart/
      priohelper/
      source-code-quality/
      task-burndown-simulator/
  e2e/                # Playwright E2E-Tests
Anforderungen/        # Anforderungsdokumente (R00001..R0000N)
```

## Build-, Dev- und Test-Befehle

Alle Befehle im Verzeichnis `svelte-app/` ausfuehren:

```bash
npm install              # Abhaengigkeiten installieren
npm run dev              # Entwicklungsserver starten
npm run build            # Produktions-Build erstellen
npm run preview          # Build-Vorschau starten
npm test                 # Alle Tests ausfuehren (Vitest + Playwright)
npm run test:e2e         # Nur E2E-Tests (Playwright)
npm run check            # Svelte/TypeScript-Check
```

## Konventionen

- **Anforderungen:** Nummerierung R00001, R00002 usw. in `Anforderungen/`
- **Commits:** `[R0000N] Beschreibung` fuer Anforderungs-bezogene Commits
- **Sprache:** Deutsche Oberflaeche, Code und Variablennamen auf Englisch
- **Komponenten:** Svelte 5 Runes-Syntax verwenden
- **Routing:** Jede App hat eine eigene Route unter `src/routes/<app-name>/`
- **Tests:** Unit-Tests neben dem Code (`*.test.ts`), E2E-Tests in `e2e/`
- **Base-Path:** `/BurndownChart` (fuer GitHub Pages)
