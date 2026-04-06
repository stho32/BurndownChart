# R00002 — Migration experiment1 (Google Charts Burndown) nach Svelte

**Quelle:** GitHub Issue: #2
**Status:** Offen
**Typ:** Enhancement / Migration

## Beschreibung

Die bestehende Burndown-Chart-Anwendung in `experiment1/` wird von reinem HTML/JS nach Svelte migriert. Nutzt Google Charts API mit Event-Annotations und interaktiver Event-Tabelle.

## Ist-Zustand

- `experiment1/index.html` — Einzelne HTML-Datei (290 Zeilen) mit eingebettetem JS
- Google Charts API (LineChart)
- 2 Datenreihen: "What's next tasks remaining" + "Total Tasks Remaining"
- Trendlinien fuer beide Reihen
- Event-Dots (SVG) mit Hover-Interaktion zur Event-Tabelle
- Wochen-Marker (Montag-Gridlines)
- Hardcoded Projektdaten

## Soll-Zustand

### Svelte-Komponenten

- `GoogleBurndownChart.svelte` — Google Charts Wrapper mit Event-Dots und Wochen-Markern
- `EventTable.svelte` — Event-Tabelle mit Hover-Interaktion
- Route `src/routes/experiment1/+page.svelte`

### Funktionale Anforderungen

1. **Google Charts LineChart**: 2 Datenreihen mit Trendlinien
2. **Event-Dots**: Lila Punkte ueber dem Chart an Event-Daten
3. **Wochen-Marker**: Vertikale Linien an jedem Montag
4. **Event-Tabelle**: Tabelle mit Datum, Event, Details
5. **Hover-Interaktion**: Hover ueber Tabellenzeile highlightet Chart-Marker und umgekehrt
6. **Annotations**: "start" und "deadline" Labels im Chart

### Datenstruktur (extrahiert)

```typescript
interface ChartDataRow {
  date: Date;
  whatsNextRemaining: number | null;
  totalRemaining: number | null;
  annotation: string | null;
}

interface EventEntry {
  id: number;
  date: string;
  dateDisplay: string;
  title: string;
  details: string;
  chartDate: Date;
}
```

## Akzeptanzkriterien

- [ ] Google Charts LineChart rendert mit 2 Datenreihen + Trendlinien
- [ ] Event-Dots erscheinen als lila Punkte ueber dem Chart
- [ ] Wochen-Marker (Montag-Gridlines) sind sichtbar
- [ ] Event-Tabelle zeigt alle 5 Events
- [ ] Hover-Interaktion funktioniert bidirektional (Tabelle ↔ Chart)
- [ ] Route `/experiment1/` ist erreichbar
- [ ] Tests fuer Datenstrukturen und Hilfsfunktionen
- [ ] Startseite verlinkt auf experiment1

## Teststrategie

- **Unit-Tests**: Datenstrukturen und Chart-Konfiguration
- **Keine Komponenten-Tests fuer Google Charts**: Google Charts manipuliert DOM extern, nicht testbar ohne E2E
