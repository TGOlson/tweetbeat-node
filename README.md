Summoning the ghost of Tweetbeat past - in node.

[Original Tweetbeat](https://github.com/TGOlson/tweetbeat.git).

Helpers:

* [node/twitter/socket](http://dillonbuchanan.com/programming/node-js-twitter-streaming-api-socket-io-twitter-cashtag-heatmap/)
* [node/twitter/socket/react](http://javaguirre.net/2014/02/11/twitter-streaming-api-with-node-socket-io-and-reactjs/)
* [pure websockets](https://gist.github.com/bradleywright/1021082)
* [websockets definitions](http://en.wikipedia.org/wiki/WebSocket)
* [node-ws module](https://github.com/einaros/ws)
* [using node-ws module](https://github.com/heroku-examples/node-ws-test)
* [websockets on heroku](https://devcenter.heroku.com/articles/websockets)

## Setup

Install dependencies

```
npm install
```

Create a `.env` file with valid credentials

```
TWITTER_CONSUMER_KEY=your-twitter-api-key
TWITTER_CONSUMER_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN_KEY=your-twitter-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret
```

Run the app

```
node server.js
```

## Development

To start the app with the Twitter stream initialized, set `STREAM=true`. This allows for conditionally connecting to the twitter stream, which is important to limit requests when in development.
```
STREAM=true node server.js
````

Test connecting to the stream from the command line. This will default to subscribing to all topics.
```
curl localhost:8080/stream
````

Subscribe to specific topics. [feature temporarily removed]
```
curl localhost:8080/stream?topics=usa,ruby
````

See a list of all available topics.
```
curl localhost:8080/topics
````

## TODO

* Test with `var connection = new WebSocket('ws://localhost:8080/stream');`
* Create client-side app - look into react.
* Look into public file routing (probably using `Router` to compile list of public files and build routes).
