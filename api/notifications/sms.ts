export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const {
      mobile,
      stationName,
      date,
      time,
      charger,
      bookingId,
    } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_SMS_TEMPLATE_ID;

    if (!authKey || !templateId) {
      return res.status(500).json({
        success: false,
        message: 'MSG91 environment variables are missing',
      });
    }

    // Remove spaces, +, hyphens, etc.
    let formattedMobile = String(mobile).replace(/\D/g, '');

    // Add India country code when only a 10-digit number is supplied
    if (formattedMobile.length === 10) {
      formattedMobile = `91${formattedMobile}`;
    }

    const response = await fetch(
      'https://control.msg91.com/api/v5/flow',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authkey: authKey,
        },
        body: JSON.stringify({
          template_id: templateId,
          short_url: '0',
          realTimeResponse: '1',
          recipients: [
            {
              mobiles: formattedMobile,
              STATION: stationName || '',
              DATE: date || '',
              TIME: time || '',
              CHARGER: charger || '',
              BOOKINGID: bookingId || '',
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log('MSG91 response:', data);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'MSG91 rejected the SMS request',
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'SMS request sent successfully',
      data,
    });
  } catch (error) {
    console.error('MSG91 SMS Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to send SMS',
    });
  }
}
