# Direkt über Nuxt Studio veröffentlichen

Nutze diesen Ablauf ausschließlich, wenn der Benutzer ausdrücklich verlangt, den Beitrag direkt auf `schachfreunde-biberach.de` bzw. über Nuxt Studio anzulegen oder zu veröffentlichen. Ein allgemeiner Auftrag zum Erstellen oder Vorbereiten eines Beitrags autorisiert diesen externen Schreib- und Commitvorgang nicht.

## Einstieg und Anmeldung

1. Öffne die öffentliche Website in einer Browser-Sitzung mit dem benötigten GitHub-Zugang.
2. Verwende unten links `Nuxt Studio öffnen` bzw. nach der Anmeldung `Edit this page`. Alternativ öffne `/_studio` auf der Website. Lies die aktuell konfigurierte Repository-Zuordnung und den Zielbranch vorher aus `nuxt.config.ts`; verwende keine geratene Studio-URL oder Branch-Angabe.
3. Melde dich nur bei Bedarf über den angebotenen Nuxt-Studio-/GitHub-Login an. Eine sichtbare Benutzerkennung unten links bestätigt die angemeldete Sitzung.
4. Prüfe vor Änderungen, dass Studio das erwartete Repository und den vorgesehenen Branch verwendet.

## Beitrag und Assets anlegen

1. Öffne `Content > Blog > Article`.
2. Wähle im Verzeichnismenü `New file` und lege die Markdown-Datei exakt nach `YYYYMMDD.<slug>.md` an. Studio zeigt die Erweiterung getrennt an; gib den Dateistamm nicht doppelt mit `.md` ein.
3. Erstelle Frontmatter und Inhalt nach `repository-conventions.md`. Verlasse dich nicht auf die von Studio aus Titel oder Route abgeleitete Schreibweise.
4. Öffne für Medien `Media > public > assets > blog`.
5. Lege den Assetordner exakt als `YYYYMMDD.<slug>` an und lade ausschließlich passend normalisierte Dateien hinein. Prüfe nach dem Upload den im Frontmatter verwendeten absoluten Pfad `/assets/blog/YYYYMMDD.<slug>/<dateiname>`.
6. Warte nach Dateiwechseln, bis Editor und rechte Live-Preview vollständig aktualisiert sind. Eine kurzzeitig alte Route oder eine 404-Preview ist noch kein belastbares Prüfergebnis.

## Visuelle Prüfung

- Öffne die echte Beitragsroute in der rechten Preview und prüfe Titel, Beschreibung, Autorenanzeige, Kategorie, Datum, Überschriften, Tabellen, Links, Inhaltsverzeichnis und mobilen Lesefluss.
- Prüfe Bilder zusätzlich über ihre konkrete Asset-URL und in der gerenderten Beitragsseite. Die Medienbibliothek dieser Website kann für vorhandene Bilddateien eine defekte `File preview` anzeigen; dieses Thumbnail allein beweist weder einen fehlerhaften Upload noch eine funktionierende Einbindung.
- Kontrolliere bei jedem Bild Pfad, Dateiname, Format, Alternativtext, Abmessungen, Seitenverhältnis und sichtbare Darstellung. Prüfe insbesondere, dass keine Groß-/Kleinschreibung oder fehlende Datums-/Slug-Bestandteile den Pfad brechen.
- Beachte Hinweise wie `Formatting applied to align with MDC syntax standard`. Öffne `See what's changed` und prüfe den Formatierungsdiff; Studio kann beim Laden oder Bearbeiten Zeilen neu umbrechen. Übernimm keine unbeabsichtigten Formatierungsänderungen.

## Review und Commit

1. Öffne erst nach der vollständigen Seiten- und Assetprüfung oben rechts `Review`.
2. Prüfe jede als erstellt, geändert oder gelöscht markierte Datei. Der Review darf nur den beauftragten Beitrag und dessen Assets enthalten.
3. Prüfe den endgültigen Diff erneut auf Frontmatter-Reihenfolge, `published`, Dateinamen, Assetpfade, Tabellenwerte, unbeabsichtigte MDC-Formatierung und Textverluste. Gleiche bei Mannschaftsberichten das Spieldatum noch einmal mit der Mannschaftsseite beziehungsweise nuLiga ab.
4. Verwende eine Conventional-Commit-Nachricht nach `repository-conventions.md`, für einen neuen Beitrag normalerweise `feat(blog): add <slug>`.
5. Führe den Studio-Commit nur aus, wenn die ausdrückliche Direktveröffentlichung weiterhin vom Auftrag gedeckt ist. Studio schreibt damit unmittelbar in den in `nuxt.config.ts` konfigurierten Branch und löst dessen Deployment aus.
6. Warte auf die Synchronisierung bzw. das Deployment und prüfe danach die öffentliche Beitragsroute und alle Assets erneut. Melde Konflikte oder ein fehlgeschlagenes Deployment, statt blind erneut zu committen.

Entwürfe liegen bis zum Studio-Commit lokal im Browser. Verlasse eine Sitzung nicht mit fremden oder unbeabsichtigten Entwürfen; verwerfe eigene Teständerungen vollständig.