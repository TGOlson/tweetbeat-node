Summoning the ghost of Tweetbeat past - in node.

[Original Tweetbeat](https://github.com/TGOlson/tweetbeat.git).

Helpers:

* [node/twitter/socket/react](http://javaguirre.net/2014/02/11/twitter-streaming-api-with-node-socket-io-and-reactjs/)
* [websockets definitions](http://en.wikipedia.org/wiki/WebSocket)
* [node-ws module](https://github.com/einaros/ws)
* [using node-ws module](https://github.com/heroku-examples/node-ws-test)
* [websockets on heroku](https://devcenter.heroku.com/articles/websockets)

## About

Implemented using an event-driven node architecture with websockets. Clients subscribe to tweets topics by sending subscription requests to the server via websockets. Once the server receives a tweet, it sends a message over websockets to any subscribed parties.


## Setup

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

Navigate to `localhost:8080`. In the terminal you should see a new connection

```
OPENED websocket connection: client_1
Current sockets: 1
```

View the in-process development of tweetbeat-node at `http://localhost:8080/tweetbeat`.

## Original assets

The previous tweetbeat assets have been ported over and can be found in `/public`. Original scripts and stylesheets can be found in `public/js/original/` and `public/css/original/`, respectively. The assets are currently used on page `/tweetbeat`.

In addition to the node app, the nested rails app in `/assets-old` is also available for serving the original tweetbeat assets. This may be helpful to quickly test previous functionality.

To start the rails app

```
$ cd assets-old/
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

Navigate to `localhost:3000` to see the app running.

## Development

To start the app with the Twitter stream initialized, set `STREAM=true`. This allows for conditionally connecting to the twitter stream, which is important to limit requests when in development.
```
STREAM=true node server.js
````

Navigate over to `localhost:8080`, open the console, and you should see tweet topics being logged.

Subscribe to specific topics by clicking the keyword. The count indicates how many tweets have come through. You can view the tweets by opening the chrome console.

See a list of all available topics make requests to `/topics`.

```
curl localhost:8080/topics
````

## TODO
* Implement gulp to serve assets
* Port original tweetbeat assets to node app, using websockets directly
* Redo client-side app - look into react.
* Show 'connecting' loading screen
* Show error if websocket not connected.
