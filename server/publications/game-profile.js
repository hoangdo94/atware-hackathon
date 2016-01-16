/**
 * Created by hoangdo on 1/16/16.
 */
Meteor.publish( 'usersGameProfile', function() {
  return GameProfile.find();
});
