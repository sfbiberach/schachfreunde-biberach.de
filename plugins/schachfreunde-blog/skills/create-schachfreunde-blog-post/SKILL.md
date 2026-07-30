---
name: create-schachfreunde-blog-post
description: Create or revise publication-ready blog posts for schachfreunde-biberach.de from text, notes, images, attachments, or existing drafts; preserve finished source text, derive Nuxt Content metadata without inventing facts, process media when present, validate repository conventions, and create a GitHub pull request by default. Use for creating, importing, correcting, updating, staging, or explicitly publishing Schachfreunde blog articles.
---

# Schachfreunde-Blogbeitrag erstellen

Erstelle oder überarbeite einen sprachlich, technisch und visuell geprüften Beitrag für `schachfreunde-biberach.de`. Wähle den kleinsten Ablauf, der für das bereitgestellte Material nötig ist.

## 1. Zuerst inventarisieren

Prüfe vor Repository-, GitHub- oder Webabfragen ausschließlich Auftrag und bereitgestelltes Material:

- Vorgang: neuer Beitrag, Überarbeitung, lokaler Entwurf oder ausdrücklich direkte Studio-Veröffentlichung
- Textstatus: fertig ausformulierter Text, Rohmaterial oder bestehender Beitrag
- Inhaltstyp: allgemein, Mannschaftskampf, Turnier oder Kombination daraus
- Material: Text, Bilder, Tabellenbilder, Anhänge und Links
- ausdrücklich gelieferte Metadaten und Quellen
- erkennbare Widersprüche oder rechtliche Unsicherheiten

Behandle zusammenhängenden, veröffentlichungsfähigen Fließtext als Fertigtext. Fahre bei optionalen fehlenden Angaben mit sicheren Ableitungen oder ohne das optionale Feld fort. Frage zu diesem Zeitpunkt noch nicht nach.

## 2. Nur benötigte Quellen lesen

Lies `references/editorial-style.md` bei jeder Textbearbeitung. Lies `references/repository-conventions.md`, bevor du Beitrag, Frontmatter, Assets oder Git-Änderungen anlegst. Wenn bereits die Bestandsaufnahme einen Identifizierungsblocker zeigt, lade zunächst nur die zur Auflösung nötigen Fachquellen; Stil- und Repositoryregeln folgen erst nach der Klärung.

Lade weitere Quellen ausschließlich bei passendem Bedarf:

| Bedarf | Zusätzliche Quelle |
| --- | --- |
| bestehender Beitrag | nur den Zielbeitrag und unmittelbar betroffene Dateien |
| neuer Beitrag oder geänderte Metadaten | `content.config.ts`; Kategorien nur bei gesetzter oder abzuleitender Kategorie; Autoren nur zur ID-Prüfung einer ausdrücklich genannten oder anderweitig belegten Person, niemals allein weil der Beitrag neu ist |
| Rohmaterial oder unklare Syntax beziehungsweise Tonalität | wenige aktuelle, passende Beispielbeiträge |
| besondere Inhaltskomponente | `app/components/content/` und ein passendes Nutzungsbeispiel |
| Mannschaftskampf | passende Mannschaftsseite; wenn sie den Kampf nicht eindeutig belegt, prüfe vor jeder Rückfrage zwingend die verlinkte nuLiga-Runde |
| vorhandenes Turnier | passende Dateien aus `content/turniere/` und bei Bedarf bestehende Zuordnungen |
| Bilder, Tabellenbilder oder Anhänge | `references/content-and-media.md` |
| ausdrücklich Nuxt Studio | `references/nuxt-studio-publishing.md`; bei einem unverändert vorbereiteten Zielbeitrag nur Zielbeitrag und Studio-Anleitung, Repositoryregeln erst bei Inhalts- oder Metadatenänderungen |

Wähle nach der Bestandsaufnahme genau einen Repositoryzugang:

