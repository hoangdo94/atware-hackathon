/**
 * Created by hoangdo on 1/16/16.
 */
Meteor.publish('vodkarModels', function() {
  return VodkarModel.find({}, {sort: {'price': 1}});
});
