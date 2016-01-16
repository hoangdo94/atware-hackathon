/**
 * Created by sonle on 1/16/16.
 */
Meteor.publish( 'joinable-battles', function() {
  return Battle.find({ endTime: { $exists: false } });
});
