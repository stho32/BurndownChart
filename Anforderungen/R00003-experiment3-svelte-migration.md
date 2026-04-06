# R00003 — Migration experiment3 (Chart.js/Bootstrap Burndown) nach Svelte

**Quelle:** GitHub Issue: #4
**Status:** Erledigt
**Typ:** Enhancement / Migration

## Beschreibung

Migration von experiment3 (Burndown Chart Generator mit Textarea-basierter Konfiguration) nach Svelte.
Textarea-Parser extrahiert, Chart.js mit Annotation-Plugin und date-fns Adapter integriert.

## Akzeptanzkriterien (alle erfuellt)

- [x] Parser fuer Textarea-Format extrahiert und getestet (8 Tests)
- [x] Chart.js Line-Chart mit Ideal/Actual Burndown und Scatter Points
- [x] Annotation-Plugin fuer Bar-Marker
- [x] Throughput-Tabelle
- [x] Route /experiment3/ erreichbar
