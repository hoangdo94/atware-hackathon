Template.userProfile.onCreated(() => {
  Template.instance().autorun(() => {
    var subsReady = FlowRouter.subsReady();
    if (subsReady) {
      if (!Meteor.users.findOne(FlowRouter.getParam('id'))) {
        console.log('not found');
        BlazeLayout.render( 'default', { yield: 'notFound' } );
      }
    }
  });
});

Template.userProfile.helpers({
  userInfo: () => Meteor.users.findOne(FlowRouter.getParam('id')),
  gameProfile: () => GameProfile.findOne({userId: FlowRouter.getParam('id')}),
  isDisabled: (userId) => {
    if (userId !== Meteor.userId()){
      return "disabled";
    }
    return "";
  },
  averages: () => {
    var gp = GameProfile.findOne({userId: FlowRouter.getParam('id')});
    if (!gp) return {};
    return {
      wpm: Math.round(60*gp.wordsCompleted/gp.timePlayed),
      accuracy: gp.wordsCompleted/(gp.wordsCompleted + gp.wordsMissed)
    };
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
        Bert.alert('Failed to update user nickname.', 'danger', 'growl-top-right');
      }
      Bert.alert('Successfully updated user nickname.', 'success', 'growl-top-right');
    });
  }
});
