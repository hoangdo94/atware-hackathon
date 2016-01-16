var t = '';
var total = 0;
var correct = 0;
var index = 0;

Template.battle.onCreated(() => {
  t = '';
  total = 0;
  correct = 0;
  index = 0;

  Tracker.autorun(function () {
    if (Battle.findOne()){
      var battle = Battle.findOne();
      var endTime = battle.endTime;
      if (battle.users.length){
        var userIndex = (Meteor.userId() === battle.users[0].userId) ? 0 : 1;
        if (endTime && battle.users[userIndex] && !battle.users[userIndex].accuracy){
          // Send this user's battle stats to the server
          var accuracy;
          if (total !== 0){
            accuracy = correct / total;
          } else {
            accuracy = 0;
          }
          var requestObject = {
            battleId: FlowRouter.getParam('id'),
            userId: Meteor.userId(),
            accuracy: Math.round(accuracy * 100) / 100
          };
          Meteor.call('sendBattleSummary', requestObject, (err) => {
            if (err) console.error(err);
          });
        }
      }
    }
  });
});

Template.battle.helpers({
  battleInfo: () => Battle.findOne(),
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
  }
});

Template.battle.events({
  'click .btn-join-battle': (evt, tmpl) => {
    if (!FlowRouter.subsReady()) return;
    Meteor.call('joinBattle', {
      battleId: FlowRouter.getParam('id'),
      userId: Meteor.userId()
    }, (err) => {
      if (err) {
        Bert.alert('Cannot join the battle!', 'error');
      } else {
        Bert.alert('You joined the battle!', 'success');
        //check and start game
        if (Battle.findOne().users.length === 2) {
          Meteor.call('startBattle', {
            battleId: FlowRouter.getParam('id')
          });
        }
      }
    });
  },
  'click .btn-leave-battle': (evt, tmpl) => {
    if (!FlowRouter.subsReady()) return;
    Meteor.call('leaveBattle', {
      battleId: FlowRouter.getParam('id'),
      userId: Meteor.userId(),
    }, (err) => {
      if (err) {
        Bert.alert('Cannot leave the battle!', 'error');
      } else {
        Bert.alert('You left the battle!', 'success');
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
