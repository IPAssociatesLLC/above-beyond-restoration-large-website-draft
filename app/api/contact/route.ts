import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, email, address, service, urgency, message } = body

  if (!name || !phone || !address || !service) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const urgencyLabel =
    urgency === 'emergency' ? 'EMERGENCY (Immediate Response)' :
    urgency === 'urgent' ? 'Urgent (Today)' : 'Non-Emergency (Schedule)'

  // Build plain-text email body
  const emailBody = `
NEW ESTIMATE REQUEST — Above & Beyond Restoration
==================================================

Name:     ${name}
Phone:    ${phone}
Email:    ${email || 'Not provided'}
Address:  ${address}
Service:  ${service}
Urgency:  ${urgencyLabel}

Message:
${message || 'No additional details provided.'}

--
Submitted via aboveandbeyondrestoration.com
`.trim()

  // If a Resend API key is configured, send via Resend
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Above & Beyond Restoration <onboarding@resend.dev>',
        to: ['TommyBletcher@gmail.com'],
        subject: `[${urgency === 'emergency' ? 'EMERGENCY' : 'New Lead'}] Estimate Request from ${name} — ${service}`,
        text: emailBody,
        reply_to: email || undefined,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[v0] Resend error:', err)
      return NextResponse.json({ error: 'Email delivery failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  // Fallback: log to console in dev (no API key needed)
  console.log('[v0] Contact form submission (no RESEND_API_KEY set):\n', emailBody)
  return NextResponse.json({ ok: true })
}
