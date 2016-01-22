/**
 * Created by hoangdo on 1/16/16.
 */
Meteor.publish('battle', function(options) {
  check(options, Object);
  return Battle.find(options.battleId);
});
Meteor.publish('joinableBattles', function() {
  return Battle.find({
    endTime: {
      $exists: false
    }
  });
});
Meteor.publish('recentBattles', function(limit) {
  check(limit, Number);
  return Battle.find({
    endTime: {
      $exists: true
    }
  }, {
    sort: {
      endTime: -1
    },
    limit: limit
  });
});
