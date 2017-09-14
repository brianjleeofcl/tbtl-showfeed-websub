const pshb = require('pubsubhubbub').createServer({callbackUrl: 'https://tbtl-showfeed-websub.herokuapp.com/'});
const axios = require('axios');
const parser = require('./feed-parser');

pshb.on('subscribe', ({ topic }) => console.info(`${topic} subscribed`));

pshb.on('listen', () => {
  console.info(`listening on port ${process.env.PORT}`);

  pshb.subscribe(
    "http://feeds.feedburner.com/2b2l", 
    "http://pubsubhubbub.appspot.com/", 
    err => { if (err) console.error(err); }
  );
});

pshb.on('error', error => {
  console.error(error);
});

pshb.on('feed', ({ feed }) => {
  const newFeed = feed.toString();
  console.log('feed')
  console.log(newFeed);
  if (/<title>#\d{3}/.test(newFeed)) {
    const data = parser(newFeed);
    data.secret = process.env.HANDSHAKE_SECRET;
    axios.post('https://tbtl-showfeed.herokuapp.com/api/new-post', data).then(({status}) => console.info(status));
  } 
});

pshb.on('unsubscribe', ({ topic }) => console.info(`${topic} unsubscribed`));

pshb.listen(process.env.PORT);

process.on('exit', () => {
  pshb.unsubscribe(
    "http://feeds.feedburner.com/2b2l", 
    "http://pubsubhubbub.appspot.com/", 
    err => { if (err) console.error(err); }
  );
});