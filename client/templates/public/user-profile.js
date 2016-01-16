Template.userProfile.onCreated(() => {

});

Template.userProfile.helpers({
  userInfo: () => Meteor.users.findOne(FlowRouter.getParam('id')),
  gameProfile: () => GameProfile.findOne(),
});
