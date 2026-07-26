---
name: create-schachfreunde-blog-post
description: Create or revise blog posts for schachfreunde-biberach.de from raw text, notes, images, attachments, or existing drafts; preserve fully written source text by default while correcting errors, write natural non-formulaic German when drafting, read current conventions and examples directly from the GitHub repository, infer and validate Nuxt Content metadata, turn readable tabular images into semantic tables, organize assets, use repository-native prose components, run content checks, prepare a reviewable local draft or draft pull request, or publish directly through Nuxt Studio only when explicitly requested. Use when a user asks to create, import, improve, stage, or publish a Schachfreunde blog article.
---

# Schachfreunde-Blogbeitrag erstellen

Erstelle aus dem bereitgestellten Material einen sprachlich, technisch und visuell geprüften Beitrag für `schachfreunde-biberach.de`. Behandle Word-Dateien nur als eine mögliche Quelle unter vielen.

## Verbindliche Repositoryquelle

Lies aktuelle Vorgaben, Autorenkennungen, Komponenten und Beispielbeiträge vor jeder Bearbeitung direkt aus dem GitHub-Repository [`sfbiberach/schachfreunde-biberach.de`](https://github.com/sfbiberach/schachfreunde-biberach.de).

- Verwende bevorzugt die verbundene GitHub-App und ersatzweise `gh`, um den aktuellen Standardbranch und die benötigten Dateien abzurufen.
- Behandle einen lokalen Checkout nur als Arbeitsziel für Entwurf, Assets und Prüfungen, nicht als maßgebliche Quelle, solange GitHub erreichbar ist.
- Verwende keinen möglicherweise veralteten lokalen Stand stillschweigend als Referenz. Falls GitHub nicht erreichbar ist, melde dies und kennzeichne ausdrücklich, wenn du ersatzweise aus einem lokalen Checkout liest.
- Lies für Format und Ton aktuelle, repräsentative Beiträge direkt aus GitHub. Bevorzuge Beispiele derselben Kategorie, Mannschaft oder Autorenschaft, sofern vorhanden.
- Lade nur die benötigten Dateien und Verzeichnislisten; klone das Repository nicht allein für Lesezugriffe.

## Arbeitsablauf

1. Prüfe vor Änderungen den Git-Status und bewahre vorhandene, nicht zugehörige Änderungen.
2. Lies die aktuellen Vorgaben direkt aus dem GitHub-Repository:
   - Artikelschema aus `content.config.ts`
   - Kategorien aus `app/app.config.ts`
   - gültige Autorenkennungen aus `content/users/`
   - verfügbare Inhaltskomponenten aus `app/components/content/` und vorhandenen Beiträgen
   - aktuelle, repräsentative Beispielbeiträge aus `content/blog/article/`
3. Inventarisiere Rohtext, Bilder, Anhänge, Links und ausdrücklich vorgegebene Metadaten.
4. Bestimme, ob der Benutzer einen fertig ausformulierten Text oder Rohmaterial liefert. Behandle zusammenhängenden, veröffentlichungsfähigen Fließtext ohne anderslautenden Auftrag als Fertigtext.
5. Trenne belegte Fakten von redaktionellen Ableitungen. Erfinde keine Namen, Ergebnisse, Termine, Zitate, Bildinhalte oder Quellen.
6. Lies `references/editorial-style.md` für jede inhaltliche Überarbeitung.
7. Lies `references/repository-conventions.md`, bevor du Dateien oder Frontmatter anlegst.
8. Lies `references/content-and-media.md`, sobald Bilder, Anhänge, tabellarische Daten oder besondere Prose-Komponenten vorkommen.
9. Erzeuge Beitrag und Assets in den vorgesehenen Repository-Pfaden.
10. Sortiere das Frontmatter verbindlich mit `title` zuerst und allen weiteren vorhandenen Top-Level-Feldern alphabetisch. Prüfe außerdem sämtliche neuen Datei- und Ordnernamen gegen das Namensschema.
11. Prüfe Inhalt, Metadaten, Links, Tabellen und Medien gegen die Quellen.
12. Führe die passenden Repository-Checks aus und behebe nur Fehler im eigenen Änderungssatz.
13. Erzeuge für jeden angelegten oder geänderten Beitrag eine passende Conventional-Commit-Nachricht nach den Regeln in `references/repository-conventions.md` und gib sie in der Übergabe aus.
14. Wenn ein Commit beauftragt ist, stage ausschließlich den eigenen Änderungssatz und verwende die vorgeschlagene Conventional-Commit-Nachricht.
15. Erstelle einen Draft-PR nur, wenn dies beauftragt ist und GitHub-Schreibzugriff besteht. Veröffentliche oder merge niemals eigenmächtig.
16. Lies `references/nuxt-studio-publishing.md` und arbeite direkt in Nuxt Studio ausschließlich dann, wenn der Benutzer dies ausdrücklich wünscht.

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
- Formuliere die `description` als einen kurzen, kartentauglichen Satz mit Anlass und wichtigstem Ergebnis. Ziele in der Regel auf 100 bis 140 Zeichen und überschreite 160 Zeichen nur, wenn wesentliche Fakten sonst verloren gehen.
- Ordne die vorhandenen Top-Level-Felder immer exakt so: zuerst `title`, danach alphabetisch nach Feldname. Das gilt auch für optionale und künftig ergänzte Felder.
- Halte für Beitrag, Assetordner und jede Assetdatei das verbindliche Schema aus `references/repository-conventions.md` ein. Normalisiere abweichende Eingaben und dokumentiere die Zuordnung.
- Verwende bei Berichten über Mannschaftskämpfe als `title` ausschließlich `Heimmannschaft - Gastmannschaft` mit den offiziellen Mannschaftsnamen und einem einfachen Bindestrich mit Leerzeichen. Ergänze weder Ergebnis noch Vorspann oder Untertitel.

## Tabellen aus Bildern

Übertrage klar erkennbare tabellarische Bildinhalte standardmäßig in echte Markdown-Tabellen.

- Bewahre Überschriften, Spalten, Zeilen, Reihenfolge, Schreibweisen, Dezimaltrennzeichen und leere Felder.
- Teile getrennte Bereiche wie „Stammspieler“ und „Ersatzspieler“ in eigene, beschriftete Tabellen.
- Prüfe jede Zelle noch einmal am Bild. Rekonstruiere unleserliche Werte nicht durch Raten.
- Erhalte das Bild nur auf ausdrücklichen Wunsch oder wenn Gestaltung, Diagramme oder unzuverlässig lesbare Inhalte einen zusätzlichen Informationswert haben.
- Dupliziere dieselben Daten nicht als Tabelle und Bild, sofern dies nicht begründet oder gewünscht ist.

## Redaktionelle Grenzen

- Behandle einen fertig ausformulierten Text standardmäßig als verbindlichen Originalwortlaut.
- Korrigiere darin nur Rechtschreibung, Grammatik, Zeichensetzung, Typografie und eindeutige Tippfehler.
- Bewahre Wortwahl, Satzbau, Reihenfolge, Absätze, Wiederholungen, Länge und persönliche Stimme. Straffe oder formuliere den Text nicht aus rein stilistischen Gründen um.
- Ergänze bei Bedarf sinnvolle Zwischenüberschriften, ohne den Originaltext umzuschreiben oder Absätze neu anzuordnen. Halte die Zwischenüberschriften innerhalb des Beitrags sprachlich und typografisch einheitlich und setze nicht für jeden kurzen Absatz eine Überschrift.
- Nimm weitergehende redaktionelle Änderungen nur vor, wenn der Benutzer sie ausdrücklich verlangt.
- Behalte bei einer möglicherweise sinnverändernden Korrektur den Originalwortlaut bei und dokumentiere die Unsicherheit.
- Entferne keine relevanten Ergebnisse, Danksagungen, Namen oder Anhänge.
- Schreibe neue Passagen natürlich, ungekünstelt und passend zur persönlichen Vereinssprache. Vermeide formelhafte Übergänge, symmetrische Muster, werbliche Zuspitzungen und andere typische KI-Floskeln.
- Verwende Doppelpunkte, Gedankenstriche, Klammern, Aufzählungen und kurze rhetorische Satzfragmente nur dort, wo sie im natürlichen Sprachfluss wirklich passen. Häufe diese Stilmittel nicht.
- Formuliere Titel und Beschreibung konkret, sachlich und ohne unbelegte Zuspitzung. Beachte für Mannschaftskämpfe das feste Titelschema.
- Ergänze technische Einbettungen wie Frontmatter, Links, Medien, semantische Tabellen sowie sinnvolle Nuxt-UI- oder Prose-Komponenten, ohne dadurch den Originaltext umzuschreiben oder neu anzuordnen.
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
- exakter Dateiname des angelegten oder geänderten Artikels in einer eigenen, leicht erkennbaren Zeile; verwende die Form `Dateiname: YYYYMMDD.slug.md` und setze den tatsächlichen Dateinamen als Inline-Code
- passende Conventional-Commit-Nachricht in einer eigenen, leicht erkennbaren Zeile; verwende die Form `Commit-Message: type(blog): kurze imperative Zusammenfassung` und gib sie auch dann aus, wenn kein Commit beauftragt wurde
- bei einem Fertigtext eine knappe Zusammenfassung der tatsächlich vorgenommenen Korrekturen außerhalb des Artikels; berichte `Korrekturen: keine`, wenn der Originaltext unverändert blieb
- gewählte oder abgeleitete Metadaten
- Ergebnis der Prüfung von Frontmatter-Reihenfolge und Dateinamensschema
- in Tabellen übertragene Bilddaten
- Qualitätswarnungen und offene Punkte
- ausgeführte Prüfungen und deren Ergebnis
- lokalen Entwurf oder URL des Draft-PRs
- bei einer beauftragten Direktveröffentlichung die öffentliche Artikel-URL und das Ergebnis der Erreichbarkeitsprüfung
