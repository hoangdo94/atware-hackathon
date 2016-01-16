Template.userProfile.onCreated(() => {
  
});

Template.userProfile.helpers({
  userInfo: () => Meteor.users.findOne(),
  gameProfile: () => GameProfile.findOne(),
});
