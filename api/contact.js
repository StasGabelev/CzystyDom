import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, message: "Method not allowed" });
    return;
  }

  const { name, phone, service, message, lang, company_website } = req.body || {};

  // Honeypot: bots fill hidden fields, humans don't.
  if (company_website) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!name || !phone) {
    res.status(400).json({ ok: false, message: "Missing required fields" });
    return;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    res.status(500).json({ ok: false, message: "Email is not configured yet" });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 465,
      secure: Number(SMTP_PORT) !== 587,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: SMTP_USER,
      to: CONTACT_TO,
      replyTo: SMTP_USER,
      subject: "Nowe zapytanie ze strony czystydomwaw.pl",
      text: `Imię i nazwisko: ${name}\nTelefon: ${phone}\nUsługa: ${service || "-"}\nWiadomość: ${message || "-"}\nJęzyk strony: ${lang || "pl"}\n`,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Mail delivery failed" });
  }
}
