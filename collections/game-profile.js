/**
 * Created by hoangdo on 1/16/16.
 */
GameProfile = new Meteor.Collection('gameProfile');

GameProfile.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

GameProfile.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let GameProfileSchema = new SimpleSchema({
  "userId": {
    type: String,
    label: "The ID of the user."
  },
  "nickname": {
    type: String,
    label: "The nickname of the user.",
    optional: true
  },
  "points": {
    type: Number,
    label: "The points of the user.",
    defaultValue: 0
  },
  "wordsCompleted": {
    type: Number,
    label: "Number of completed words.",
    defaultValue: 0,
    decimal: true
  },
  "wordsMissed": {
    type: Number,
    label: "Number of missed words.",
    defaultValue: 0,
    decimal: true
  },
  "timePlayed": {
    type: Number,
    label: "Total play time (in seconds).",
    defaultValue: 0,
    decimal: true
  },
  "gamesPlayed": {
    type: [String],
    label: "All played games.",
    defaultValue: []
  },
  "gamesWon": {
    type: [String],
    label: "All won games.",
    defaultValue: []
  },
  modelsOwned: {
    type: [String],
    label: "All owned Vodkar models.",
    defaultValue: []
  },
  currentModel: {
    type: String,
    optional: true,
  }
});

GameProfile.attachSchema(GameProfileSchema);
