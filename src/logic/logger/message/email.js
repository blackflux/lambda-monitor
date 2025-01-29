import request from '../singleton/request.js';

export default ({ logEvent }) => {
  if (process.env.SENDGRID_API_KEY === undefined) {
    return;
  }
  try {
    const {
      from, to, subject, body, html = false
    } = JSON.parse(logEvent.message);
    request.enqueue({
      method: 'POST',
      url: 'https://api.sendgrid.com:443/v3/mail/send',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      data: {
        from: { email: from },
        personalizations: [{ to: [{ email: to }] }],
        subject,
        content: [{ type: html === true ? 'text/html' : 'text/plain', value: body }],
        tracking_settings: {
          click_tracking: {
            enable: false
          }
        }
      }
    });
  } catch { /* ignored */ }
};
