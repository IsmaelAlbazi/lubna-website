// Vercel Serverless Function — receives a reservation and emails it.
// Requires env vars (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY   — your Resend API key (https://resend.com)
//   RESERVATION_TO   — the email address reservations should go to
//   RESERVATION_FROM — (optional) verified sender, e.g. "Lubna <reserveringen@jouwdomein.nl>"
//                      defaults to Resend's test sender (only delivers to your own account email).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  // parse body (JSON from fetch, or urlencoded from a plain form submit)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); }
    catch (e) { body = Object.fromEntries(new URLSearchParams(body)); }
  }
  body = body || {};

  // honeypot: bots fill the hidden "company" field — silently succeed
  if (body.company) { res.status(200).json({ ok: true }); return; }

  const g = (k) => (body[k] || '').toString().trim();
  const naam = g('naam'), email = g('email'), telefoon = g('telefoon');
  const datum = g('datum'), tijd = g('tijd'), personen = g('personen');
  const opmerkingen = g('opmerkingen');

  if (!naam || !email || !telefoon || !datum || !tijd || !personen) {
    res.status(400).json({ ok: false, error: 'Vul alle verplichte velden in.' });
    return;
  }
  const n = parseInt(personen, 10);
  if (!(n >= 1 && n <= 12)) {
    res.status(400).json({ ok: false, error: 'Voor meer dan 12 personen graag telefonisch reserveren.' });
    return;
  }

  const KEY = process.env.RESEND_API_KEY;
  const TO = process.env.RESERVATION_TO;
  const FROM = process.env.RESERVATION_FROM || 'Lubna Reserveringen <onboarding@resend.dev>';
  if (!KEY || !TO) {
    res.status(500).json({ ok: false, error: 'Reserveringen zijn nog niet ingesteld. Bel ons via 053 574 6336.' });
    return;
  }

  const subject = `Nieuwe reservering — ${naam} · ${personen} pers. · ${datum} ${tijd}`;
  const text =
    `Nieuwe reservering via de website:\n\n` +
    `Naam:            ${naam}\n` +
    `E-mail:          ${email}\n` +
    `Telefoon:        ${telefoon}\n` +
    `Datum:           ${datum}\n` +
    `Tijd:            ${tijd}\n` +
    `Aantal personen: ${personen}\n` +
    `Opmerkingen:     ${opmerkingen || '-'}\n`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text })
    });
    if (!r.ok) {
      res.status(502).json({ ok: false, error: 'Versturen mislukt. Bel ons gerust via 053 574 6336.' });
      return;
    }
  } catch (e) {
    res.status(502).json({ ok: false, error: 'Versturen mislukt. Bel ons gerust via 053 574 6336.' });
    return;
  }

  const wantsJson = (req.headers['accept'] || '').includes('application/json');
  if (wantsJson) {
    res.status(200).json({ ok: true });
  } else {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(
      '<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bedankt — Restaurant Lubna</title></head>' +
      '<body style="font-family:system-ui,sans-serif;background:#f3ecdd;color:#2c2a24;text-align:center;padding:12vh 24px">' +
      '<h1 style="font-weight:500">Bedankt voor je reservering!</h1>' +
      '<p>We bevestigen je reservering zo snel mogelijk.</p>' +
      '<p style="margin-top:28px"><a href="/" style="color:#8a6d2c">← Terug naar de site</a></p>' +
      '</body></html>'
    );
  }
}
