KOD KUMA — Cloudflare Pages

AKTIVNO STANJE — 04.10.2026.
- Online narudžbe su privremeno deaktivirane.
- Narudžbe se usmjeravaju na telefonski broj +385 92 460 5349.
- Stranica narudzba.html ostaje aktivna kao profesionalna landing stranica za telefonske narudžbe, tako da postojeći/stari linkovi ne završavaju na 404 stranici.
- /api/order je namjerno blokiran (HTTP 410), pa stara spremljena forma ne može poslati narudžbu.

PONOVNA AKTIVACIJA ONLINE NARUDŽBI
Originalna online forma i Cloudflare Pages Function spremljene su u:
/_online-order-backup/

Datoteke:
- narudzba-online-original.source.txt
- order-api-original.source.txt
- README-REAKTIVACIJA.txt

assets/js/main.js i dalje sadrži postojeću logiku izračuna i slanja narudžbe, ali je neaktivna jer na javnoj stranici nema online forme.

CLOUDFLARE / WEB3FORMS
Ako se online narudžbe ponovno aktiviraju, postojeća Cloudflare postavka WEB3FORMS_ACCESS_KEY može se ponovno koristiti.

NOVO 13.11.2026.: Podstranice dnevni-meni.html i catering.html s ponudama iz PDF flajera.
Navigacija azurirana na svim HTML stranicama, dodane kartice na naslovnicu i sitemap unosi.
RADNO VRIJEME: PDF flajer i postojeci web navode razlicita vremena, zato se postojeci sati na webu nisu mijenjali; potvrditi s vlasnikom.
Digitalni CSV/XML cjenik glavnog jelovnika nije mijenjan; nove ponude su zasebne i zahtijevaju potvrdu za eventualno uskladivanje evidencije.

NOVO 13.11.2026.: PREMIUM UVODNA ANIMACIJA LOGOTIPA
- Autentični zlatni Kod Kuma Pizza & Grill logotip preuzet je iz vlasnikovog flajera.
- SVG konture iscrtavaju logo; izvorni znak se potom diskretno pojavi.
- Intro traje približno 3 sekunde pri prvom otvaranju stranice u sesiji.
- Za ostale podstranice i ponovna učitavanja u istoj sesiji intro se ne ponavlja.
- Može se preskočiti klikom na Preskoči intro ili tipkom Escape.
- Poštuje sistemsku postavku smanjenih animacija (reduced motion).
- Ostatak sadržaja, cjenici i funkcionalnosti nisu mijenjani.
