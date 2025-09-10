export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { form_name, form_email, form_subject, form_phone, form_message, form_botcheck } = req.body;

    // Basic spam protection
    if (form_botcheck && form_botcheck !== '') {
      return res.status(400).json({ message: 'Bot detected' });
    }

    // Validate required fields
    if (!form_name || !form_email || !form_subject || !form_message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // EmailJS server-side sending - Fixed endpoint and payload
    const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_cfmcw',
        template_id: 'template_m7732st',
        user_id: 'FLntTEBuyN134J25J',
        template_params: {
          from_name: form_name,
          from_email: form_email,
          subject: form_subject,
          phone: form_phone || 'Not provided',
          message: form_message,
          to_name: 'Website Admin', // Add recipient name
          reply_to: form_email
        }
      })
    });

    const responseText = await emailjsResponse.text();
    console.log('EmailJS Response:', responseText, 'Status:', emailjsResponse.status);

    if (emailjsResponse.status === 200) {
      res.status(200).json({ message: 'Email sent successfully!' });
    } else {
      console.error('EmailJS Error:', responseText);
      res.status(500).json({ 
        message: 'Failed to send email', 
        error: responseText,
        status: emailjsResponse.status 
      });
    }

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
}