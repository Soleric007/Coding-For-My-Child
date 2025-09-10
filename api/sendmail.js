export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const { form_name, form_email, form_subject, form_phone, form_message, form_botcheck } = req.body;

    // Log for debugging
    console.log('Received data:', { form_name, form_email, form_subject, form_phone, form_message });

    // Basic spam protection
    if (form_botcheck && form_botcheck !== '') {
      return res.status(400).json({ status: 'error', message: 'Bot detected' });
    }

    // Validation
    if (!form_name || !form_email || !form_subject || !form_message) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please fill in all required fields.' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form_email)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please enter a valid email address.' 
      });
    }

    // Using EmailJS service
    const emailJSResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
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
          reply_to: form_email
        }
      })
    });

    console.log('EmailJS response status:', emailJSResponse.status);
    
    if (emailJSResponse.ok) {
      return res.status(200).json({ 
        status: 'success', 
        message: 'Thank you! Your message has been sent successfully.' 
      });
    } else {
      const errorText = await emailJSResponse.text();
      console.log('EmailJS error:', errorText);
      throw new Error(`EmailJS failed: ${errorText}`);
    }

  } catch (error) {
    console.error('Full error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: `Error: ${error.message}` 
    });
  }
}