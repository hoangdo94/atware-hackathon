Template.userProfile.onCreated(() => {

});

Template.userProfile.helpers({
  userInfo: () => Meteor.users.findOne(FlowRouter.getParam('id')),
  gameProfile: () => GameProfile.findOne(),
  isDisabled: (userId) => {
    if (userId !== Meteor.userId()){
      return "disabled";
    }
    return "";
  }
});

Template.userProfile.events({
  'click .btn-pref .btn': (e) => {
    $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
    $(e.currentTarget).removeClass("btn-default").addClass("btn-primary");
  },
  'blur #input-user-nickname': (e) => {
    var nickname = $(e.currentTarget).val();
    Meteor.call('updateUserNickname', {
      userId: Meteor.userId(),
      nickname: nickname
    }, (err) => {
      if (err){
        console.error(err);
        Bert.alert('Failed to update user nickname.', 'error', 'growl-top-right');
      }
      Bert.alert('Successfully updated user nickname.', 'success', 'growl-top-right');
    });
  }
});
