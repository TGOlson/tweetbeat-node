"use strict";
$(init);
console.log('tracueiring');
var Greeter = function Greeter(message) {
  this.message = message;
};
($traceurRuntime.createClass)(Greeter, {greet: function() {
    console.log(this.message);
  }}, {});
var greeter = new Greeter('Hello, world!');
greeter.greet();
function init() {
  var socket = new Socket();
  var callback = function(data) {
    console.log(data);
    incrementCount(data.topic);
  };
  setTopics();
  $('#tweet-topics').click('li', function(e) {
    var $topic = $(e.target).closest('.topic'),
        text = $topic.find('.topic-text').text();
    $topic.toggleClass('active');
    if ($topic.hasClass('active')) {
      socket.on(text, callback);
    } else {
      socket.removeListener(text);
    }
  });
}
function setTopics() {
  $.get('/topics', function(response) {
    response.forEach(addTopic);
  });
}
function addTopic(topic) {
  var $li = $('<li>').addClass('topic').attr({id: topic.toLowerCase().replace(' ', '-')}),
      $topic = $('<span>').addClass('topic-text').text(topic),
      $count = $('<span>').addClass('count').text('0');
  $li.append($topic, $count);
  $('#tweet-topics').append($li);
}
function incrementCount(topic) {
  topic = topic.toLowerCase().replace(' ', '-');
  var $count = $('#' + topic).find('.count'),
      prevCount = $count.text(),
      currentCount = parseInt(prevCount) + 1;
  $count.text(currentCount);
}

"use strict";
var Socket = function() {
  var host = location.origin.replace('http', 'ws');
  _this = this;
  this._socket = new WebSocket(host);
  this._setMessageHandler(function(data) {
    _this.emit(data.topic, data);
  });
  this._setOpenHandler(function(event) {
    console.log('Opened', event);
  });
  this._setErrorHandler(function(event) {
    console.log('Error', event);
  });
  this._setCloseHandler(function(event) {
    console.log('Close', event);
  });
  window.socket = this;
};
Socket.prototype._events = {};
Socket.prototype.on = function(event, callback) {
  this._setHandler(event, callback);
  this._modifySubscriptions('subscribe', event);
};
Socket.prototype.removeListener = function(event, callback) {
  this._removeHandler(event);
  this._modifySubscriptions('unsubscribe', event);
};
Socket.prototype.send = function(data) {
  data = JSON.stringify(data);
  if (this._isOpen()) {
    this._socket.send(data);
  } else {
    console.log('Socket connection is closed. Try refreshing client or reconnecting.');
  }
};
Socket.prototype.emit = function(event, data) {
  var handler = this._events[event];
  if (handler)
    handler(data);
};
Socket.prototype._setMessageHandler = function(handler) {
  this._socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    handler(data);
  };
};
Socket.prototype._setOpenHandler = function(handler) {
  this._socket.onopen = handler;
};
Socket.prototype._setErrorHandler = function(handler) {
  this._socket.onerror = handler;
};
Socket.prototype._setCloseHandler = function(handler) {
  this._socket.onclose = handler;
};
Socket.prototype._setHandler = function(event, handler) {
  if (this._events[event])
    console.log('Handler already set for', event);
  this._events[event] = handler;
};
Socket.prototype._removeHandler = function(event) {
  if (!this._events[event])
    console.log('No handler set for', event);
  delete this._events[event];
};
Socket.prototype._modifySubscriptions = function(action, event) {
  var message = {
    action: action,
    event: event
  };
  this.send(message);
};
Socket.prototype._viewEvents = function() {
  var events = this._events;
  console.log(events);
};
Socket.prototype._isOpen = function() {
  return this._socket.readyState === 1;
};

"use strict";
var App = {};
App.init = function() {
  Layout.init();
  initializeAudio();
  Scrolling.init();
  Topics.init();
  Stream.init();
};
$(App.init);

"use strict";

