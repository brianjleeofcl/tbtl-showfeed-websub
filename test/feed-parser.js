const { describe, it } = require('mocha');
const { expect } = require('chai');
const { readFileSync } = require('fs');
const { join } = require('path')

const parser = require('../feed-parser');

describe('feed parser', function () {
  const xmls = [];
  before(function() {
    xmls.push(
      readFileSync(join('test', 'example1.xml'), 'utf-8'),
      readFileSync(join('test', 'example2.xml'), 'utf-8'),
      readFileSync(join('test', 'example3.xml'), 'utf-8'),
      readFileSync(join('test', 'example4.xml'), 'utf-8'),
      readFileSync(join('test', 'example5.xml'), 'utf-8'),
      readFileSync(join('test', 'example6.xml'), 'utf-8')
    );
  });

  it('should retrieve description from feed', function() {
    const results = xmls.map(parser).map(obj => obj.description);
    const expected = ['A walk on his old college campus has Luke feeling almost overwhelmed with nostalgia. He and Andrew also discuss whether people should demand things ASAP, at EOB, or at OOB. Plus, an NFL sideline reporter finds himself an unlikely celebrity, and a listener shares her story of a first date and a secret bathroom.', 'Luke and Andrew get real about their long-term professional insecurities, as one does when one realizes one is a professional podcarter. Plus, Jim Carey tries to lay some Real Truths on an entertainment reporter. And No Point Conversion is back! Luke and Andrew break-down yesterday\'s double-loss by the Seahawks and the Browns.', "Luke runs a soda-related experiment on Andrew, which results in both of them getting way too hopped-up on caffeine and sugar to finish the show. Also, Chili's has announced that it's cutting its menu IN HALF, but it's still way too long. And we're all playing right into Whole Food's organic little hands.", 'Andrew helps Luke work out a dog-related etiquette question, then says the word "Terri-Poo" too many times. Plus, Amazon takes over Whole Foods and lowers prices, but maybe going to a threatening-sounding butcher shop is the best bet for everyone. And a listener explains how TBTL is ruining science in a Minnesota laboratory.', "Luke's inevitable skateboard-related injury occurred over the weekend, while Andrew was out buying $2 baseballs. They discuss a study that says you should probably just order that take-out food tonight, and a very, very good reason to stop using hotel tea kettles", "Luke says he can soooooorrrrrt of identify with a jogger who did a bad, bad thing this week. Andrew is freaked out about a new report on sponges (which he thinks might have been funded by Big Sponge.) And, since it's Friday, we have some Music For Your Weekend!"];

    expect(results).to.deep.equal(expected);
  });
  it('should retrieve title from feed', function() {
    const results = xmls.map(parser).map(obj => obj.title);
    const expected = [
      "#2466 Dippin' Don'ts", "#2465 Transformers 5: Adrenaline Road", "#2464 Well, That Tickles Our T-Bone",
      "#2456 Don't Beat Up On My Good Friend Pitbull", "#2455 Did We Say Nothing?!", '#2444 Flashes Of Quincy-dence'
    ];

    expect(results).to.deep.equal(expected);
  });
  it('should generate url', function() {
    const results = xmls.map(parser).map(obj => obj.url);
    const expected = [
      'https://www.apmpodcasts.org/tbtl/2017/09/dippin-donts/',
      'https://www.apmpodcasts.org/tbtl/2017/09/transformers-5-adrenaline-road/',
      'https://www.apmpodcasts.org/tbtl/2017/09/well-that-tickles-our-t-bone/',
      'https://www.apmpodcasts.org/tbtl/2017/08/dont-beat-up-on-my-good-friend-pitbull/',
      'https://www.apmpodcasts.org/tbtl/2017/08/did-we-say-nothing/',
      'https://www.apmpodcasts.org/tbtl/2017/08/flashes-of-quincy-dence/'
    ]

    expect(results).to.deep.equal(expected);
  });
})