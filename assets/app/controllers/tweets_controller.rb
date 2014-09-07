# values hard-coded for now
# later they will be defined by node server

# use shorter list for development
# this needs to match list in server.js

TOPICS = [
  # "Coffee",
  # "Tea",
  # "DBCsleeps",
  "Canada",
  "USA",
  # "California",
  "Tesla",
  # "Spring",
  # "Summer",
  # "Autumn",
  # "Winter",
  # "Santa",
  # "Snowman",
  "Moltar",
  # "Hurricane",
  # "Tornado",
  # "Earthquake",
  # "Tsunami",
  # "Blizzard",
  # "Godzilla",
  "King Kong",
  # "John Lennon",
  # "Voltar",
  # "Tapioca",
  # "Star Wars",
  # "Xolov"
]

SYNTH = [
  ['q', 'SYNTH1'],
  ['w', 'SYNTH2'],
  ['e', 'SYNTH3'],
  ['a',  'BASS1'],
  ['s',  'BASS2'],
  ['d',  'BASS3'],
  ['z',  'KICK1'],
  ['x',  'KICK2'],
  ['c',  'PERC3']
]

class TweetsController < ApplicationController
  def index
    @topics = TOPICS
    @bindings_and_names = SYNTH
  end

  def topics
    render json: TOPICS
  end
end