"use strict";
var Layout = {
  bindings: {
    81: '0',
    87: '1',
    69: '2',
    65: '3',
    83: '4',
    68: '5',
    90: '6',
    88: '7',
    67: '8'
  },
  init: function() {
    this.checkIfChrome();
    this.callHelperFunctions();
    this.applyEventListeners();
  },
  checkIfChrome: function() {
    var chrome = /chrome/.test(navigator.userAgent.toLowerCase());
    if (!chrome) {
      var message = 'It looks like you aren\'t using Chrome.\n\n' + 'Because of this, the audio may be limited or non-functioning.\n\n' + 'Sorry about that.';
      alert(message);
    }
  },
  callHelperFunctions: function() {
    this.bindClicksToSounds();
    this.bindKeypressesToSounds();
    this.bindControlToDisplayToggle();
    this.setDropArea();
    this.setDeletionField();
    this.setSliderStyle();
  },
  applyEventListeners: function() {
    $('.topic').draggable({
      helper: "clone",
      revert: "invalid"
    });
    $('#toggle_view').on('click', this.toggleView);
    $('.filter-toggle').on("click", this.filterToggleButton);
    $('#xy').on("mousemove", this.xyPadPosition);
    $('#next').on("click", this.nextLib);
    $('#prev').on("click", this.prevLib);
  },
  nextLib: function() {
    if ($('#library ul').find('.current-lib').is(':last-child')) {
      return;
    }
    var lib = $('ul').find('.current-lib').next().attr("lib-id");
    changeLibrary(lib);
    $('ul').find('.current-lib').next().addClass('current-lib');
    $('ul').find('.current-lib').first().removeClass('current-lib');
  },
  prevLib: function() {
    if ($('#library ul').find('.current-lib').is(':first-child')) {
      return;
    }
    var lib = $('ul').find('.current-lib').prev().attr("lib-id");
    changeLibrary(lib);
    $('ul').find('.current-lib').prev().addClass('current-lib');
    $('ul').find('.current-lib').last().removeClass('current-lib');
  },
  bindClicksToSounds: function() {
    $('#synth_pads').on("click", 'li', function(e) {
      Layout.invokeHitAction(e.target.id);
    });
  },
  bindKeypressesToSounds: function() {
    $(document).on("keydown", function(e) {
      if (Layout.bindings[e.which] != undefined) {
        Layout.invokeHitAction(Layout.bindings[e.which]);
      }
    });
  },
  invokeHitAction: function(padNumber) {
    playSample(padNumber);
    Layout.flashColor(padNumber);
  },
  bindControlToDisplayToggle: function() {
    $(document).bind("keydown keyup", function(e) {
      if (e.which === 17) {
        $('.ctrl_bound').toggleClass('hidden');
      }
    });
  },
  setDropArea: function() {
    $('#synth_pads li').droppable({
      hoverClass: "drop_hover",
      drop: function(event, ui) {
        var keywordText = $(ui.helper[0]).text();
        var keywordID = Topics.list.indexOf(keywordText).toString();
        Layout.unbindIfPadHasKeyword(this);
        Layout.playTransferEffect(ui.helper, this);
        Layout.placeKeyWordInPad(keywordID, this);
        Stream.bindKeywordToSound(keywordID, event.target.id);
      }
    });
  },
  setDeletionField: function() {
    $('.deletion-field').droppable({
      accept: ".keyword_dropped",
      activeClass: "deletion-active",
      hoverClass: "deletion-hover",
      drop: function(event, ui) {
        Layout.playFastTransferEffect(ui.helper, this);
      }
    });
  },
  unbindIfPadHasKeyword: function(target) {
    var soundID = target.id;
    var keywordID = $(target).contents('div').last().attr('id');
    var eventName = keywordID;
    if (keywordID != undefined) {
      Stream.removeBoundKeywordFromSound(eventName);
    }
  },
  playTransferEffect: function(keyword, target) {
    $(keyword).effect("transfer", {
      to: target,
      className: "ui-effects-transfer"
    }, 100).fadeOut(100);
  },
  playFastTransferEffect: function(keyword, target) {
    $(keyword).effect("transfer", {
      to: target,
      className: "ui-effects-transfer"
    }, 1).fadeOut(1);
  },
  placeKeyWordInPad: function(keywordID, target) {
    var keyword = Topics.list[keywordID];
    $(target).find('.drop_area')[0].id = keywordID;
    $(target).find('.drop_area').addClass('keyword_dropped').html('<div class="dropped_keyword">' + keyword + '</div>').hide().css('top', 40).css('left', 0).fadeIn();
  },
  setSliderStyle: function() {
    $("#slider-vertical").slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 60,
      slide: function(event, ui) {
        Layout.setVolume(ui.value);
      }
    });
  },
  toggleView: function() {
    if ($('body').hasClass('visual')) {
      Layout.showSynth();
    } else {
      Layout.showVisual();
    }
    Layout.toggleSynthVisualClass();
  },
  showVisual: function() {
    $('#circle_toggle').animate({left: '31px'}, 100);
    $('#toggle_icon').animate({left: '5px'}, 100);
    Visualizer.start();
  },
  showSynth: function() {
    $('#circle_toggle').animate({left: '0px'}, 100);
    $('#toggle_icon').animate({left: '30px'}, 100);
    Visualizer.stop();
  },
  toggleSynthVisualClass: function() {
    $('#toggle_icon').find('i').toggle();
    $('body').toggleClass('visual');
    $('#toggle_view').toggleClass('synth_view');
  },
  landKeywordOnPad: function(soundID) {
    var target = $('#synth_pads #' + soundID).find('.keyword_dropped');
    this.makeKeywordPadDraggable(target);
  },
  makeKeywordPadDraggable: function(target) {
    $(target).draggable({revert: function(valid) {
        if (!valid) {
          var keywordID = $(this).attr('id');
          var soundID = $(this).closest('li').attr('id');
          setTimeout(function() {
            Stream.bindKeywordToSound(keywordID, soundID);
          }, 500);
        }
        return !valid;
      }}).on('mousedown', function(e) {
      var soundID = $(e.originalEvent.target).closest('li').attr('id');
      var keywordID = $(e.target).closest('.drop_area').attr('id');
      var eventName = keywordID;
      Stream.removeBoundKeywordFromSound(eventName);
      Layout.addTopicStyle(e);
    }).on('mouseup', Layout.removeTopicStyle);
  },
  addTopicStyle: function(e) {
    $(e.target).addClass('topic');
  },
  removeTopicStyle: function(e) {
    $(e.target).removeClass('topic');
  },
  flashColor: function(soundID) {
    var possibleTargets = $('#synth_pads #' + soundID);
    for (var i = 0; i < possibleTargets.length; i++) {
      if (possibleTargets[i].nodeName == 'LI') {
        var target = possibleTargets[i];
      }
    }
    $(target).addClass('pad_hit');
    setTimeout(function() {
      $(target).removeClass('pad_hit');
    }, 190);
  },
  xyPadPosition: function(e) {
    var position = Layout.getCanvasPos(this, e);
    changeFrequency(position.x);
    changeQ(position.y);
  },
  getCanvasPos: function(canvas, move) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: move.clientX - rect.left,
      y: (move.clientY - rect.top) * (-1) + (150)
    };
  },
  filterToggleButton: function() {
    toggleFilter();
    $('.filter-toggle').toggleClass("filter-on");
  },
  setVolume: function(volume) {
    changeVolume(volume);
  }
};

