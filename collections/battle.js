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
  createTime: {
    type: Date,
    label: "Create time of the battle.",
    optional: true,
    autoform: {
      omit: true
    }
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
  },
  battleText: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  battleTextArr: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
  }
  },
  battleLog: {
    type: [Object],
    defaultValue: [],
    blackbox: true,
    autoform: {
      omit: true
    }
  },
  winnerId: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
});

let BattleUserSchema = new SimpleSchema({
  "userId": {
    type: String,
    label: "The ID of the user."
  },
  "wpm": {
    type: Number,
    defaultValue: 0
  },
  "accuracy": {
    type: Number,
    defaultValue: 0
  },
  "currentHp": {
    type: Number,
    defaultValue: 100
  },
  "wordsCompleted": {
    type: Number,
    defaultValue: 0
  },
  "result": {
    type: String,
    defaultValue: ''
  }
});

Battle.attachSchema(BattleSchema);
