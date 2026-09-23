KOD KUMA — Cloudflare Pages + Web3Forms online narudžbe

Online narudžbe idu kroz Cloudflare Pages Function: /api/order
Web3Forms Access Key nije u HTML-u ni JavaScriptu.

Cloudflare postavka:
- Type: Secret
- Name: WEB3FORMS_ACCESS_KEY
- Value: Web3Forms Form Access Key

VAŽNO:
- functions/api/order.js mora ostati u repozitoriju.
- Web3Forms Redirect URL preporučeno je ostaviti praznim jer potvrdu prikazuje sam sajt.
- Function sada ispravno tretira HTTP 200 i HTTP 303 kao uspješno slanje te ne proglašava HTML/redirect odgovor greškom.
