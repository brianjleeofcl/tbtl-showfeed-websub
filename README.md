# TBTL Showfeed Websub

This server subscribes to an RSS feed which implements the [websub spec](https://www.w3.org/TR/websub/), previously called pubsubhubbub. The server implementation relies on [`node-pubsubhubbub`](https://github.com/pubsubhubbub/node-pubsubhubbub) available on NPM.

## API

There are no publicly available APIs to this server as its only purpose is to subscribe to a websub hub, handle requests from the hub and handle feed updates.

When a new feed is published, it is sent to this server, where the XML string is parsed using the function in `./feed-parser.js`. The parsed result is a JavaScript Object with the following properties:

| key | value description|
|-----|------------------|
|String title| Title of the episode. |
|String url| URL to the posts on `tbtl.net`. It is generated by sanitizing `title` in a similar manner used by WordPress.|
|String description| Episode description. |

The `Object` above is sent as `POST` data in JSON format to another webserver to be posted using the Reddit API.

## Notes for maintenance

1. The feed listener checks for title tags to contain a string that begins with `#` and a three digit number, using `/<title>#\d{3}/` as the regular expression and the `test()` method. This is to prevent placeholding posts without actual title data from being submitted to reddit. If the producers at some point change the naming convention for episode titles, this will fail and need to be updated.

    **update** (9/20/2017): This turned out to be inconsistent behavior since occasionally feed does not come with episode number. The parsing for titles will now occur in the parser but will no longer filter based on title consistency. This will most likely require correction from an admin when the post is created.

2. `feed-parser.js` makes a substitution of `& ` to `&amp; `. While the feed sent over from the websub hub is likely to NOT contain the ampersand, the data copied from xml on browsers have contained an ampersand which caused test cases to fail. It SHOULD be redundant in production use but also a fair check since `xml2js` will crash if the xml is invalid.

3. For some reason `description` of the feed includes linebreaks before and after the string. The parser trims this using the `.trim()` method, otherwise it breaks formatting in the Reddit post.