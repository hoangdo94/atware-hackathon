Template.battle.onCreated(() => {

});

Template.battle.helpers({
  battleInfo: () => Battle.findOne(),
  isJoined: () => {
    let b = Battle.findOne();
    if (b && b.users) {
      let userId = Meteor.userId();
      for (let i=0; i< b.users.length; i++) {
        let tmp = b.users[i];
        if (tmp.userId === userId) {
          return true;
        }
      }
    }
    return false;
  },
  isReady: () => {
    let b = Battle.findOne();
    if (b && b.users) {
      return b.users.length === 2;
    }
    return false;
  }
});

Template.battle.events({
  'click .btn-join-battle': (evt, tmpl) => {
    Meteor.call('joinBattle', {
      battleId: tmpl.data.battleId(),
      userId: Meteor.userId(),
      userEmail: Meteor.user().emails[0].address
    }, (err) => {
      if (err) {
        Bert.alert('Cannot join the battle!', 'error');
      } else {
        Bert.alert('You joined the battle!', 'success');
      }
    });
  },
  'click .btn-leave-battle': (evt, tmpl) => {
    Meteor.call('leaveBattle', {
      battleId: tmpl.data.battleId(),
      userId: Meteor.userId(),
    }, (err) => {
      if (err) {
        Bert.alert('Cannot leave the battle!', 'error');
      } else {
        Bert.alert('You left the battle!', 'success');
      }
    });
  }
});
