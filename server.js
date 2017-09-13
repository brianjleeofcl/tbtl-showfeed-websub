if (process.env.NODE_ENV !== 'production') require('dotenv').load();

const pshb = require("pubsubhubbub").createServer({callbackUrl: 'https://pshb-parse-mailer.herokuapp.com/'});

const transporter = require('nodemailer').createTransport({
  host: 'mail.name.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PW
  }
})

const parser = require('./feed-parser');

pshb.on('subscribe', () => console.log('subscribed'))

pshb.on('listen', () => {
  pshb.subscribe("http://feeds.feedburner.com/2b2l", "http://pubsubhubbub.appspot.com/", err => {if (err) console.error(err)});
})

pshb.on('error', error => {
  console.error(error);
})

function getMailOption(obj) {
  return {
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_RECEIVER,
    text: JSON.stringify(obj),
    subject: `New tbtl posted`
  }
}

pshb.on('feed', data => {
  const parsed = parser(data.feed.toString());

  if (parsed.title[0] ==='#') {
    transporter.sendMail(getMailOption(parsed), (error, info) => {
      if (error) {
        console.error(error);;
      }
      console.info('mail sent');
    })
  } 
})

pshb.on('unsubscribe', () => console.log('unsubscribed'));

pshb.listen(process.env.PORT || 8000);

process.on('exit', () => {
  pshb.unsubscribe("http://feeds.feedburner.com/2b2l", "http://pubsubhubbub.appspot.com/", err => {if (err) console.error(err)});
})