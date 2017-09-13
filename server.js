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

pshb.on('listen', () => {
  pshb.subscribe("http://feeds.feedburner.com/2b2l", "http://pubsubhubbub.appspot.com/", error => {
    if (error) {
      console.error(error);
    }
    else {
      console.log('subscribed');
    }
  })
})

pshb.on('error', error => {
  console.error(error);
})

function getMailOption(buffer) {
  return {
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_RECEIVER,
    text: buffer,
    subject: `New tbtl posted`
  }
}

pshb.on('feed', data => {
  transporter.sendMail(getMailOption(data.feed), (error, info) => {
    if (error) {
      console.error(error);;
    }
    console.info('mail sent');
  })
})

pshb.listen(process.env.PORT || 8000);