import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user as userTable, leads } from '@/lib/db/schema'
import { inArray } from 'drizzle-orm'

const ADMIN_EMAILS = ['ipassociatesllc@gmail.com', 'tommybletcher@gmail.com']

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, email, address, service, urgency, message } = body

  if (!name || !phone || !address || !service) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const urgencyLabel =
    urgency === 'emergency' ? 'EMERGENCY (Immediate Response)' :
    urgency === 'urgent' ? 'Urgent (Today)' : 'Non-Emergency (Schedule)'

  // Build a readable email body containing every field the lead filled in
  const emailBody = `
NEW ESTIMATE REQUEST — Above & Beyond Restoration
==================================================

Name:     ${name}
Phone:    ${phone}
Email:    ${email || 'Not provided'}
Address:  ${address}
Service:  ${service}
Urgency:  ${urgencyLabel}

Message / Description of damage:
${message || 'No additional details provided.'}

--
Submitted via aboveandbeyondrestoration.com
`.trim()

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background:#1B2A4A; padding:24px; border-radius:12px 12px 0 0;">
        <h1 style="color:#fff; margin:0; font-size:20px;">New Estimate Request</h1>
        <p style="color:#F97316; margin:4px 0 0; font-weight:bold;">Above &amp; Beyond Restoration</p>
      </div>
      <div style="border:1px solid #eee; border-top:none; padding:24px; border-radius:0 0 12px 12px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr><td style="padding:8px 0; color:#666; width:120px;"><strong>Name</strong></td><td style="padding:8px 0;">${name}</td></tr>
          <tr><td style="padding:8px 0; color:#666;"><strong>Phone</strong></td><td style="padding:8px 0;"><a href="tel:${String(phone).replace(/[^0-9]/g, '')}">${phone}</a></td></tr>
          <tr><td style="padding:8px 0; color:#666;"><strong>Email</strong></td><td style="padding:8px 0;">${email ? `<a href="mailto:${email}">${email}</a>` : 'Not provided'}</td></tr>
          <tr><td style="padding:8px 0; color:#666;"><strong>Address</strong></td><td style="padding:8px 0;">${address}</td></tr>
          <tr><td style="padding:8px 0; color:#666;"><strong>Service</strong></td><td style="padding:8px 0;">${service}</td></tr>
          <tr><td style="padding:8px 0; color:#666;"><strong>Urgency</strong></td><td style="padding:8px 0; color:${urgency === 'emergency' ? '#dc2626' : '#111'}; font-weight:${urgency === 'emergency' ? 'bold' : 'normal'};">${urgencyLabel}</td></tr>
        </table>
        <div style="margin-top:16px; padding:16px; background:#f9fafb; border-radius:8px;">
          <p style="margin:0 0 4px; color:#666; font-size:12px; font-weight:bold; text-transform:uppercase;">Description of Damage</p>
          <p style="margin:0; font-size:14px; white-space:pre-wrap;">${message || 'No additional details provided.'}</p>
        </div>
      </div>
    </div>
  `.trim()

  // 1) Create a lead in the admin dashboard for every admin so it shows up under Leads.
  //    A contact-form submission is an inbound estimate request, i.e. a new lead.
  try {
    const adminUsers = await db
      .select({ id: userTable.id })
      .from(userTable)
      .where(inArray(userTable.email, ADMIN_EMAILS))

    if (adminUsers.length > 0) {
      // Map form urgency to the lead pipeline status/priority the dashboard uses.
      const status = urgency === 'emergency' ? 'hot' : urgency === 'urgent' ? 'warm' : 'new'
      const priority = urgency === 'emergency' ? 'hot' : urgency === 'urgent' ? 'warm' : 'cold'
      await db.insert(leads).values(
        adminUsers.map((u) => ({
          userId: u.id,
          name,
          email: email || null,
          phone,
          address,
          service,
          message: message || null,
          source: 'Website Contact Form',
          status,
          priority,
        })),
      )
    }
  } catch (e) {
    // Do not fail the whole request if lead creation fails — email is still attempted.
    console.error('[v0] Failed to create lead from contact form:', (e as Error).message)
  }

  // 2) Email both admins with all of the submitted fields, sent straight from the
  //    company Gmail account over Gmail SMTP (no third-party email service).
  //    Requires GMAIL_USER (the Gmail address) and GMAIL_APP_PASSWORD (a Google
  //    "App Password" — a 16-char code generated once in the Google account).
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD
  if (gmailUser && gmailPass) {
    try {
      const nodemailer = (await import('nodemailer')).default
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
      })
      await transporter.sendMail({
        from: `"Above & Beyond Restoration" <${gmailUser}>`,
        to: ADMIN_EMAILS.join(', '),
        subject: `[${urgency === 'emergency' ? 'EMERGENCY' : 'New Lead'}] Estimate Request from ${name} — ${service}`,
        text: emailBody,
        html: emailHtml,
        replyTo: email || undefined,
      })
      return NextResponse.json({ ok: true, emailed: true })
    } catch (e) {
      console.error('[v0] Gmail SMTP error:', (e as Error).message)
      // Lead was still created; report partial success so the visitor isn't blocked.
      return NextResponse.json({ ok: true, emailed: false })
    }
  }

  // Fallback when Gmail credentials aren't set yet: the lead is still created in the dashboard.
  console.log('[v0] Contact form submission (no GMAIL_APP_PASSWORD set):\n', emailBody)
  return NextResponse.json({ ok: true, emailed: false })
}
