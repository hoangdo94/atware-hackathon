/**
 * Created by hoangdo on 1/16/16.
 */
Meteor.publish( 'battle', function(options) {
  check(options, Object);
  return Battle.find(options.battleId);
});
