/**
 * Created by hoangdo on 1/16/16.
 */
Meteor.publish( 'userProfile', function(options) {
  check(options, Object);
  return Meteor.users.find(options.userId);
});
