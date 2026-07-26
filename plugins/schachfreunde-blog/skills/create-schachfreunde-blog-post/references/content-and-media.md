# Inhalte und Medien

## Standard-Markdown zuerst

Bevorzuge Standard-Markdown für:

- Überschriften und Absätze
- Listen
- Links
- Bilder
- echte Tabellen

Verwende eine Nuxt-Prose-Komponente nur, wenn sie Navigation, Vergleich oder Darstellung erkennbar verbessert. Prüfe Komponentennamen, Props und vorhandene Nutzung im aktuellen Repository; erfinde keine Komponenten.

## Tabellarische Bilder

Behandle ein Bild als Tabellenquelle, wenn sein Hauptinhalt aus beschrifteten Spalten und wiederholten Datenzeilen besteht.

1. Erfasse Bereichsüberschriften und Spaltenüberschriften.
2. Zähle die erwarteten Zeilen je Bereich.
3. Übertrage jede Zelle exakt.
4. Bewahre leere Zellen; ersetze sie nicht durch `0` oder Vermutungen.
5. Prüfe Zeilen- und Spaltenanzahl sowie jede Zahl erneut am Bild.
6. Verwende getrennte Markdown-Tabellen für getrennte Bereiche.

Beispielstruktur:

```md
### Stammspieler

| Brett | Name, Vorname | Mitgliedsnummer | DWZ | Einsätze | Brettpunkte |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | Beispiel, Erika | 123 | 1700 | 8 | 7,5:0,5 |

### Ersatzspieler

| Brett | Name, Vorname | Mitgliedsnummer | DWZ | Einsätze | Brettpunkte |
| ---: | --- | ---: | ---: | ---: | ---: |
| 9 | Beispiel, Emil | 456 | 1450 | 3 | 2,0:1,0 |
```

Behalte das Quellbild nur, wenn der Benutzer dies verlangt, die visuelle Gestaltung selbst relevant ist oder die Transkription nicht zuverlässig möglich ist. Weise im letzten Fall konkret auf unleserliche Zellen hin.

## Bilder

- Bevorzuge separat bereitgestellte Originale gegenüber Dokumentkopien oder Screenshots.
- Bewahre das Originalformat, wenn keine sinnvolle Optimierung erforderlich ist.
- Skaliere kleine Bilder nicht künstlich hoch.
- Verwende kurze, beschreibende Dateinamen in Kleinbuchstaben und Kebab-Case.
- Schreibe konkrete Alt-Texte, die den relevanten Bildinhalt vermitteln.
- Verwende ein Bild nur als Artikelbild, wenn Motiv, Seitenverhältnis und Auflösung geeignet sind.
- Komprimiere nur, wenn keine sichtbare Qualitätsverschlechterung entsteht.

Verwende für ein einzelnes Bild die bestehende Markdown-Syntax. Verwende `::img-gallery` nur für mehrere zusammengehörige Fotos, die als Galerie sinnvoll sind. Verwende keine Galerie für Tabellenbilder oder fachlich unterschiedliche Abbildungen.

## Anhänge

- Benenne PDFs und andere Downloads verständlich.
- Lege sie im zum Beitrag gehörenden Assetordner ab.
- Verwende aussagekräftige Linktexte statt des bloßen Dateinamens.
- Prüfe, ob der Anhang veröffentlicht werden darf und keine unnötigen personenbezogenen Metadaten enthält.
