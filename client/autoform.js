AutoForm.hooks({
  createBattleForm: {
    before: {
      insert: (doc) => {
        if (Meteor.userId()) {
          doc.creatorId = Meteor.userId();
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
