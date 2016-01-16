/**
 * Created by hoangdo on 1/16/16.
 */
Battle = new Meteor.Collection( 'battle' );

Battle.allow({
    insert: () => false,
  update: () => false,
  remove: () => false
});

Battle.deny({
    insert: () => true,
  update: () => true,
  remove: () => true
});

let BattleSchema = new SimpleSchema({
  users: {
    type: [BattleUserSchema],
    label: "Participated users"
  },
  startTime: {
    type: Date,
    label: "Start time of the battle."
  },
  endTime: {
    type: Date,
    label: "End time of the battle."
  }
});

let BattleUserSchema = new SimpleSchema({
  "userId": {
    type: String,
    label: "The ID of the user."
  },
  "wpm": {
    type: Number,
  },
  "accuracy": {
    type: Number,
  },
  "result": {
    type: Number, //0 - lose, 1 - draw, 2 - win
  }
});

Battle.attachSchema( BattleSchema );
