class Socket {
  constructor() {
    this._host = location.origin.replace('http', 'ws');
    this._socket = new WebSocket(this._host);
    this._events = {};

    this._setMessageHandler((data) => {
      this.emit(data.topic, data);
    });

    // other handlers
    this._setOpenHandler((event) => {
      console.log('Opened', event);
    });

    this._setErrorHandler((event) => {
      console.log('Error', event);
    });

    this._setCloseHandler((event) => {
      console.log('Close', event);
    });
  }

  // socket.on sets an event handler for the specified event
  // and also alerts the server to start sending those events
  on(event, callback) {
    this._setHandler(event, callback);
    this._modifySubscriptions('subscribe', event);
  }

  // socket.removeListener removes an event handler for the specified event
  // and also alerts the server to stop sending those events
  removeListener(event, callback) {
    this._removeHandler(event);
    this._modifySubscriptions('unsubscribe', event);
  }

  send(data) {
    data = JSON.stringify(data);

    if(this._isOpen()) {
      this._socket.send(data);
    } else {
      console.log('Socket connection is closed. Try refreshing client or reconnecting.');
    }
  }

  emit(event, data) {
    let handler = this._events[event];
    if(handler) handler(data);
  }


  /*
   * Private instance methods
   */

  _setMessageHandler(handler) {
    this._socket.onmessage = (event) => {
      let data = JSON.parse(event.data);
      handler(data);
    };
  }

  // refactor these if they don't do anything extra besides setting callbacks
  _setOpenHandler(handler) {
    this._socket.onopen = handler;
  }

  _setErrorHandler(handler) {
    this._socket.onerror = handler;
  }

  _setCloseHandler(handler) {
    this._socket.onclose = handler;
  }

  // naive implementation of events
  // each event can only have one listener
  _setHandler(event, handler) {

    // for dev purposes only
    if(this._events[event]) console.log('Handler already set for', event);

    this._events[event] = handler;
  }

  // naive implementation of events
  // each event can only have one listener
  _removeHandler(event) {

    // for dev purposes only
    if(!this._events[event]) console.log('No handler set for', event);

    delete this._events[event];
  }

  _modifySubscriptions(action, event) {
    let message = {
      action: action,
      event: event
    };

    this.send(message);
  }

  // development only
  // events should be an object of keywords with associated callbacks
  // in the case of tweetbeat, the callbacks are calls to audio plays
  _viewEvents() {
    let events = this._events;

    // later this might want to map functions to their respective audio
    // so output looks like
    // {'USA': 'audio-file-name', etc.}

    console.log(events);
  }

  // CONNECTING  0 The connection is not yet open.
  // OPEN  1 The connection is open and ready to communicate.
  // CLOSING 2 The connection is in the process of closing.
  // CLOSED  3 The connection is closed or couldn't be opened.
  _isOpen() {
    return this._socket.readyState === 1;
  }
}
