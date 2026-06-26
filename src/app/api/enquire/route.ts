import { NextRequest, NextResponse } from 'next/server';

const TO_EMAIL = 'info@kalaitsidis.com';
const FROM_EMAIL = process.env.ENQUIRY_FROM_EMAIL ?? 'Terra Something <onboarding@resend.dev>';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (v: unknown) =>
  String(v ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, interest, message, _hp } = body ?? {};

    // Honeypot: silently accept so bots don't learn the field was caught.
    if (_hp) return NextResponse.json({ ok: true });

    if (!name || !email || !phone || !isEmail(String(email))) {
      return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // No email provider configured yet — log so submissions aren't lost in
      // dev/preview. Set RESEND_API_KEY to enable delivery.
      console.log('Enquiry (RESEND_API_KEY not set):', { name, email, phone, interest, message });
      return NextResponse.json({ ok: true });
    }

    const html = `
      <h2>New Terra Something enquiry</h2>
      <p><strong>Name:</strong> ${esc(name)}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      <p><strong>Phone:</strong> ${esc(phone)}</p>
      <p><strong>Residence of interest:</strong> ${esc(interest) || '—'}</p>
      <p><strong>Message:</strong><br/>${esc(message) || '—'}</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: String(email),
        subject: `New enquiry${interest ? ` — Residence ${interest}` : ''} from ${name}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error('Resend error:', await res.text());
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
