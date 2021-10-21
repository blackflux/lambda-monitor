const request = require('../singleton/request');

module.exports = ({ logEvent }) => {
  if (process.env.SENDGRID_API_KEY === undefined) {
    return;
  }
  try {
    const {
      from, to, subject, body
    } = JSON.parse(logEvent.message);
    request.enqueue({
      method: 'POST',
      uri: 'https://api.sendgrid.com:443/v3/mail/send',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        from: { email: from },
        personalizations: [{ to: [{ email: to }] }],
        subject,
        content: [{ type: 'text/plain', value: body }]
      })
    });
  } catch (e) { /* ignored */ }
};
