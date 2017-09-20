const moment = require('moment');
const { parseString } = require('xml2js');
const { promisify, inspect } = require('util');

const parse = promisify(parseString);

function sanitizeTitle(title) {
  return title.split(' ').slice(1).map(sanitizeWord).join('-');
}

function sanitizeWord(word) {
  return word.toLowerCase().replace(/[^\w-]/g, '');
}

module.exports = function(rawxml) {
  const xml = rawxml.replace('& ', '&amp; ');
  return parse(xml).then(({rss}) => {
    const { title, description, pubDate } = rss.channel[0].item[0];
    return [{ title: title[0], description: description[0].trim() }, pubDate[0]];
  }).then(([obj, pubDate]) => {
    const date = moment(pubDate);
    const year = String(date.year());
    let month = String(date.month() + 1);
    if (month.length === 1) month = '0' + month;
  
    obj.url = `https://www.apmpodcasts.org/tbtl/${year}/${month}/${sanitizeTitle(obj.title)}/`;
    return obj;
  });
}