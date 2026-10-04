// Online narudžbe su namjerno deaktivirane.
// Originalna integracija nalazi se u /_online-order-backup/order-api-original.source.txt
export async function onRequestPost() {
  return new Response(JSON.stringify({
    success: false,
    message: 'Online narudžbe trenutno nisu aktivne. Za narudžbu nazovite +385 92 460 5349.'
  }), {
    status: 410,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

export async function onRequestGet() {
  return new Response(JSON.stringify({
    success: false,
    message: 'Online narudžbe trenutno nisu aktivne.'
  }), {
    status: 410,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
