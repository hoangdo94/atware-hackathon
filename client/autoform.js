AutoForm.hooks({
  createBattleForm: {
    before: {
      insert: (doc) => {
        var self = this;
        if (Meteor.userId()) {
          doc.creatorId = Meteor.userId();
          // var textLength = Math.floor((Math.random() * 20) + 30);
          // console.log(textLength);
          // Meteor.call('generateRandomText', textLength, (err, text) => {
          //   doc.battleText = text;
          //   doc.battleTextArr = text.split(' ');
          //   console.log(doc);
          //   this.result(doc);
          // });
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
