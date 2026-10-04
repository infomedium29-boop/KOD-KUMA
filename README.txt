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
