![Aktuelle Vorschau der Website](.github/assets/readme-homepage.png)

# schachfreunde-biberach.de

[![Nuxt UI Pro](https://img.shields.io/badge/Made%20with-Nuxt%20UI%20Pro-00DC82?logo=nuxt.js&labelColor=020420)](https://ui.nuxt.com/pro)

Eine Homepage für die Schachfreunde HN-Biberach inkl. Blog auf Basis von [Nuxt UI Pro](https://ui.nuxt.com/pro).

Die Seite ist in einem frühen Stadium, weitere Details folgen.

## Medien aktualisieren

Die Vorschau am Anfang dieser README wird aus der laufenden Nuxt-Seite gerendert:

```powershell
pnpm media:readme
```

Für Link-Previews erzeugt Nuxt automatisch OG-Bilder im Format 1200 × 630. Zusätzlich lassen sich dieselben Motive lokal als Social-Post-Bilder exportieren:

```powershell
pnpm media:social -- --path /blog/article/15-biber-jugend-cup --format all
```

`--format` unterstützt `og`, `square`, `portrait` und `all`. Die Exporte landen im git-ignorierten Ordner `.artifacts/social`. Vor dem ersten README-Export muss Chromium einmalig installiert werden:

```powershell
pnpm exec playwright install chromium
```

## Codex-Skill für Blogbeiträge

Das Repository enthält das Codex-Plugin `schachfreunde-blog`. Sein Skill erstellt oder überarbeitet Blogbeiträge aus Stichpunkten, Fließtext, Bildern, Tabellen und vorhandenen Entwürfen. Er kennt die Konventionen dieses Repositories, prüft Metadaten und Inhalte und erstellt bei neuen oder geänderten Artikeln standardmäßig einen Pull Request.

### Voraussetzungen

- Eine aktuelle [Codex CLI](https://developers.openai.com/codex/cli/) oder die Codex Desktop App
- Git
- Ein lokaler Klon dieses Repositories nur für die Entwicklung am Skill

Mit `codex --version` lässt sich prüfen, ob die CLI verfügbar ist.

### Installieren

Ohne lokalen Klon den Marketplace direkt aus GitHub registrieren und danach das Plugin installieren:

```powershell
codex plugin marketplace add sfbiberach/schachfreunde-biberach.de --ref main
codex plugin add schachfreunde-blog@schachfreunde-biberach
```

Wer im lokalen Repository am Skill arbeitet, registriert stattdessen im Stammverzeichnis den lokalen Marketplace:

```powershell
codex plugin marketplace add .
codex plugin add schachfreunde-blog@schachfreunde-biberach
```

Nur eine der beiden Marketplace-Quellen verwenden. Der Marketplace muss nur einmal registriert werden. Anschließend Codex neu starten oder einen neuen Task öffnen, damit der Skill geladen wird.

Die Installation lässt sich so kontrollieren:

```powershell
codex plugin list
```

Als installiert sollte `schachfreunde-blog@schachfreunde-biberach` erscheinen.

### Aktualisieren

Neue Repository- und Skill-Versionen werden mit denselben Plugin-Befehlen übernommen:

```powershell
git pull
codex plugin add schachfreunde-blog@schachfreunde-biberach
```

Danach Codex neu starten oder einen neuen Task öffnen. Maintainer müssen bei Änderungen am Plugin zusätzlich die Version beziehungsweise den Cachebuster in [`plugins/schachfreunde-blog/.codex-plugin/plugin.json`](plugins/schachfreunde-blog/.codex-plugin/plugin.json) aktualisieren, damit Codex die neue Fassung sicher erkennt.

### Benutzen

Der Skill wird automatisch ausgewählt, wenn sich die Anfrage auf einen Blogbeitrag der Schachfreunde Biberach bezieht. Es ist kein besonderer Befehl erforderlich. Beispiele:

```text
Erstelle aus diesen Stichpunkten einen Blogbeitrag für die Schachfreunde:
...
```

```text
Überarbeite den bestehenden Bericht zum letzten Mannschaftskampf.
Korrigiere nur Rechtschreibung und Zeichensetzung.
```

```text
Erstelle aus diesem Foto und meinen Notizen einen Beitrag.
Übernimm die abgebildete Ergebnistabelle als echte Tabelle.
```

```text
Erstelle nur einen lokalen Entwurf und noch keinen Pull Request.
```

Der Skill macht zuerst eine kurze Bestandsaufnahme und lädt nur die Quellen, Werkzeuge und Prüfungen, die für den konkreten Auftrag nötig sind. Ist kein lokaler Checkout vorhanden, liest und bearbeitet er die benötigten Dateien gezielt über GitHub; ein fehlender lokaler Klon ist allein kein Grund für eine Rückfrage. Fehlende optionale Angaben werden nach Möglichkeit sicher aus dem Repository abgeleitet. Ergebnisse, Namen, Termine, Bildrechte oder andere wesentliche Fakten werden nicht geraten; bei echten Blockern stellt der Skill eine gebündelte Rückfrage.

Standardmäßig entsteht ein publikationsfertiger Pull Request. Ein rein lokaler Entwurf oder eine direkte Veröffentlichung über Nuxt Studio erfolgt nur, wenn dies ausdrücklich verlangt wird.

### Entwicklung und Tests

Die Skill-Dateien liegen unter [`plugins/schachfreunde-blog`](plugins/schachfreunde-blog). Das Eval-Setup und die dokumentierten Testfälle befinden sich unter [`tests/skill-evals/blog-post`](tests/skill-evals/blog-post).

```powershell
pnpm skill:eval
pnpm skill:eval -- --model gpt-5.6-luna --reasoning low --runs 3
pnpm skill:eval:smoke
pnpm skill:eval:integration -- --model gpt-5.6-luna --reasoning low --runs 3
```

`skill:eval` prüft Routing, Rückfragen und benötigte Quellen in einem isolierten Verzeichnis, das keine Erwartungswerte enthält. `skill:eval:integration` erzeugt ein bereinigtes temporäres Git-Repository und prüft echte Dateiänderungen. Beide Modell-Evals benötigen eine funktionierende Codex-Anmeldung. Für belastbare Laufzeit- und Tokenvergleiche mindestens drei Wiederholungen verwenden. Nach einer Skill-Änderung sollten außerdem `pnpm lint` und `pnpm test` ausgeführt werden.

### Probleme beheben oder deinstallieren

Wenn zwei ähnlich benannte Plugins angezeigt werden, mit `codex plugin list --available --json` deren Marketplace und Installationsstatus prüfen. Aktiv sein sollte ausschließlich:

```text
schachfreunde-blog@schachfreunde-biberach
```

Ein falsches Plugin immer über seinen vollständigen Selektor entfernen:

```powershell
codex plugin remove <plugin-name>@<marketplace-name>
```

Das richtige Plugin wird so deinstalliert:

```powershell
codex plugin remove schachfreunde-blog@schachfreunde-biberach
```

## nuLiga und Cloudflare-Speicher

Mannschaftsaufstellungen und Ergebnisse werden serverseitig von nuLiga geladen und sechs Stunden zwischengespeichert. Lokal nutzt die Anwendung dafür `.data/nuliga-cache`.

Der produktive Cloudflare Worker deklariert zwei Bindings:

- `DB`: eine D1-Datenbank, die Nuxt Content für dynamische Inhaltsabfragen benötigt. Die Inhalte bleiben in Git; D1 enthält den daraus erzeugten Laufzeitindex.
- `NULIGA_CACHE`: ein KV-Namespace für den persistenten nuLiga-Cache.

Wrangler provisioniert fehlende Ressourcen beim ersten Deployment automatisch und verknüpft sie mit dem Worker. Account-spezifische Ressourcen-IDs oder zusätzliche Build-Umgebungsvariablen sind dafür nicht erforderlich. Nach dem ersten Deployment sollten beide Bindings im Cloudflare-Dashboard beim Worker sichtbar sein.
