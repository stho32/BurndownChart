# Anforderungen

Dieses Verzeichnis enthaelt die Anforderungsdokumente fuer das BurndownChart-Projekt.

## Nummernkonvention

Anforderungen werden fortlaufend nummeriert:

- **Format:** `R00001`, `R00002`, `R00003`, ...
- **Dateiname:** `R0000N-kurzbeschreibung.md`
- **Beispiel:** `R00001-experiment2-svelte-migration.md`

Die naechste freie Nummer ergibt sich aus der hoechsten vorhandenen Nummer + 1.

## Workflow

1. **Anforderung erstellen:** Neue Datei mit naechster freier Nummer anlegen
2. **Inhalt:** Beschreibung, Ist-/Soll-Zustand, Akzeptanzkriterien, technische Details, Teststrategie
3. **Implementierung:** Commits referenzieren die Anforderungs-ID, z.B. `[R00001] Beschreibung`
4. **Abschluss:** Akzeptanzkriterien pruefen und abhaken

## Vorhandene Anforderungen

| ID | Beschreibung |
|---|---|
| R00001 | Migration experiment2 (Chart.js Burndown) nach Svelte |
| R00002 | Migration experiment1 nach Svelte |
| R00003 | Migration experiment3 nach Svelte |
| R00004 | Migration pppchart nach Svelte |
| R00005 | Migration source-code-quality nach Svelte |
| R00006 | Migration priohelper nach Svelte |
| R00007 | Migration task-burndown-simulator nach Svelte |
