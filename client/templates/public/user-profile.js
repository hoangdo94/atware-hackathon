Template.userProfile.onCreated(() => {
  Template.instance().subscribe('userProfile', {
    userId: FlowRouter.getParam('id')
  });
});

Template.userProfile.helpers({
  userInfo: () => Meteor.users.findOne(),
  gameProfile: () => GameProfile.findOne(),
});