- **Geeigneter lokaler Checkout vorhanden:** Nutze die lokalen Dateien zuerst. Prüfe den aktuellen Standardbranch nur, wenn veränderliche Repositorydaten für den Inhalt relevant sind oder spätestens vor dem PR. Entspricht der Checkout bereits demselben Commit, vermeide doppelte GitHub-Lesezugriffe.
- **Kein geeigneter lokaler Checkout:** Nutze den aktuellen Standardbranch von [`sfbiberach/schachfreunde-biberach.de`](https://github.com/sfbiberach/schachfreunde-biberach.de) über die GitHub-App und ersatzweise `gh`. Lade nur die ausgewählten Pfade und führe den Auftrag bei vorhandenem GitHub-Schreibzugriff vollständig über Branch, Dateiänderungen und PR aus. Frage nicht allein wegen des fehlenden Checkouts nach einem lokalen Pfad.
- **Weder Checkout noch GitHub-Lesezugriff:** Stelle eine Sammelfrage nur dann, wenn die benötigten Repositoryregeln oder Zieldateien nicht aus dem bereitgestellten Material hervorgehen.

Lies nicht pauschal sämtliche Autoren, Komponenten, Beispiele, Mannschaften oder Turniere.

**Stop-Regel:** Bleibt ein Zielbeitrag, Mannschaftskampf oder Turnier nach den ausgewählten Fachquellen nicht eindeutig identifizierbar, lade keine Stil-, Schema-, Beispiel-, Medien- oder Repositoryquellen und beginne keine Umsetzung. Stelle sofort die eine Sammelfrage aus Abschnitt 3; weitere Quellen und Arbeitsschritte folgen erst nach der Antwort.

## 3. Ableiten, bevor du fragst

Erfinde keine Namen, Ergebnisse, Termine, Zitate, Bildinhalte oder Quellen. Verwende folgende sicheren Regeln ohne Rückfrage:

- Bewahre bei bestehenden Beiträgen unveränderte Metadaten.
- Leite `title`, `description`, Slug und `sitemap.loc` deterministisch aus Material und Repositoryregeln ab.
- Verwende für einen neuen allgemeinen Beitrag ohne anderes belegtes Beitragsdatum das aktuelle lokale Redaktionsdatum. Für Mannschaftsberichte gilt ausschließlich das tatsächliche Spieldatum.
- Übernimm eine belegte Autorenschaft; ist keine vorhanden, lasse das optionale Feld weg.
- Leite bei einem neuen allgemeinen Beitrag mit klar erkennbarem Thema eine vorhandene Kategorie ab und prüfe dafür gezielt die Kategorienliste; ist sie nicht eindeutig, lasse das optionale Feld weg.
- Setze bei neuen Beiträgen `published: true`, außer der Benutzer bezeichnet sie ausdrücklich als nicht öffentlich. Bewahre bei bestehenden Beiträgen `published: false`.
- Setze `toc` nur bei einer sinnvollen Überschriftenstruktur.
- Verwende ein Artikelbild nur bei geeignetem und freigegebenem Material.
- Setze `tournament` nur bei tatsächlichem Bezug zu einem vorhandenen Turnier und dann auf dessen exakten Slug.

Frage erst nach den gezielten Nachforschungen und nur, wenn mindestens ein echter Blocker bleibt:

- Zielbeitrag oder beschriebener Mannschaftskampf ist nicht eindeutig identifizierbar.
- Eine zentrale faktische Angabe ist widersprüchlich oder nicht belegbar und kann nicht entfallen.
- Das tatsächliche Spieldatum eines Mannschaftsberichts bleibt offen.
- Mehrere Turnierzuordnungen sind plausibel oder ein erforderliches Turnier fehlt.
- Bild-, Personen- oder Veröffentlichungsrechte sind materiell unklar. Frage nicht nach Bildrechten, wenn ein Bild ausschließlich als Quelle für übertragene Daten dient und selbst nicht veröffentlicht wird.
- Benutzeranweisungen zum Veröffentlichungsweg widersprechen einander.

Bündele alle verbleibenden Blocker in genau einer Sammelfrage; stelle nicht mehrere Einzelfragen und eröffne höchstens eine Rückfragerunde. Frage nicht nach optionaler Autorenschaft, optionaler Kategorie, ableitbarer Beschreibung, ableitbarem Slug oder dem standardmäßigen PR-Ablauf.

## 4. Inhalt bearbeiten

- Bewahre bei Fertigtext Wortwahl, Satzbau, Reihenfolge, Absätze, Wiederholungen, Länge und persönliche Stimme.
- Korrigiere darin nur Rechtschreibung, Grammatik, Zeichensetzung, Typografie und eindeutige Tippfehler, sofern keine weitergehende Bearbeitung verlangt wurde.
- Ergänze bei Bedarf einheitliche Zwischenüberschriften, ohne den Originaltext umzuschreiben oder neu anzuordnen.
- Formuliere aus Rohmaterial natürliches, sachliches Deutsch ohne KI-Floskeln, Clickbait oder erfundene Dramatisierung.
- Übertrage klar lesbare Tabellenbilder nach `references/content-and-media.md` in echte Markdown-Tabellen.
- Verwende Komponenten nur, wenn sie die Lesbarkeit gegenüber Standard-Markdown tatsächlich verbessern.

## 5. Implementieren und prüfen

1. Prüfe bei einem lokalen Checkout unmittelbar vor Änderungen den Git-Status und bewahre fremde Änderungen. Prüfe bei GitHub-only den aktuellen Zielbranch und verändere ausschließlich die ausgewählten Pfade.
2. Lege Beitrag und benötigte Assets nach `references/repository-conventions.md` lokal oder über GitHub an.
3. Prüfe Fakten, Frontmatter, Dateinamen, Links und Medien gegen die tatsächlich verwendeten Quellen.
4. Führe `pnpm lint` ausschließlich bei einem lokalen Checkout aus; dieses Skript enthält bereits `pnpm contentcheck`. Führe `pnpm contentcheck` nicht zusätzlich aus. Plane bei GitHub-only keinen lokalen Lintschritt, validiere die editierbaren Regeln direkt und verwende die PR-CI als ausführbaren Nachweis.
5. Verwende `pnpm build` nur auf ausdrücklichen Wunsch oder zur Diagnose eines konkreten Build- beziehungsweise Deploymentfehlers. Verwende `pnpm generate` nicht für den normalen Artikelablauf.
6. Behebe ausschließlich Fehler im eigenen Änderungssatz.

## 6. Übergeben oder veröffentlichen

Ein allgemeiner Auftrag zum Erstellen oder Überarbeiten eines Beitrags führt ohne verbleibenden Blocker standardmäßig zu einem veröffentlichungsfertigen GitHub-PR. Dieser vollständige Übergabeweg gehört zum geplanten Ablauf, auch wenn eine vorgeschaltete Analyse ihn noch nicht ausführt:

1. Prüfe den GitHub-Schreibzugriff.
2. Erstelle einen eigenen Branch lokal oder über GitHub.
3. Übertrage ausschließlich den eigenen Änderungssatz; committe lokal oder erstelle die entsprechenden GitHub-Dateiänderungen.
4. Pushe bei lokalem Git und öffne in beiden Zugangswegen einen zur Prüfung bereiten PR mit englischem Conventional-Commit-Titel.
5. Prüfe verfügbare CI-Ergebnisse; war lokal kein Lint möglich, kennzeichne die CI als alleinigen ausführbaren Nachweis.

Erstelle nur bei ausdrücklichem Wunsch oder fehlendem GitHub-Schreibzugriff ausschließlich einen lokalen beziehungsweise als Dateien klar übergebbaren Entwurf. Nutze Nuxt Studio statt des PR-Ablaufs nur auf ausdrücklichen Wunsch. Merge niemals ohne ausdrücklichen Auftrag.

Berichte abschließend knapp:

- geänderte Beitrags- und Assetdateien
- `Dateiname: <tatsächlicher Dateiname>`
- `Commit-Message: <englische Conventional-Commit-Nachricht>`
- bei Fertigtext die vorgenommenen Korrekturen oder `Korrekturen: keine`
- nicht offensichtliche Ableitungen und verbleibende offene Punkte, aber keine leeren Standardrubriken
- ausgeführte Prüfung und Ergebnis
- PR-URL oder Grund für einen lokalen Entwurf
- nach beauftragtem Merge oder direkter Veröffentlichung die geprüfte öffentliche URL
