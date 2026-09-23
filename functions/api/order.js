export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.WEB3FORMS_ACCESS_KEY) {
    return Response.json(
      { success: false, message: 'Web3Forms nije konfiguriran na serveru.' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();

    // Access key ostaje isključivo u Cloudflare environment secretu.
    formData.delete('access_key');
    formData.set('access_key', env.WEB3FORMS_ACCESS_KEY);

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Neispravan odgovor servisa za slanje narudžbe.'
    }));

    return Response.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Order submission error:', error);
    return Response.json(
      { success: false, message: 'Narudžbu trenutno nije moguće poslati.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
