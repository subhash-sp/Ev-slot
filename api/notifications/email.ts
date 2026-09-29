export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { to, subject, body, bookingId } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: 'Missing required email information',
      });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'RESEND_API_KEY is not configured',
      });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EV Slot <onboarding@resend.dev>',
        to: [to],
        subject,
        text: body,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API Error:', data);

      return res.status(response.status).json({
        success: false,
        message: 'Resend rejected the email request',
        details: data,
      });
    }

    console.log('Booking confirmation email sent:', {
      bookingId,
      emailId: data.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Booking confirmation email sent',
      id: data.id,
    });
  } catch (error) {
    console.error('Email API Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to send booking confirmation email',
    });
  }
}
