const moment = require('moment');

function getItem(xml) {
  return /<item>(.+?)<\/item>/.exec(xml)[1];
}

function sanitizeTitle(title) {
  return title.split(' ').slice(1).map(sanitizeWord).join('-');
}

function sanitizeWord(word) {
  return word.toLowerCase().replace(/[^\w-]/g, '');
}

module.exports = function(xml) {
  const sanitized = getItem(xml).replace(/\n/g, '');
  const title = /<title>(.+?)<\/title>/.exec(sanitized)[1];
  const description = /<itunes:summary>(.+?)<\/itunes:summary>/.exec(sanitized)[1];

  const date = moment(/<pubDate>(.+?)<\/pubDate>/.exec(sanitized)[1]);
  const year = String(date.year());
  let month = String(date.month() + 1);
  if (month.length === 1) month = '0' + month;

  const url = `https://www.apmpodcasts.org/tbtl/${year}/${month}/${sanitizeTitle(title)}/`
  
  return { title, description, url }
}