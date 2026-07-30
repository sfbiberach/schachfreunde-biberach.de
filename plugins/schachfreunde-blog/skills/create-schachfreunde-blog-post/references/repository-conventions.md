# Repository-Konventionen

## Autoritative Quellen

Bestimme nach der Bestandsaufnahme, welche veränderlichen Repositorydaten der konkrete Auftrag benötigt. Nutze einen geeigneten lokalen Checkout zuerst und prüfe seine Aktualität nur, wenn aktuelle Repositorydaten für den Inhalt relevant sind oder spätestens vor dem PR. Fehlt ein geeigneter Checkout, rufe die benötigten Pfade aus dem aktuellen Standardbranch von [`sfbiberach/schachfreunde-biberach.de`](https://github.com/sfbiberach/schachfreunde-biberach.de) bevorzugt über die GitHub-App und ersatzweise über `gh` ab. Ein fehlender lokaler Checkout ist allein kein Blocker.

- Neuer Beitrag oder geänderte Struktur: `content.config.ts`
- Gesetzte oder abzuleitende Kategorie: `app/app.config.ts`
- Ausdrücklich genannte oder anderweitig belegte Autorenschaft: nur den passenden Eintrag unter `content/users/` zur ID-Prüfung; lade keine Autorenliste allein wegen eines neuen Beitrags
- Besondere Inhaltskomponente: `app/components/content/` und ein vorhandenes Nutzungsbeispiel
- Rohmaterial oder unklare Syntax beziehungsweise Tonalität: wenige passende Dateien unter `content/blog/article/`
- Turnierbezug: passende Dateien unter `content/turniere/` und bei Bedarf bestehende Artikelzuordnungen

Lade keine vollständigen Verzeichnisinhalte, wenn ein gezielter Pfad oder Treffer ausreicht. Prüfe unveränderte Metadaten eines bestehenden Beitrags nicht erneut gegen sämtliche Autoren und Kategorien.

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
tournament: vorhandener-turnier-slug
---
```

- Lasse optionale Felder weg, statt Platzhalter einzutragen.
- Sortiere nur die Top-Level-Felder nach dieser Regel. Erhalte bei verschachtelten Objekten die semantisch vorgesehene Reihenfolge, zum Beispiel `src` vor `alt`, wenn das Repository-Schema oder bestehende Konventionen dies vorgeben.
- Setze `toc: true` nur bei einer sinnvollen Überschriftenstruktur.
- Wenn ein Beitrag ein vorhandenes Turnier ankündigt, begleitet oder darüber berichtet, ist `tournament` verpflichtend.
- Verwende als Wert exakt den Slug der passenden Seite aus `content/turniere/`, beispielsweise `biber-jugend-cup` für `/turniere/biber-jugend-cup`. Die Turnierseite filtert ihre „Turnierberichte“ nach diesem exakten Wert.
- Gleiche Turniername, Thema und vorhandene Artikelzuordnungen ab. Erfinde keinen Turnier-Slug. Frage nach, wenn kein vorhandenes Turnier eindeutig passt oder mehrere Zuordnungen möglich sind.
- Lasse `tournament` nur bei Beiträgen ohne Bezug zu einem vorhandenen Turnier weg.
- Gib `published` immer explizit als Boolean an. Verwende für neue Beiträge standardmäßig `true`; ein beauftragter Commit gilt dabei als Veröffentlichungsfreigabe. Setze ausdrücklich als Entwurf oder nicht öffentlich gekennzeichnete Inhalte auf `false`.
- Bewahre bei bestehenden Beiträgen ein vorhandenes `published: false` auch bei einem beauftragten Commit. Ändere den Wert nur auf ausdrücklichen Wunsch des Benutzers zu `true`.
- Verwende kein Frontmatter-Feld `status`; es gehört nicht zum aktuellen Artikelschema. Bilde den Veröffentlichungszustand ausschließlich mit dem Boolean `published` ab. Entferne ein übernommenes `status: draft` und verwende für neue Beiträge standardmäßig `published: true`; nur ein ausdrücklich nicht öffentlicher Entwurf erhält `published: false`.

## Prüfung

Prüfe vor den automatisierten Befehlen ausdrücklich:

- `title` ist das erste Frontmatter-Feld.
- Alle übrigen vorhandenen Top-Level-Felder sind alphabetisch sortiert.
- `published` ist vorhanden und enthält ausschließlich den Boolean `true` oder `false`.
- Beitrag, Assetordner und Assetdateien entsprechen vollständig dem Namensschema.
- Dateistamm des Beitrags und Name des Assetordners sind identisch.
- `sitemap.loc` verwendet den Slug ohne Datumspräfix.
- Bei einem Beitrag über ein vorhandenes Turnier ist `tournament` gesetzt und entspricht exakt einem Slug aus `content/turniere/`.

Führe bei einem lokalen Checkout für Beitragsänderungen aus:

```text
pnpm lint
```

`pnpm lint` führt `pnpm contentcheck` bereits aus; starte `contentcheck` nicht zusätzlich. Ohne Checkout führe keinen lokalen Paketbefehl auf Verdacht aus, sondern prüfe die oben genannten Regeln direkt und verwende die PR-CI als ausführbaren Nachweis. Verwende `pnpm generate` nicht als Prüfung für Blogbeiträge. Führe im normalen Artikelablauf keinen vollständigen Produktions-Build aus. Wenn der Benutzer ausdrücklich einen Build oder die Diagnose eines konkreten Build- beziehungsweise Deploymentfehlers beauftragt und ein Checkout vorhanden ist, führe aus:

```text
pnpm build
```

Verändere zur Behebung von Prüffehlern keine unbeteiligten Dateien.

## Git und Conventional Commits

Erzeuge für jeden angelegten oder geänderten Beitrag eine passende Conventional-Commit-Nachricht und gib sie im Abschlussbericht auf einer eigenen Zeile in der Form `Commit-Message: <Nachricht>` aus. Das gilt auch, wenn kein Commit beauftragt wurde. Formuliere Commit-Betreff und optionalen Commit-Body standardmäßig auf Englisch. Verwende eine andere Sprache nur auf ausdrücklichen Wunsch; die Sprache des Blogartikels bleibt davon unberührt.

Bei einem ausdrücklich gewünschten lokalen Entwurf committe nur auf ausdrücklichen Wunsch. Der standardmäßige GitHub-PR-Ablauf umfasst bei lokalem Git Branch, Commit, Push und PR; bei GitHub-only erzeugt er denselben abgegrenzten Änderungssatz direkt auf einem Branch und öffnet daraus den PR. Verwende in beiden Wegen für Empfehlung, Commit beziehungsweise PR-Titel das Format:

```text
<type>(blog): <short imperative summary>
```

- `feat(blog): add <slug>` für einen neuen Beitrag
- `fix(blog): correct <slug>` für inhaltliche oder technische Korrekturen
- `refactor(blog): restructure <slug>` für eine strukturelle Überarbeitung ohne inhaltliche Änderung
- `chore(blog): optimize assets for <slug>` für reine Asset- oder Wartungsarbeiten

Halte die erste Zeile knapp, verwende keinen abschließenden Punkt und ergänze bei Bedarf einen Commit-Body für wesentliche Ableitungen, Umbenennungen oder bekannte Einschränkungen.

## GitHub-PR als Standardergebnis

Behandle jeden Auftrag zum Erstellen oder Überarbeiten eines Beitrags standardmäßig als Auftrag, einen veröffentlichungsfertigen GitHub-PR anzulegen. Ein ausschließlich lokaler Entwurf entsteht nur auf ausdrücklichen Wunsch oder wenn kein GitHub-Schreibzugriff verfügbar ist. Nutze Nuxt Studio statt des PR-Ablaufs nur, wenn der Benutzer es ausdrücklich verlangt. Formuliere PR-Titel und PR-Beschreibung standardmäßig auf Englisch. Verwende eine andere Sprache nur auf ausdrücklichen Wunsch.

1. Prüfe, ob die GitHub-Verbindung eingerichtet ist und Schreibzugriff auf `sfbiberach/schachfreunde-biberach.de` besteht. Fehlt der Zugriff, liefere den vollständigen Entwurf mit exakten Zielpfaden und benenne die fehlende Verbindung, statt einen PR vorzutäuschen.
2. Erstelle vom aktuellen Standardbranch einen eigenen Branch lokal oder direkt über GitHub. Verwende für einen neuen Beitrag nach Möglichkeit `blog/<slug>` und wähle bei einer Kollision einen eindeutigen, weiterhin knappen Namen.
3. Übertrage ausschließlich Beitrag und Assets des eigenen Änderungssatzes. Committe und pushe bei lokalem Git; erstelle bei GitHub-only dieselben Dateiänderungen direkt auf dem Zielbranch.
4. Öffne einen PR und verwende die Conventional-Commit-Nachricht unverändert als PR-Titel.
5. Prüfe verfügbare CI-Ergebnisse. Wenn kein lokaler Checkout vorhanden war, benenne die CI als alleinigen ausführbaren Nachweis und behaupte keinen lokalen Lintlauf.
6. Halte die PR-Beschreibung kurz. Nenne in ein bis drei Sätzen oder knappen Punkten den Anlass beziehungsweise Inhalt, den exakten Artikelnamen und gegebenenfalls die hinzugefügten Assets. Führe die ausgeführten Prüfungen nicht eigens in der PR-Beschreibung auf.
7. Erstelle den PR standardmäßig als bereit zur Prüfung. Verwende den GitHub-Draft-PR-Status nur auf ausdrücklichen Wunsch. Dieser GitHub-Status ist kein Artikelmetadatum und darf niemals als `status: draft` im Frontmatter erscheinen.
8. Merge den PR nur auf ausdrücklichen Auftrag. Ein erstellter PR allein veröffentlicht den Beitrag nicht; erst der Merge in den Veröffentlichungsbranch löst das Deployment aus.
9. Prüfe nach einem ausdrücklich beauftragten Merge das Deployment und die öffentliche Beitragsroute. Melde ein fehlgeschlagenes Deployment, statt denselben Merge oder Commit zu wiederholen.
