let startup = () => {
  //some global variables;
  var t, total, correct, index, wc0, wc1, isSummarySent;

  //leave battle
  var hotcodepush = false;
  Reload._onMigrate(function() {
    hotcodepush = true;
    return [true];
  });

  $(window).bind('beforeunload', function() {
    if (hotcodepush) {
      console.log('hot code push');
    } else {
      var currentRoute = FlowRouter.current();
      if (currentRoute.path.indexOf('/battle/') !== -1) {
        Meteor.call('leaveBattle', {
          battleId: currentRoute.params.id,
          userId: Meteor.userId(),
          wordsMissed: total - correct
        });
      }
    }
  });

  //comment
  Comments.ui.config({
    template: 'bootstrap' // or ionic, semantic-ui
  });

  //shareit
  ShareIt.init({
    siteOrder: ['facebook', 'twitter'],
    sites: {
      'facebook': {
        'appId': '1550218355295261',
        'version': 'v2.5'
      }
    },
    iconOnly: false,
    applyColors: false,
    classes: 'btn btn-success btn-sm'
  });
};

Modules.client.startup = startup;
