Summoning the ghost of Tweetbeat past - in node.

[Original Tweetbeat](https://github.com/TGOlson/tweetbeat.git).

Helpers:

* [node/twitter/socket/react](http://javaguirre.net/2014/02/11/twitter-streaming-api-with-node-socket-io-and-reactjs/)
* [websockets definitions](http://en.wikipedia.org/wiki/WebSocket)
* [node-ws module](https://github.com/einaros/ws)
* [using node-ws module](https://github.com/heroku-examples/node-ws-test)
* [websockets on heroku](https://devcenter.heroku.com/articles/websockets)

## About

Implementing an event-driven node architecture with websockets. Clients subscribe to tweets topics by sending subscriptions requests to the server via websockets. Once the server receives a tweet, it sends a message over websockets to any subscribed parties.


## Setup

The root node app is available to serve assets, return API responses, and make websocket connections. The nested rails app `/assets` is mainly acting as a polyfill for serving the original tweetbeat assets, and making requests to the node application.

First start the node app.

Install dependencies

```
$ npm install
```

Create a `.env` file with valid credentials

```
TWITTER_CONSUMER_KEY=your-twitter-api-key
TWITTER_CONSUMER_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN_KEY=your-twitter-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret
```

Run the node app with `STREAM=true`

```
$ STREAM=true node server.js
```

Then start the rails app

```
$ cd assets/
$ bundle install
```

Create a `/assets/.env` file with valid credentials

```
SECRET_KEY:your-rails-secret
```

Run the rails app
```
$ rails s
```

Navigate to `localhost:3000` to see the app running. In the console you should see a new connection

```
Websocket connection opened
Current sockets: 1
```

Effectively, the rails app is serving original tweetbeat assets, which communicates with the node server via websockets. This probably won't work in production, but acts as a polyfill solution until the assets are ported over to the node app. Note: this solution is converting websocket responses to JS events, and has some bugs.

## Development

To start the app with the Twitter stream initialized, set `STREAM=true`. This allows for conditionally connecting to the twitter stream, which is important to limit requests when in development.
```
STREAM=true node server.js
````

Navigate over to `localhost:8080`, open the console, and you should see tweet topics being logged.

Subscribe to stream. [feature temporarily removed]
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
* Implement gulp to serve assets
* Create run command to start both apps
* Allow client to subscribe to specific topics - right now all clients get all tweet events
* Port original tweetbeat assets to node app, using websockets directly
* Redo client-side app - look into react.
