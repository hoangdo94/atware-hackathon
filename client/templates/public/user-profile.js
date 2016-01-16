Template.userProfile.onCreated( () => {
  Template.instance().subscribe( 'userProfile' , {userId: Template.instance().data.userId()});
});

Template.userProfile.helpers({
  userInfo: () => Meteor.users.findOne(),
  gameProfile: () => GameProfile.findOne(),
});
