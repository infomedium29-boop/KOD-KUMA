export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.WEB3FORMS_ACCESS_KEY) {
    return Response.json(
      { success: false, message: 'Web3Forms nije konfiguriran na serveru.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const formData = await request.formData();

    // Access key ostaje isključivo u Cloudflare environment secretu.
    formData.delete('access_key');
    formData.set('access_key', env.WEB3FORMS_ACCESS_KEY);

    // Važno: ne pratimo redirect automatski. Web3Forms dokumentira 303 kao
    // uspješan submit s redirectom. Ako bismo ga pratili, dobili bismo HTML
    // success stranicu i pokušaj response.json() bi pogrešno izgledao kao greška.
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      },
      redirect: 'manual'
    });

    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (_) {
        data = null;
      }
    } else {
      // Potroši body, ali ga ne vraćaj niti logiraj jer može sadržavati podatke forme.
      try { await response.text(); } catch (_) {}
    }

    // Web3Forms API dokumentira:
    // 200 = success
    // 303 = success redirect
    // 400/429/500 = greška
    // Ako 200 sadrži eksplicitno success:false, poštujemo taj signal.
    const isSuccess =
      response.status === 303 ||
      (response.status === 200 && data?.success !== false);

    // Logiramo samo tehničke metapodatke, bez osobnih podataka i bez access keya.
    console.log('Web3Forms order result', {
      status: response.status,
      contentType,
      jsonSuccess: data?.success ?? null,
      hasLocation: response.headers.has('location')
    });

    if (isSuccess) {
      return Response.json(
        {
          success: true,
          message: data?.message || data?.body?.message || 'Narudžba je uspješno poslana.'
        },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const message =
      data?.message ||
      data?.body?.message ||
      'Narudžbu trenutno nije moguće poslati.';

    return Response.json(
      { success: false, message },
      {
        status: response.status >= 400 ? response.status : 502,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  } catch (error) {
    console.error('Order submission error:', error);
    return Response.json(
      { success: false, message: 'Narudžbu trenutno nije moguće poslati.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
