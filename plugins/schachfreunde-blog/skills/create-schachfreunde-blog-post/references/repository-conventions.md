# Repository-Konventionen

## Autoritative Quellen

- `content.config.ts`: Nuxt-Content-Schema für Artikel und Bilder
- `app/app.config.ts`: aktuell erlaubte Blogkategorien
- `content/users/*.{md,yaml}`: gültige Autorenkennungen
- `app/components/content/`: lokale Inhaltskomponenten
- `content/blog/article/`: repräsentative Syntax und bestehende Pfade

Lies diese Quellen bei jeder Verwendung neu. Behandle die hier genannten Werte nicht als Ersatz für den aktuellen Repository-Stand.

## Beitrag und Route

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
sitemap:
  loc: /blog/article/slug
status: draft
toc: true
---
```

- Lasse optionale Felder weg, statt Platzhalter einzutragen.
- Sortiere nur die Top-Level-Felder nach dieser Regel. Erhalte bei verschachtelten Objekten die semantisch vorgesehene Reihenfolge, zum Beispiel `src` vor `alt`, wenn das Repository-Schema oder bestehende Konventionen dies vorgeben.
- Setze `toc: true` nur bei einer sinnvollen Überschriftenstruktur.
- Verwende `tournament` nur bei einer belegten Zuordnung zu einem vorhandenen Turnier.
- Verwende `published` nur auf ausdrücklichen Wunsch.

## Prüfung

Prüfe vor den automatisierten Befehlen ausdrücklich:

- `title` ist das erste Frontmatter-Feld.
- Alle übrigen vorhandenen Top-Level-Felder sind alphabetisch sortiert.
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

Committe nur auf ausdrücklichen Wunsch und ausschließlich Dateien des eigenen Änderungssatzes. Verwende das Format:

```text
<type>(blog): <kurze imperative Zusammenfassung>
```

- `feat(blog): add <slug>` für einen neuen Beitrag
- `fix(blog): correct <slug>` für inhaltliche oder technische Korrekturen
- `refactor(blog): restructure <slug>` für eine strukturelle Überarbeitung ohne inhaltliche Änderung
- `chore(blog): optimize assets for <slug>` für reine Asset- oder Wartungsarbeiten

Halte die erste Zeile knapp, verwende keinen abschließenden Punkt und ergänze bei Bedarf einen Commit-Body für wesentliche Ableitungen, Umbenennungen oder bekannte Einschränkungen.
