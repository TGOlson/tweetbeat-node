/*
 * Third-party dependencies
 */

var _ = require('lodash');


/*
 * Internal dependencies
 */

var sampleLibrary = require('../constants/sample-library');


/*
 * Module definition
 */

var Audio = {};

// TODO: clean up module syntax

var context;

var sampleBuffers = [];
var masterGain;
var filter;
var audioConstants;
var currentLibrary;

Audio.init = function(){
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  currentLibrary = 0;
  audioConstants = initializeConstants();
  initializeFilter();
  initializeGain();
  connectNodes();
  bufferSamples();
};

Audio.playSample = function(index){
  var source = context.createBufferSource();
  source.buffer = sampleBuffers[currentLibrary][index];
  filter.on ? source.connect(filter) : source.connect(masterGain);
  source.start(0);
};

function changeVolume(volume){
  masterGain.gain.value = (volume / 100) * (volume / 100);
}

function loadSample(sampleURL, lib, index){
  var request = new XMLHttpRequest();
  request.open('GET', sampleURL, true);
  request.responseType = 'arraybuffer';

  request.onload = function(){
    context.decodeAudioData(request.response, function(buffer){
      sampleBuffers[lib][index] = buffer;
    }, onerror);
  };

  request.onerror = function(){
    alert('BufferLoader : XHR error');
  };

  request.send();
}

function initializeConstants(){
  return {
    nyquist: context.sampleRate * 0.5,
    noctaves: Math.log(context.sampleRate / 15) / Math.LN2,
    qmult: 3/15
  };
}

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

function changeLibrary(lib){
  currentLibrary = lib;
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

function bufferSamples(){
  _.map(sampleLibrary, function(sampleSet, i) {

    // create empty container for sample set
    // TODO: this should be a named object
    sampleBuffers[i] = [];

    _.map(sampleSet, function(sample, j) {
      loadSample(sample, i, j);
    });
  });
}

module.exports = Audio;