"use strict";
var sampleBuffers = [],
    context,
    masterGain,
    filter,
    audioConstants,
    currentLibrary;
var sampleLibrary = [["audio/Dminor_space_chord_root.mp3", "audio/Dminor_space_chord_root+2.mp3", "audio/Dminor_space_chord_root-2.mp3", "audio/Dminor_space_bass.mp3", "audio/Dminor_space_bass_+2-1.mp3", "audio/Dminor_space_bass_-2.mp3", "audio/Kick.mp3", "audio/twinkle.mp3", "audio/Airlock.mp3"], ["audio/D.mp3", "audio/D_3rd.mp3", "audio/D_5th.mp3", "audio/pew.mp3", "audio/hat2.mp3", "audio/fuck_you.mp3", "audio/correctimundo.mp3", "audio/whats_the_matter.mp3"], ["audio/hiphop/yo.mp3", "audio/hiphop/nelly.mp3", "audio/hiphop/piano.mp3", "audio/hiphop/clap.mp3", "audio/hiphop/scratch1.mp3", "audio/hiphop/scratch2.mp3", "audio/hiphop/kick.mp3", "audio/hiphop/hat.mp3", "audio/hiphop/snare.mp3"], ["audio/mario/1up.mp3", "audio/mario/Bowser.mp3", "audio/mario/Coin.mp3", "audio/mario/Kick-1.mp3", "audio/mario/Mario-dies.mp3", "audio/mario/Pipe.mp3", "audio/mario/Power-appears.mp3", "audio/mario/Power-up.mp3", "audio/mario/Stomp.mp3"]];
function playSample(index) {
  var source = context.createBufferSource();
  source.buffer = sampleBuffers[currentLibrary][index];
  filter.on ? source.connect(filter) : source.connect(masterGain);
  source.noteOn;
  source.start(0);
}
function changeVolume(volume) {
  masterGain.gain.value = (volume / 100) * (volume / 100);
}
function loadSample(sampleURL, lib, index) {
  var request = new XMLHttpRequest();
  request.open("GET", sampleURL, true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      sampleBuffers[lib][index] = buffer;
    }, onerror);
  };
  request.onerror = function() {
    alert("BufferLoader : XHR error");
  };
  request.send();
}
function initializeConstants() {
  return {
    nyquist: context.sampleRate * 0.5,
    noctaves: Math.log(context.sampleRate / 15) / Math.LN2,
    qmult: 3 / 15
  };
}
function changeFrequency(x) {
  var powerOfTwo = audioConstants.noctaves * (x / 150 - 1);
  filter.frequency.value = Math.pow(2, powerOfTwo) * audioConstants.nyquist;
}
function changeQ(y) {
  filter.Q.value = y * audioConstants.qmult;
}
function toggleFilter() {
  filter.on ? filter.on = false : filter.on = true;
}
function changeLibrary(lib) {
  currentLibrary = lib;
}
function initializeFilter() {
  filter = context.createBiquadFilter();
  filter.type = 0;
  filter.frequency.value = 20000;
  filter.on = false;
}
function initializeGain() {
  masterGain = context.createGain();
  masterGain.gain.value = 1;
}
function connectNodes() {
  filter.connect(masterGain);
  masterGain.connect(context.destination);
}
function bufferSamples() {
  for (lib = 0; lib < sampleLibrary.length; lib++) {
    sampleBuffers[lib] = [];
    for (index = 0; index < sampleLibrary[lib].length; index++) {
      loadSample(sampleLibrary[lib][index], lib, index);
    }
  }
}
function initializeAudio() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  currentLibrary = 0;
  audioConstants = initializeConstants();
  initializeFilter();
  initializeGain();
  connectNodes();
  bufferSamples();
}

