![schachfreunde-biberach de](https://github.com/sfbiberach/schachfreunde-biberach.de/assets/22038857/68444f21-b306-4f77-9f83-53c2df2915b9)

# schachfreunde-biberach.de

[![Nuxt UI Pro](https://img.shields.io/badge/Made%20with-Nuxt%20UI%20Pro-00DC82?logo=nuxt.js&labelColor=020420)](https://ui.nuxt.com/pro)

Eine Homepage für die Schachfreunde HN-Biberach inkl. Blog auf Basis von [Nuxt UI Pro](https://ui.nuxt.com/pro).

Die Seite ist in einem frühen Stadium, weitere Details folgen.

## nuLiga und Cloudflare-Speicher

Mannschaftsaufstellungen und Ergebnisse werden serverseitig von nuLiga geladen und sechs Stunden zwischengespeichert. Lokal nutzt die Anwendung dafür `.data/nuliga-cache`.

Der produktive Cloudflare Worker deklariert zwei Bindings:

- `DB`: eine D1-Datenbank, die Nuxt Content für dynamische Inhaltsabfragen benötigt. Die Inhalte bleiben in Git; D1 enthält den daraus erzeugten Laufzeitindex.
- `NULIGA_CACHE`: ein KV-Namespace für den persistenten nuLiga-Cache.

Wrangler provisioniert fehlende Ressourcen beim ersten Deployment automatisch und verknüpft sie mit dem Worker. Account-spezifische Ressourcen-IDs oder zusätzliche Build-Umgebungsvariablen sind dafür nicht erforderlich. Nach dem ersten Deployment sollten beide Bindings im Cloudflare-Dashboard beim Worker sichtbar sein.
