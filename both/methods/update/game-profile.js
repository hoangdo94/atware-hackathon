Meteor.methods({
  updateUserNickname(argument) {
      check(argument, Object);
      try {
        var documentId = GameProfile.update({
          userId: argument.userId
        }, {
          $set: {
            'nickname': argument.nickname
          }
        });
        return documentId;
      } catch (exception) {
        return exception;
      }
    },
    buyVodkarModel(argument) {
      check(argument, Object);
      var gp = GameProfile.findOne({
        'userId': argument.userId
      });
      if (!gp) {
        throw new Meteor.Error('profile-not-found', 'No profiles found.');
      }
      var model = VodkarModel.findOne(argument.modelId);
      if (!model) {
        throw new Meteor.Error('model-not-found', 'No Vodkar models found.');
      }
      if (gp.modelsOwned.indexOf(argument.modelId) !== -1) {
        throw new Meteor.Error('model-already-owned', 'Already owned.');
      }
      if (gp.points < model.price) {
        throw new Meteor.Error('not-enough-coins', 'Not enough Points.');
      }
      try {
        var documentId = GameProfile.update({
          userId: argument.userId
        }, {
          $push: {
            'modelsOwned': argument.modelId
          },
          $inc: {
            'points': -model.price
          }
        });
        return documentId;
      } catch (exception) {
        return exception;
      }
    },
    useVodkarModel(argument) {
      check(argument, Object);
      var gp = GameProfile.findOne({
        'userId': argument.userId
      });
      if (!gp) {
        throw new Meteor.Error('profile-not-found', 'No profiles found.');
      }
      var model = VodkarModel.findOne(argument.modelId);
      if (!model) {
        throw new Meteor.Error('model-not-found', 'No Vodkar models found.');
      }
      if (gp.modelsOwned.indexOf(argument.modelId) === -1) {
        throw new Meteor.Error('model-already-owned', 'Not owned.');
      }
      try {
        var documentId = GameProfile.update({
          userId: argument.userId
        }, {
          $set: {
            'currentModel': model._id
          }
        });
        return documentId;
      } catch (exception) {
        return exception;
      }
    }
});