"use strict";
var Scrolling = {
  firstTopicIndex: 0,
  init: function() {
    $('#up-button').on("click", function() {
      Scrolling.firstTopicIndex -= Topics.eachPageListingLength;
      if (Scrolling.firstTopicIndex >= 0) {
        Topics.rewriteListings(Scrolling.firstTopicIndex);
      } else {
        Scrolling.firstTopicIndex += Topics.eachPageListingLength;
      }
    });
    $('#down-button').on("click", function() {
      Scrolling.firstTopicIndex += Topics.eachPageListingLength;
      if (Scrolling.firstTopicIndex <= Topics.list.length - 1) {
        Topics.rewriteListings(Scrolling.firstTopicIndex);
      } else {
        Scrolling.firstTopicIndex -= Topics.eachPageListingLength;
      }
    });
  }
};

"use strict";
var eventPolyfill = {events: {
    0: document.createEvent('Event'),
    1: document.createEvent('Event'),
    2: document.createEvent('Event'),
    3: document.createEvent('Event'),
    4: document.createEvent('Event')
  }};
eventPolyfill.on = function(eventName, handler) {
  console.log('Listening for', eventName);
  document.addEventListener(eventName, handler, false);
};
eventPolyfill.off = function(eventName, handler) {
  console.log('Trying to stop Listening to event', eventName);
  document.removeEventListener(eventName, handler);
};
var Stream = {
  source: eventPolyfill,
  handler: null
};
Stream.init = function() {
  console.log('initing stream');
  $.each(eventPolyfill.events, function(eventName, event) {
    event.initEvent(eventName, true, true);
  });
  var host = 'ws://localhost:8080',
      socket = new WebSocket(host);
  socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    if (data.topicId) {
      var docEvent = eventPolyfill.events[data.topicId];
      document.dispatchEvent(docEvent);
    }
  };
};
Stream.bindKeywordToSound = function(keywordID, soundID) {
  Layout.landKeywordOnPad(soundID);
  var eventHandler = function(e) {
    playSample(soundID);
    Layout.flashColor(soundID);
  };
  this.source.on(keywordID, eventHandler);
  this.handler = eventHandler;
};
Stream.removeBoundKeywordFromSound = function(eventName) {
  this.source.off(eventName, this.handler);
};

