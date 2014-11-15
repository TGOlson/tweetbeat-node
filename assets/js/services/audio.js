/*
 * Third-party dependencies
 */

var _ = require('lodash'),
    Q = require('q');


/*
 * Internal dependencies
 */

var SAMPLE_LIBRARIES = require('../constants/sample-libraries');


/*
 * Module definition
 */

var Audio = {};

// TODO: clean up module syntax

var context;

Audio.isReady = false;

Audio._sampleBuffers = [];

// default current library to first library
Audio._currentLibrary = SAMPLE_LIBRARIES[0];

var masterGain;
var filter;
var audioConstants;


/*
 * Public methods
 */

Audio.init = function(){
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  currentLibrary = 0;
  audioConstants = initializeConstants();
  initializeFilter();
  initializeGain();
  connectNodes();
  this._bufferSamples();
  return this;
};

Audio.playSample = function(index){
  var source = context.createBufferSource();

  // create getBuffer method
  source.buffer = this._getBuffer(index);
  filter.on ? source.connect(filter) : source.connect(masterGain);
  source.start(0);
};

Audio.changeVolume = function(volume){
  masterGain.gain.value = (volume / 100) * (volume / 100);
};

function changeFrequency(x){
  var powerOfTwo = audioConstants.noctaves * (x / 150 - 1);
  filter.frequency.value = Math.pow(2, powerOfTwo) * audioConstants.nyquist;
}

function changeQ(y){
  filter.Q.value = y * audioConstants.qmult;
}

function toggleFilter(){
  filter.on = !filter.on;
}

Audio.changeLibrary = function(library){
  this._currentLibrary = library;
};


/*
 * Private methods
 */

Audio._bufferSamples = function(){
  this._sampleBuffers = _.clone(SAMPLE_LIBRARIES);

  var promises = _.map(this._sampleBuffers, (sampleSet, i) => {
    return this._loadSampleSet(sampleSet).then((samples) => {
      this._sampleBuffers[i].samples = samples;
    });
  });

  return Q.all(promises).then(() => {
    this.isReady = true;
  });
};

Audio._loadSampleSet = function(sampleSet) {
  var promises = _.map(sampleSet.samples, (sampleURL) => {
    return this._loadSample(sampleURL);
  });

  return Q.all(promises);
};

Audio._loadSample = function(sampleURL){
  var deferred = Q.defer(),
      request = new XMLHttpRequest();

  request.open('GET', sampleURL, true);
  request.responseType = 'arraybuffer';

  request.onload = function(){
    context.decodeAudioData(request.response, function(buffer) {
      deferred.resolve(buffer);
    });
  };

  request.onerror = function(){
    alert('BufferLoader : XHR error');
  };

  request.send();

  return deferred.promise;
};

Audio._getBuffer = function(index) {
  return this._currentLibrary.samples[index];
};

function initializeConstants(){
  return {
    nyquist: context.sampleRate * 0.5,
    noctaves: Math.log(context.sampleRate / 15) / Math.LN2,
    qmult: 3/15
  };
}

function initializeFilter(){
  filter = context.createBiquadFilter();
  filter.type = 0;
  filter.frequency.value = 20000;
  filter.on = false;
}

function initializeGain(){
  masterGain = context.createGain();
  masterGain.gain.value = 1;
}

function connectNodes(){
  filter.connect(masterGain);
  masterGain.connect(context.destination);
}

module.exports = Audio;
