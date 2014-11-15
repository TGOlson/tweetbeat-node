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

Audio.isReady = false;

Audio._currentLibrary = SAMPLE_LIBRARIES[0];
Audio._sampleBuffers = [];
Audio._masterGain = null;
Audio._constants = null;
Audio._context = null;
Audio._filter = null;


/*
 * Public methods
 */

Audio.init = function() {
  this._setContext();
  this._initializeConstants();
  this._initializeFilter();
  this._initializeGain();
  this._connectNodes();
  this._bufferSamples();

  return this;
};

Audio.playSample = function(index) {
  var source = this._context.createBufferSource(),
      values = this._filter.on ? this._filter : this._masterGain;

  source.buffer = this._getBuffer(index);
  source.connect(values);
  source.start(0);
};

Audio.changeVolume = function(volume) {
  this._masterGain.gain.value = (volume / 100) * (volume / 100);
};

Audio.changeFrequency = function(x) {
  var powerOfTwo = this._constants.noctaves * (x / 150 - 1);
  this._filter.frequency.value = Math.pow(2, powerOfTwo) * this._constants.nyquist;
};

Audio.changeQ = function(y) {
  this._filter.Q.value = y * this._constants.qmult;
};

Audio.toggleFilter = function() {
  this._filter.on = !this._filter.on;
};

Audio.getCurrentLibraryType = function() {
  return this._currentLibrary.type;
};

Audio.prevLib = function() {
  this._toggleLibByIndexShift(-1);
};

Audio.nextLib = function() {
  this._toggleLibByIndexShift(1);
};


/*
 * Private methods
 */

Audio._setContext = function() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  this._context = new AudioContext();
};

Audio._bufferSamples = function() {
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

Audio._loadSample = function(sampleURL) {
  var deferred = Q.defer(),
      request = new XMLHttpRequest();

  request.open('GET', sampleURL, true);
  request.responseType = 'arraybuffer';

  request.onload = () => {
    this._context.decodeAudioData(request.response, function(buffer) {
      deferred.resolve(buffer);
    });
  };

  request.onerror = () => {
    alert('BufferLoader : XHR error');
  };

  request.send();

  return deferred.promise;
};

Audio._getBuffer = function(index) {
  return this._currentLibrary.samples[index];
};

Audio._initializeConstants = function(){
  this._constants = {
    nyquist: this._context.sampleRate * 0.5,
    noctaves: Math.log(this._context.sampleRate / 15) / Math.LN2,
    qmult: 3/15
  };
};

Audio._initializeFilter = function() {
  this._filter = this._context.createBiquadFilter();
  this._filter.type = 0;
  this._filter.frequency.value = 20000;
  this._filter.on = false;
};

Audio._initializeGain = function() {
  this._masterGain = this._context.createGain();
  this._masterGain.gain.value = 1;
};

Audio._connectNodes = function() {
  this._filter.connect(this._masterGain);
  this._masterGain.connect(this._context.destination);
};

Audio._toggleLibByIndexShift = function(shift) {
  var index = _.indexOf(SAMPLE_LIBRARIES, this._currentLibrary),
      library = SAMPLE_LIBRARIES[index + shift];

  if(library) this._changeLibrary(library);
};

Audio._changeLibrary = function(library) {
  if(!library) throw new Error('Unknown library.');
  this._currentLibrary = library;
};


module.exports = Audio;
