# tweetbeat-node

Summoning the ghost of Tweetbeat past - in node. [Original Tweetbeat](https://github.com/TGOlson/tweetbeat.git).

## About

Web-based synthesizer that can be played by Twitter.

Implemented using an event-driven node architecture with websockets. Clients subscribe to tweet topics by sending subscription requests to the server - once the server receives a tweet, it notifies any subscribed parties.

Client side code is written using ES6, and makes use of a similar event-driven pattern, using React and Flux to achieve a unidirectional data flow.

## Setup

Install dependencies

```
$ npm install
$ npm install -g gulp
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
$ gulp
```

This will compile necessary assets from `assets/` to `public/`, as well as start the server. Asset compilation can be done manually using `gulp compile`.

(note: if the browser has trouble finding `bundle.js`, try restarting the server)

In addition, because re-connections to the Twitter steaming API are monitored, this will not start the Twitter stream. To start the app with the Twitter stream enabled

```
$ gulp --stream
```

(this effectively runs the app with the environment variable `STREAM=true`)

Navigate to `localhost:8080` to see the app.

In the terminal you should see a new connection

```
OPENED websocket connection: client_1
Current sockets: 1
```

## Development

Start the app with the Twitter stream initialized, set `STREAM=true`. This allows for conditionally connecting to the twitter stream, which is important to limit requests when in development.

```
$ gulp --stream
````

Navigate over to `localhost:8080`, open the console, and you should see tweet topics being logged.

Subscribe to specific topics by clicking the keyword. The count indicates how many tweets have come through. You can view the tweets by opening the chrome console.

See a list of all available topics, make requests to `/topics`.

```
curl localhost:8080/topics
````

## Helpful React/Flux Reads

* https://github.com/facebook/flux/tree/master/examples/flux-todomvc
* http://facebook.github.io/react/blog/2014/05/06/flux.html
* http://facebook.github.io/flux/docs/todo-list.html
* https://github.com/enaqx/awesome-react
* https://github.com/prabirshrestha/hn-react
* http://facebook.github.io/react/docs/events.html

## TODO
* Touch up README with technologies
* Bring in express for routing and serving assets
* Check bug where scripts need to be compiled twice on cold server start (express might fix this)
* Look into server side templating with React
* Port original tweetbeat assets to node app, using websockets directly
* Show 'connecting' loading screen
* Show error if websocket not connected or not supported.
