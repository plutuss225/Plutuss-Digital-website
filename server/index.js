import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/send-email', async (req, res) => {
  const { name, email, company, phone, interest, message } = req.body || {}
  if (!name || !email) return res.status(400).json({ error: 'Missing required fields' })

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.COMPANY_RECEIVER || 'sales@plutusdigitalasset.com',
      subject: `Website enquiry: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || ''}\nPhone: ${phone || ''}\nInterest: ${interest || ''}\n\nMessage:\n${message || ''}`,
    }

    await transporter.sendMail(mailOptions)
    res.json({ ok: true })
  } catch (err) {
    console.error('send-email error', err)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

const PORT = process.env.PORT || 5178
app.listen(PORT, () => console.log(`Email server listening on http://localhost:${PORT}`))
