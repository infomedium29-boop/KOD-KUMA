KOD KUMA — Cloudflare Pages + Web3Forms online narudžbe

Ova verzija NE sadrži Web3Forms Access Key u HTML-u ili JavaScriptu.
Online narudžbe idu kroz Cloudflare Pages Function: /api/order

CLOUDFLARE POSTAVKA PRIJE TESTIRANJA:
1. Cloudflare Pages projekt > Settings > Variables and secrets
2. Production > Add
3. Type: Secret
4. Name: WEB3FORMS_ACCESS_KEY
5. Value: Web3Forms Form Access Key
6. Save
7. Nakon toga deployati ovu verziju projekta.

Ako koristite Preview deployment za testiranje, isti secret dodajte i u Preview okruženje.

Važno: functions/api/order.js mora ostati u repozitoriju jer ona server-side dodaje Access Key i prosljeđuje narudžbu Web3Formsu.
