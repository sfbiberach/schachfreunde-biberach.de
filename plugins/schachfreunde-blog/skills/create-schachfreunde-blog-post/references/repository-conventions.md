# Repository-Konventionen

## Autoritative Quellen

Rufe die folgenden Dateien und Verzeichnisse vor jeder Bearbeitung direkt aus dem aktuellen Standardbranch von [`sfbiberach/schachfreunde-biberach.de`](https://github.com/sfbiberach/schachfreunde-biberach.de) ab. Verwende bevorzugt die verbundene GitHub-App und ersatzweise `gh`. Ein lokaler Checkout ist Arbeitsziel und nur bei nicht verfügbarem GitHub-Zugriff eine ausdrücklich zu kennzeichnende Ersatzquelle.

- `content.config.ts`: Nuxt-Content-Schema für Artikel und Bilder
- `app/app.config.ts`: aktuell erlaubte Blogkategorien
- `content/users/*.{md,yaml}`: gültige Autorenkennungen
- `app/components/content/`: lokale Inhaltskomponenten
- `content/blog/article/`: repräsentative Syntax und bestehende Pfade

Lies diese Quellen bei jeder Verwendung neu. Wähle aktuelle Beispielbeiträge möglichst passend zu Kategorie, Mannschaft oder Autorenschaft. Behandle die hier genannten Werte nicht als Ersatz für den aktuellen GitHub-Stand.

## Beitrag und Route

### Titel von Mannschaftskämpfen

Verwende für Berichte über Mannschaftskämpfe ausschließlich das Schema `Heimmannschaft - Gastmannschaft`.

- Übernimm die offiziellen Mannschaftsnamen aus Quelle oder Repository.
- Verwende einen einfachen Bindestrich mit genau einem Leerzeichen davor und danach.
- Ergänze im Titel kein Ergebnis, keinen Spieltag, keinen Vorspann und keinen Untertitel.
- Nutze sinnvolle, sprachlich und typografisch einheitliche Zwischenüberschriften im Artikel, wenn sie die Orientierung verbessern.

### Datum von Mannschaftsberichten

Das Beitragsdatum eines Mannschaftsberichts ist das tatsächliche Spieldatum, nicht das Erstellungs-, Commit- oder Veröffentlichungsdatum.

- Übernimm ein ausdrücklich genanntes Spieldatum nur, wenn es zum beschriebenen Mannschaftskampf passt.
- Fehlt das Datum oder ist es unsicher, öffne die passende öffentliche Mannschaftsseite unter `/mannschaften/mannschaft-N`. Gleiche dort Heimteam, Auswärtsteam und Runde beziehungsweise Ergebnis mit dem Bericht ab.
- Nutze bei Bedarf den auf der Mannschaftsseite oder in `content/mannschaften/` hinterlegten `league.groupUrl`, um den Termin direkt in nuLiga zu bestätigen.
- Verwende niemals den aktuellen Tag, das Datum der Benutzeranfrage, einen Screenshot-Zeitstempel, das Dateierstellungsdatum oder das Commitdatum als Ersatz für das Spieldatum.
- Lässt sich kein Spiel eindeutig zuordnen, frage nach, bevor du Dateiname oder Frontmatter anlegst.
- Verwende das bestätigte Spieldatum sowohl als `date: YYYY-MM-DD` als auch als Präfix `YYYYMMDD` für Beitragsdatei und Assetordner.

Lege einen neuen Beitrag nach der aktuellen Konvention an:

```text
content/blog/article/YYYYMMDD.slug.md
```

Lege zugehörige Medien bei Bedarf ab unter:

```text
public/assets/blog/YYYYMMDD.slug/
```

Verwende im Frontmatter eine Route ohne Datumsprefix:

```yaml
sitemap:
  loc: /blog/article/slug
```

Prüfe vor dem Schreiben auf bestehende Slugs, Routen und Assetordner.

## Verbindliches Namensschema

- Beitragsdatei: `YYYYMMDD.<slug>.md`, wobei `YYYYMMDD` dem Beitragsdatum entspricht und genau acht Ziffern umfasst.
- Slug: ausschließlich kleingeschriebenes ASCII-Kebab-Case. Wandle `ä`, `ö`, `ü` und `ß` in `ae`, `oe`, `ue` und `ss` um, entferne sonstige Satz- und Sonderzeichen, ersetze Leerzeichen und Unterstriche durch einzelne Bindestriche und entferne führende, abschließende oder doppelte Bindestriche.
- Assetordner: exakt der Dateistamm des Beitrags unter `public/assets/blog/`, also `public/assets/blog/YYYYMMDD.<slug>/`.
- Assetdateien: aussagekräftiges kleingeschriebenes ASCII-Kebab-Case mit kleingeschriebener, zum tatsächlichen Format passender Dateiendung, zum Beispiel `mannschaft-vor-dem-spiel.webp` oder `kreuztabelle.pdf`.
- Vermeide generische Namen wie `image1`, `screenshot`, `scan`, `foto-neu`, `final`, `copy` und bedeutungslose IDs. Ergänze Nummern nur, wenn sie Reihenfolge oder Inhalt tatsächlich unterscheiden.
- Prüfe vor dem Schreiben auf Kollisionen. Normalisiere angelieferte Dateinamen nach diesen Regeln, sofern der Benutzer keinen bestimmten Namen ausdrücklich verlangt, und dokumentiere Umbenennungen.
- Die Sitemap-Route enthält nur den Slug und keinen Datumspräfix: `/blog/article/<slug>`.

## Verbindliche Frontmatter-Reihenfolge

`title` steht immer an erster Stelle. Sortiere danach alle übrigen vorhandenen Top-Level-Felder strikt alphabetisch nach Feldname. Diese Regel gilt auch für optionale oder künftig ergänzte Felder.

Verwende daher beispielsweise:

```yaml
---
title: Aussagekräftiger Titel
authors:
  - gueltige-autorenkennung
category: Vorhandene Kategorie
date: YYYY-MM-DD
description: Präzise Kurzbeschreibung
image:
  src: /assets/blog/YYYYMMDD.slug/dateiname.jpg
  alt: Konkreter Alternativtext
published: true
sitemap:
  loc: /blog/article/slug
toc: true
---
```

- Lasse optionale Felder weg, statt Platzhalter einzutragen.
- Sortiere nur die Top-Level-Felder nach dieser Regel. Erhalte bei verschachtelten Objekten die semantisch vorgesehene Reihenfolge, zum Beispiel `src` vor `alt`, wenn das Repository-Schema oder bestehende Konventionen dies vorgeben.
- Setze `toc: true` nur bei einer sinnvollen Überschriftenstruktur.
- Verwende `tournament` nur bei einer belegten Zuordnung zu einem vorhandenen Turnier.
- Gib `published` immer explizit als Boolean an. Verwende für neue Beiträge standardmäßig `true`; ein beauftragter Commit gilt dabei als Veröffentlichungsfreigabe. Setze ausdrücklich als Entwurf oder nicht öffentlich gekennzeichnete Inhalte auf `false`.
- Bewahre bei bestehenden Beiträgen ein vorhandenes `published: false` auch bei einem beauftragten Commit. Ändere den Wert nur auf ausdrücklichen Wunsch des Benutzers zu `true`.

## Prüfung

Prüfe vor den automatisierten Befehlen ausdrücklich:

- `title` ist das erste Frontmatter-Feld.
- Alle übrigen vorhandenen Top-Level-Felder sind alphabetisch sortiert.
- `published` ist vorhanden und enthält ausschließlich den Boolean `true` oder `false`.
- Beitrag, Assetordner und Assetdateien entsprechen vollständig dem Namensschema.
- Dateistamm des Beitrags und Name des Assetordners sind identisch.
- `sitemap.loc` verwendet den Slug ohne Datumspräfix.

Führe für Beitragsänderungen mindestens aus:

```text
pnpm contentcheck
pnpm lint
```

Führe nach Möglichkeit vor der Freigabe zusätzlich aus:

```text
pnpm generate
```

Verändere zur Behebung von Prüffehlern keine unbeteiligten Dateien.

## Git und Conventional Commits

Erzeuge für jeden angelegten oder geänderten Beitrag eine passende Conventional-Commit-Nachricht und gib sie im Abschlussbericht auf einer eigenen Zeile in der Form `Commit-Message: <Nachricht>` aus. Das gilt auch, wenn kein Commit beauftragt wurde.

Committe weiterhin nur auf ausdrücklichen Wunsch und ausschließlich Dateien des eigenen Änderungssatzes. Verwende für Empfehlung und tatsächlichen Commit das Format:

```text
<type>(blog): <kurze imperative Zusammenfassung>
```

- `feat(blog): add <slug>` für einen neuen Beitrag
- `fix(blog): correct <slug>` für inhaltliche oder technische Korrekturen
- `refactor(blog): restructure <slug>` für eine strukturelle Überarbeitung ohne inhaltliche Änderung
- `chore(blog): optimize assets for <slug>` für reine Asset- oder Wartungsarbeiten

Halte die erste Zeile knapp, verwende keinen abschließenden Punkt und ergänze bei Bedarf einen Commit-Body für wesentliche Ableitungen, Umbenennungen oder bekannte Einschränkungen.
