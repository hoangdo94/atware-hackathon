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
  "avgWPM": {
    type: Number,
    label: "Average words per minute.",
    defaultValue: 0
  },
  "avgAccuracy": {
    type: Number,
    label: "Average accuracy (%).",
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
