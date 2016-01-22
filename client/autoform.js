AutoForm.hooks({
  createBattleForm: {
    before: {
      insert: (doc) => {
        var time = Date.now();
        if (Meteor.userId()) {
          doc.creatorId = Meteor.userId();
          doc.users = [{
            userId: Meteor.userId(),
            wordsCompleted: 0,
            currentHp: 100
          }];
          doc.createTime = time;
          doc.battleLog = [];
          doc.battleLog.push({
            userId: Meteor.userId(),
            time: time,
            action: ACTION.CREATE_BATTLE,
            value: 0
          });
          return doc;
        } else {
          return false;
        }
      }
    },
    onSuccess: (formType, result) => {
      if (result) {
        FlowRouter.go('/battle/' + result);
        Bert.alert('Battle created', 'success', 'growl-top-right');
      } else {
        Bert.alert('Cannot create battle', 'danger', 'growl-top-right');
      }
    }
  }
});
