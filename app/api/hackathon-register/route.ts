import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { registrationSchema } from '@/lib/types/abbis-hackathon';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Registrations!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString(),
          data.teamName,
          data.isSolo ? 'Solo' : 'Team',
          data.trackFocus,
          data.leadName,
          data.leadEmail,
          data.leadPhone,
          data.country,
          data.members.map(m => `${m.name} <${m.email}>`).join('; '),
          data.portfolioLink,
          data.workHistory,
        ]],
      },
    });
  } catch (err) {
    console.error('[hackathon-register] Sheets API error:', err);
    return Response.json({ error: 'Failed to save registration' }, { status: 502 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ABBIS Hackathon" <${process.env.SMTP_USER}>`,
      to: data.leadEmail,
      subject: 'ABBIS Hackathon — Registration Received',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #7a1f1f;">You're registered for ABBIS.</h2>
          <p>Hi ${data.leadName},</p>
          <p>
            Thanks for registering <strong>${data.teamName}</strong> for the
            Africa Blood Bank Information System (ABBIS) Hackathon, hosted by
            Terumo BCT and AICE Africa.
          </p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 4px 0; color: #666;">Focus area</td><td>${data.trackFocus}</td></tr>
            <tr><td style="padding: 4px 0; color: #666;">Team type</td><td>${data.isSolo ? 'Solo applicant' : 'Team of ' + (1 + data.members.length)}</td></tr>
          </table>
          <p><strong>What happens next:</strong></p>
          <ul>
            <li>Applications close <strong>Friday, 18 September 2026</strong></li>
            <li>Team confirmation &amp; kickoff: <strong>Monday, 21 September 2026</strong></li>
            <li>Build phase runs 21 September – 5 October 2026</li>
            <li>Final submission: <strong>Tuesday, 6 October 2026, 11:59 PM (EAT)</strong></li>
          </ul>
          <p>We'll email you again ahead of kickoff with mentorship and logistics details.</p>
          <p style="margin-top: 24px; color: #666; font-size: 13px;">
            Code for Blood. Code for Life.<br>
            — AICE Africa &amp; Terumo BCT
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('[hackathon-register] email failed, but registration was saved:', emailErr);
    // fall through — still return ok below
  }

  return Response.json({ status: 'ok' });
}