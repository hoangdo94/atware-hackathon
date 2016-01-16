/**
 * Created by hoangdo on 1/16/16.
 */
Battle = new Meteor.Collection('battle');

Battle.allow({
  insert: (userId, doc) => !!userId,
  update: (userId, doc) => !!userId,
  remove: (userId, doc) => !!userId
});

let BattleSchema = new SimpleSchema({
  creatorId: {
    type: String,
    label: "User who created this battle",
    autoform: {
      omit: true
    }
  },
  title: {
    type: String,
    label: "Name the battle"
  },
  users: {
    type: [BattleUserSchema],
    label: "Participated users",
    defaultValue: [],
    minCount: 0,
    maxCount: 2,
    autoform: {
      omit: true
    },
    blackbox: true
  },
  startTime: {
    type: Date,
    label: "Start time of the battle.",
    optional: true,
    autoform: {
      omit: true
    }
  },
  endTime: {
    type: Date,
    label: "End time of the battle.",
    optional: true,
    autoform: {
      omit: true
    }
  }
});

let BattleUserSchema = new SimpleSchema({
  "userId": {
    type: String,
    label: "The ID of the user."
  },
  "userEmail": {
    type: String,
    label: "The Email of the user."
  },
  "wpm": {
    type: Number,
    defaultValue: 0,
  },
  "accuracy": {
    type: Number,
    defaultValue: 0,
  },
  "result": {
    type: Number, //0 - lose, 1 - draw, 2 - win,
    optional: true
  }
});

Battle.attachSchema(BattleSchema);
