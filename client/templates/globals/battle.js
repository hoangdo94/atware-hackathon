Template.battle.onCreated(() => {
  t = '';
  total = 0;
  correct = 0;
  index = 0;
  wc0 = 0;
  wc1 = 0;
  isSummarySent = false;
  var test = test;

  Template.instance().autorun(function() {
    if (Battle.findOne()) {
      var battle = Battle.findOne();
      var endTime = battle.endTime;
      //send summary
      if (!isSummarySent && endTime && battle.users.length) {
        var userIndex = -1;
        if (Meteor.userId() === battle.users[0].userId) userIndex = 0;
        if (Meteor.userId() === battle.users[1].userId) userIndex = 1;

        if (endTime && battle.users[userIndex] && !battle.users[userIndex].accuracy) {
          // Send this user's battle stats to the server
          if (userIndex !== -1) {
            var accuracy;
            if (total !== 0) {
              accuracy = correct / total;
            } else {
              accuracy = 1;
            }
            var requestObject = {
              battleId: FlowRouter.getParam('id'),
              userId: Meteor.userId(),
              accuracy: Math.round(accuracy * 100) / 100
            };
            isSummarySent = true;
            Meteor.call('sendBattleSummary', requestObject, (err, points) => {
              if (battle.users[userIndex].result === 'win') {
                Bert.alert('You won this battle!<br> <img src="/images/coins.png" width="24px"/> ' + points + ' awarded.', 'info', 'growl-top-right');
              } else {
                Bert.alert('You lost this battle!<br> <img src="/images/coins.png" width="24px"/> ' + points + ' awarded.', 'info', 'growl-top-right');
              }
            });
          }

        }
      }
    }
  });

});

Template.battle.helpers({
  battleInfo: () => Battle.findOne(),
  isCreator: () => Meteor.userId() === Battle.findOne().creatorId,
  isJoined: () => {
    let b = Battle.findOne();
    if (b && b.users) {
      let userId = Meteor.userId();
      for (let i = 0; i < b.users.length; i++) {
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
  },
  isStarted: () => {
    let b = Battle.findOne();
    if (b) {
      return !!b.startTime;
    }
    return false;
  },
  isEnded: () => {
    let b = Battle.findOne();
    if (b) {
      return !!b.endTime;
    }
    return false;
  },
  battleLogMessage: (log) => {
    var mess;
    switch (log.action) {
      case ACTION.CREATE_BATTLE:
        mess = 'created the battle.';
        break;
      case ACTION.START_BATTLE:
        mess = 'started the battle.';
        break;
      case ACTION.JOIN_BATTLE:
        mess = 'joined the battle.';
        break;
      case ACTION.LEAVE_BATTLE:
          mess = 'left the battle.';
          break;
      case ACTION.END_BATTLE:
        mess = '<b>Battle ended!</b>.';
        break;
      case ACTION.ATTACK:
        mess = 'attacked with the word <b>"' +log.word+ '"</b>, dealt <b>' + Math.round(log.value*100)/100 + '</b> damages.';
        break;
      default:
        mess = 'Unkown.';
    }
    return mess;
  },
  resultHtml: (text) => {
    if (text === 'win') {
      return '<span style="color: green">WIN</span>';
    } else {
      return '<span style="color: red">LOSE</span>';
    }
  }
});

Template.battle.events({
  'click .btn-join-battle': (evt, tmpl) => {
    Meteor.call('joinBattle', {
      battleId: FlowRouter.getParam('id'),
      userId: Meteor.userId()
    }, (err) => {
      if (err) {
        Bert.alert('Cannot join the battle!', 'danger', 'growl-top-right');
      } else {
        Bert.alert('You joined the battle!', 'success', 'growl-top-right');
      }
    });
  },
  'click .btn-leave-battle': (evt, tmpl) => {
    var accuracy;
    if (total !== 0) {
      accuracy = correct / total;
    } else {
      accuracy = 1;
    }
    Meteor.call('leaveBattle', {
      battleId: FlowRouter.getParam('id'),
      userId: Meteor.userId(),
      accuracy: accuracy
    }, (err) => {
      if (err) {
        Bert.alert('Cannot leave the battle!', 'error', 'growl-top-right');
      } else {
        Bert.alert('You left the battle!', 'success', 'growl-top-right');
      }
    });
  },
  'click .btn-start-battle': (evt, tmpl) => {
    Meteor.call('startBattle', {
      battleId: FlowRouter.getParam('id'),
      userId: Meteor.userId()
    }, (err) => {
      if (err) {
        Bert.alert(err.reason, 'danger', 'growl-top-right');
      }
    });
  },
  'keypress .txtbox': function(event, template) {
    event.preventDefault();

    var word = template.$('#key').text();
    if (event.which !== 0) {
      total++;
      var s = String.fromCharCode(event.which);
      t += s;
      if (word.substring(index, index + t.length) == t) {
        var lastIndex = word.substring(index).search(' ');
        if (lastIndex > -1)
          template.$("#key").html("<span class='highlighted'>" + word.substring(0, index) + "</span>" + "<span class='highlight underline'>" + t + "</span>" + "<span class='highlight'>" + word.substring(index).substring(t.length, lastIndex) + "</span>" + word.substring(index).substring(lastIndex));
        else
          template.$("#key").html("<span class='highlighted'>" + word.substring(0, index) + "</span>" + "<span class='highlight underline'>" + t + "</span>" + "<span class='highlight'>" + word.substring(index + t.length) + "</span>");
        correct++;
        template.$(".txtbox").val(t);
        if (s == ' ') { //finnish 1 word
          index += t.length;
          t = '';
          template.$(".txtbox").val('');
          template.$("#key").html("<span class='highlighted'>" + word.substring(0, index) + "</span>" + word.substring(index));
          Meteor.call('vodkarAttack', {
            battleId: FlowRouter.getParam('id'),
            userId: Meteor.userId(),
          }, (err) => {

          });
        }
        if (word.substring(t.length + index) === '') { //done
          template.$(".txtbox").val('');
          template.$("#key").html("<span class='highlighted'>" + word + "</span>");
          Meteor.call('endBattle', {
            battleId: FlowRouter.getParam('id')
          }, (err, r) => {

          });
        }
      } else {
        t = '';
        template.$(".txtbox").val('');
        template.$("#key").html("<span class='highlighted'>" + word.substring(0, index) + "</span>" + word.substring(index));
      }
    }
  }
});