"use strict";
var Topics = {
  list: null,
  eachPageListingLength: 15,
  init: function() {
    $.get('/topics', function(data) {
      Topics.list = data;
    });
  },
  rewriteListings: function(startIndex) {
    startIndex = parseInt(startIndex, 10);
    topicHolders = $('.deletable');
    topicsLeft = Topics.list.length - startIndex;
    if (topicsLeft < Topics.eachPageListingLength) {
      var maxLoopLength = topicsLeft;
    } else {
      var maxLoopLength = Topics.eachPageListingLength;
    }
    for (var i = 0; i < Topics.eachPageListingLength; i++) {
      $(topicHolders[i]).html("");
      $(topicHolders[i]).addClass('hidden');
    }
    for (var i = 0; i < maxLoopLength; i++) {
      $(topicHolders[i]).removeClass('hidden');
      $(topicHolders[i]).append("<li class='topic' id=" + (startIndex + i) + ">" + Topics.list[startIndex + i] + "</li>");
    }
    $('.topic').draggable({
      helper: "clone",
      revert: "invalid"
    });
  }
};

"use strict";
var Visualizer = {
  color: d3.scale.category20c(),
  width: $(window).width() - 5,
  height: $(window).height() - 5,
  svg: null,
  start: function() {
    this.setSvgCanvas();
    this.populate();
    $('svg').on('click', 'circle', this.keywordClickEvent);
  },
  setSvgCanvas: function(width, height) {
    Visualizer.svg = d3.select("body").append("svg").attr("width", Visualizer.width).attr("height", Visualizer.height);
    Visualizer.svg.append("rect").attr("width", Visualizer.width).attr("height", Visualizer.height);
  },
  populate: function() {
    $.each($('.keyword_dropped'), function(i, e) {
      var xloc = Math.random() * (Visualizer.width - 100) + 50;
      var yloc = Math.random() * (Visualizer.height - 100) + 50;
      var color = Visualizer.color(Visualizer.randNum(20, 1));
      Visualizer.svg.insert('circle').attr('id', 'visual-' + e.id).attr("cx", xloc).attr("cy", yloc).attr("r", 20).attr('keyword', $(e).find('div').text().split(' ')[0]).style("stroke", 'none').style("fill", color).style("fill-opacity", .5);
      Visualizer.setEventForVisuals(e.id);
    });
  },
  setEventForVisuals: function(keywordID) {
    $(Stream.source).on(keywordID, function() {
      Visualizer.appendNewCircle(keywordID);
    });
  },
  keywordClickEvent: function(e) {
    var keywordID = $(e.target).attr('id');
    var keyword = $('#' + keywordID);
    Visualizer.svg.insert("text").attr("x", keyword.attr('cx') - 30).attr("y", keyword.attr('cy')).text(keyword.attr('keyword')).style('fill', keyword.attr('style').split(' ')[3].slice(0, 7)).style("stroke-opacity", .5).transition().duration(700).ease(Math.sqrt).attr("transform", "translate(" + Visualizer.randTransform() + "," + Visualizer.randTransform() + ")").style("fill-opacity", 1e-6).remove();
  },
  appendNewCircle: function(keywordID) {
    var keyword = $('#visual-' + keywordID);
    Visualizer.svg.insert("circle", "rect").attr("cx", keyword.attr('cx')).attr("cy", keyword.attr('cy')).attr("r", 40).style("stroke", Visualizer.color(Visualizer.randNum(20, 1))).style("stroke-opacity", .5).style('fill', 'none').transition().duration(Visualizer.randNum(2000, 1000)).ease(Math.sqrt).attr("r", Visualizer.randNum(1000, 100)).style("stroke-opacity", 1e-6).remove();
  },
  randNum: function(mult, add) {
    return Math.round(Math.random() * mult + add);
  },
  randTransform: function() {
    return Visualizer.randNum(2, -1) * Visualizer.randNum(100, 1);
  },
  stop: function() {
    $('svg').remove();
  }
};
