import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, company, phone, message, interest } = req.body

    console.log('Received form data:', { name, email, company, phone, message, interest })

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields:', { name, email, message })
      return res.status(400).json({ error: 'Missing required fields: name, email, and message are required' })
    }

    // Create transporter with proper Gmail settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // TLS for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Test connection
    await transporter.verify()
    console.log('SMTP connection verified')

    // Email to company - Professional format
    const companyEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { border-bottom: 2px solid #1a73e8; padding-bottom: 15px; margin-bottom: 20px; }
            .header h2 { margin: 0; color: #1a73e8; font-size: 24px; }
            .content { margin: 20px 0; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #1a73e8; margin-bottom: 5px; }
            .value { padding: 8px 12px; background-color: #f5f5f5; border-left: 3px solid #1a73e8; margin-bottom: 10px; }
            .message-section { margin-top: 25px; padding: 15px; background-color: #f9f9f9; border: 1px solid #e0e0e0; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Enquiry Received</h2>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">Client Name</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value">${email}</div>
              </div>
              
              <div class="field">
                <div class="label">Phone Number</div>
                <div class="value">${phone || 'Not provided'}</div>
              </div>
              
              <div class="field">
                <div class="label">Company Name</div>
                <div class="value">${company || 'Not provided'}</div>
              </div>
              
              <div class="field">
                <div class="label">Service Interest</div>
                <div class="value">${interest || 'Not specified'}</div>
              </div>
              
              <div class="message-section">
                <div class="label">Inquiry Message</div>
                <p style="margin: 10px 0; color: #333;">
                  ${message.replace(/\n/g, '<br>')}
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated message from your website contact form. Please respond to the client at your earliest convenience.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Email to customer - Professional acknowledgment
    const customerEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #1a73e8; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #070808; font-size: 28px; }
            .logo { font-size: 14px; color: #666; margin-top: 10px; }
            .content { margin: 20px 0; }
            .greeting { font-size: 16px; margin: 20px 0; }
            .details-section { margin: 25px 0; padding: 15px; background-color: #f5f5f5; border-left: 3px solid #1a73e8; }
            .detail-item { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #040404; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 13px; }
            .contact-info { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border: 1px solid #e0e0e0; }
            .signature { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You!</h1>
              <p class="logo">Plutus Digital Asset</p>
            </div>
            
            <div class="content">
              <p class="greeting">Dear ${name},</p>
              
              <p>Thank you for reaching out to Plutus Digital Asset. We have successfully received your inquiry and appreciate your interest in our services.</p>
              
              <p>Our team will review your request and get back to you within one business day with the appropriate solution tailored to your needs.</p>
              
              <div class="details-section">
                <p style="margin-top: 0; font-weight: bold; color: #0c0c0c;">Your Inquiry Details</p>
                <div class="detail-item">
                  <span class="detail-label">Name:</span> ${name}
                </div>
                <div class="detail-item">
                  <span class="detail-label">Email:</span> ${email}
                </div>
                ${company ? `<div class="detail-item">
                  <span class="detail-label">Company:</span> ${company}
                </div>` : ''}
                <div class="detail-item">
                  <span class="detail-label">Message:</span>
                  <p style="margin: 8px 0; color: #555;">${message.replace(/\n/g, '<br>')}</p>
                </div>
              </div>
              
              <p>If you have any urgent requirements or need to discuss further, please don't hesitate to contact us directly.</p>
              
              <div class="contact-info">
                <p style="margin: 5px 0;"><strong>Plutus Digital Asset</strong></p>
                <p style="margin: 5px 0;">📞 Phone: +91 73855 94572</p>
                <p style="margin: 5px 0;">📧 Email: info.plutuss@gmail.com</p>
                <p style="margin: 5px 0;">📍 Address: 212- City Avenue Commercial, Wakad, Pune-57</p>
              </div>
            </div>
            
            <div class="footer">
              <div class="signature">
                <p>Best regards,</p>
                <p><strong>Plutus Digital Asset Team</strong></p>
              </div>
              <p style="margin-top: 20px; color: #999;">This is an automated response. We will contact you shortly with a personalized message.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email to company
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
      subject: `New Enquiry - ${name}`,
      html: companyEmailContent,
    })
    console.log('Email sent to company')

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank You for Your Enquiry - Plutus Digital',
      html: customerEmailContent,
    })
    console.log('Confirmation email sent to customer')

    res.status(200).json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message,
      code: error.code 
    })
  }
}
