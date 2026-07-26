---
name: create-schachfreunde-blog-post
description: Create or revise blog posts for schachfreunde-biberach.de from raw text, notes, images, attachments, or existing drafts; infer and validate Nuxt Content metadata, turn readable tabular images into semantic tables, organize assets, use repository-native prose components, run content checks, prepare a reviewable local draft or draft pull request, or publish directly through Nuxt Studio only when explicitly requested. Use when a user asks to create, import, improve, stage, or publish a Schachfreunde blog article.
---

# Schachfreunde-Blogbeitrag erstellen

Erstelle aus dem bereitgestellten Material einen sprachlich, technisch und visuell geprüften Beitrag für `schachfreunde-biberach.de`. Behandle Word-Dateien nur als eine mögliche Quelle unter vielen.

## Arbeitsablauf

1. Prüfe vor Änderungen den Git-Status und bewahre vorhandene, nicht zugehörige Änderungen.
2. Lies die aktuellen Vorgaben direkt aus dem Repository:
   - Artikelschema aus `content.config.ts`
   - Kategorien aus `app/app.config.ts`
   - gültige Autorenkennungen aus `content/users/`
   - verfügbare Inhaltskomponenten aus `app/components/content/` und vorhandenen Beiträgen
3. Inventarisiere Rohtext, Bilder, Anhänge, Links und ausdrücklich vorgegebene Metadaten.
4. Trenne belegte Fakten von redaktionellen Ableitungen. Erfinde keine Namen, Ergebnisse, Termine, Zitate, Bildinhalte oder Quellen.
5. Lies `references/editorial-style.md` für jede inhaltliche Überarbeitung.
6. Lies `references/repository-conventions.md`, bevor du Dateien oder Frontmatter anlegst.
7. Lies `references/content-and-media.md`, sobald Bilder, Anhänge, tabellarische Daten oder besondere Prose-Komponenten vorkommen.
8. Erzeuge Beitrag und Assets in den vorgesehenen Repository-Pfaden.
9. Sortiere das Frontmatter verbindlich mit `title` zuerst und allen weiteren vorhandenen Top-Level-Feldern alphabetisch. Prüfe außerdem sämtliche neuen Datei- und Ordnernamen gegen das Namensschema.
10. Prüfe Inhalt, Metadaten, Links, Tabellen und Medien gegen die Quellen.
11. Führe die passenden Repository-Checks aus und behebe nur Fehler im eigenen Änderungssatz.
12. Wenn ein Commit beauftragt ist, stage ausschließlich den eigenen Änderungssatz und verwende eine Conventional-Commit-Nachricht nach den Regeln in `references/repository-conventions.md`.
13. Erstelle einen Draft-PR nur, wenn dies beauftragt ist und GitHub-Schreibzugriff besteht. Veröffentliche oder merge niemals eigenmächtig.
14. Lies `references/nuxt-studio-publishing.md` und arbeite direkt in Nuxt Studio ausschließlich dann, wenn der Benutzer dies ausdrücklich wünscht.

## Eingaben behandeln

- Akzeptiere Fließtext, Stichpunkte, Bilder, Tabellenbilder, PDFs, Word-Dateien, Links und bestehende Markdown-Entwürfe.
- Bevorzuge separat bereitgestellte Originalbilder gegenüber in Dokumenten eingebetteten Kopien.
- Fahre mit einem Textentwurf fort, wenn ein optionales Bild technisch nicht extrahierbar ist. Melde die Lücke und bitte nur dann um eine separate Datei, wenn sie das Ergebnis materiell verbessert.
- Frage nur bei Unsicherheiten nach, die Autorenschaft, Fakten, rechtliche Freigaben oder die Veröffentlichungsentscheidung wesentlich verändern würden.

## Metadaten ableiten

- Übernimm ausdrücklich genannte Werte.
- Leite fehlende Werte aus Quelle, bestehenden Beiträgen und Repository-Kontext ab.
- Kennzeichne wesentliche Ableitungen im Abschlussbericht.
- Setze `published: true`, sofern der Benutzer den Beitrag nicht ausdrücklich als Entwurf oder nicht öffentlich kennzeichnet. Ein Commit gilt dabei als Freigabe zur Veröffentlichung.
- Verwende nur vorhandene Kategorien und Autorenkennungen.
- Wähle ein Artikelbild nur, wenn Motiv, Auflösung und Freigabe dafür geeignet sind.
- Ordne die vorhandenen Top-Level-Felder immer exakt so: zuerst `title`, danach alphabetisch nach Feldname. Das gilt auch für optionale und künftig ergänzte Felder.
- Halte für Beitrag, Assetordner und jede Assetdatei das verbindliche Schema aus `references/repository-conventions.md` ein. Normalisiere abweichende Eingaben und dokumentiere die Zuordnung.

## Tabellen aus Bildern

Übertrage klar erkennbare tabellarische Bildinhalte standardmäßig in echte Markdown-Tabellen.

- Bewahre Überschriften, Spalten, Zeilen, Reihenfolge, Schreibweisen, Dezimaltrennzeichen und leere Felder.
- Teile getrennte Bereiche wie „Stammspieler“ und „Ersatzspieler“ in eigene, beschriftete Tabellen.
- Prüfe jede Zelle noch einmal am Bild. Rekonstruiere unleserliche Werte nicht durch Raten.
- Erhalte das Bild nur auf ausdrücklichen Wunsch oder wenn Gestaltung, Diagramme oder unzuverlässig lesbare Inhalte einen zusätzlichen Informationswert haben.
- Dupliziere dieselben Daten nicht als Tabelle und Bild, sofern dies nicht begründet oder gewünscht ist.

## Redaktionelle Grenzen

- Verbessere Rechtschreibung, Grammatik, Lesefluss, Absätze und Zwischenüberschriften, ohne Aussage oder persönliche Stimme unnötig zu verändern.
- Entferne keine relevanten Ergebnisse, Danksagungen, Namen oder Anhänge.
- Formuliere Titel und Beschreibung konkret, sachlich und ohne unbelegte Zuspitzung.
- Verwende Komponenten nur, wenn sie die Lesbarkeit gegenüber Standard-Markdown tatsächlich verbessern.

## Validierung und Übergabe

Führe mindestens aus:

```text
pnpm contentcheck
pnpm lint
```

Führe vor einer Veröffentlichungsfreigabe nach Möglichkeit zusätzlich `pnpm generate` und eine visuelle Kontrolle der Beitragsroute durch.

Berichte abschließend:

- angelegte oder geänderte Beitrags- und Assetdateien
- gewählte oder abgeleitete Metadaten
- Ergebnis der Prüfung von Frontmatter-Reihenfolge und Dateinamensschema
- in Tabellen übertragene Bilddaten
- Qualitätswarnungen und offene Punkte
- ausgeführte Prüfungen und deren Ergebnis
- lokalen Entwurf oder URL des Draft-PRs
