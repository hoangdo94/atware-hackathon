Template.shop.helpers({
  ownedModels: () => {
    var profile = GameProfile.findOne({userId: Meteor.userId()});
    if (profile) {
      return VodkarModel.find({_id: {$in: profile.modelsOwned}});
    }
    return [];
  },
  notOwnedModels: () => {
    var profile = GameProfile.findOne({userId: Meteor.userId()});
    return VodkarModel.find({_id: {$nin: profile.modelsOwned}});
  },
  isUsed: (modelId) => {
    var profile = GameProfile.findOne({userId: Meteor.userId()});
    var model = VodkarModel.findOne(modelId);
    return (profile.currentModel === model._id);
  },
  currentBalance: () => {
    var profile = GameProfile.findOne({userId: Meteor.userId()});
    return profile.points;
  }
});
Template.shop.events({
  'click .btn-use': (evt, tmpl) => {
    evt.preventDefault();
    var title = tmpl.$(evt.target).attr('data-title');
    var modelId = tmpl.$(evt.target).attr('data-id');
    if (confirm('Use ' + title + '?')) {
      Meteor.call('useVodkarModel', {
        userId: Meteor.userId(),
        modelId: modelId
      }, (err) => {
        if (err) {
          Bert.alert( err.reason, 'danger', 'growl-top-right' );
        } else {
          Bert.alert( 'Used new Model: ' + title, 'success', 'growl-top-right' );
        }
      });
    }
  },
  'click .btn-buy': (evt, tmpl) => {
    evt.preventDefault();
    var title = tmpl.$(evt.target).attr('data-title');
    var modelId = tmpl.$(evt.target).attr('data-id');
    if (confirm('Buy ' + title + '?')) {
      Meteor.call('buyVodkarModel', {
        userId: Meteor.userId(),
        modelId: modelId
      }, (err) => {
        if (err) {
          Bert.alert( err.reason, 'danger', 'growl-top-right' );
        } else {
          Bert.alert( 'Bought new Model: ' + title, 'success', 'growl-top-right' );
        }
      });
    }
  }
});
