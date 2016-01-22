let startup = () => {
  //some global variables;
  var t, total, correct, index, wc0, wc1, isSummarySent;
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
        var accuracy = 0;
        if (total !== 0) {
          accuracy = correct / total;
        } else {
          accuracy = 1;
        }
        Meteor.call('leaveBattle', {
          battleId: currentRoute.params.id,
          userId: Meteor.userId(),
          accuracy: accuracy
        });
      }
    }
  });
};

Modules.client.startup = startup;
