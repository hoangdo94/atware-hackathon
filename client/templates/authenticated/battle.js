var t = '';
var total = 0;
var correct = 0;
var index = 0;
var wc0 = 0;
var wc1 = 0;
var isSummarySent = false;

Template.battle.onCreated(() => {
  t = '';
  total = 0;
  correct = 0;
  index = 0;
  wc0 = 0;
  wc1 = 0;
  isSummarySent = false;

  Template.instance().autorun(function() {
    if (Battle.findOne()) {
      var battle = Battle.findOne();
      var endTime = battle.endTime;

      //animation
      if (battle.users.length === 2) {
        if (battle.users[0].wordsCompleted > wc0) {
          console.log('0 attack');
          wc0 = battle.users[0].wordsCompleted;
          $('#vk0 > img').addClass('animated wobble');
          $('#vk0 > img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('#vk0 > img').removeClass('animated wobble');
          });

          $('#vk1 > img').addClass('animated tada');
          $('#vk1 > img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('#vk1 > img').removeClass('animated tada');
          });
        }
        if (battle.users[1].wordsCompleted > wc1) {
          wc1 = battle.users[1].wordsCompleted;
          console.log('1 attack');
          $('#vk1 > img').addClass('animated wobble');
          $('#vk1 > img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('#vk1 > img').removeClass('animated wobble');
          });

          $('#vk0 > img').addClass('animated tada');
          $('#vk0 > img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('#vk0 > img').removeClass('animated tada');
          });
        }
      }

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
              accuracy = 0;
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

  Template.instance().autorun(() => {
    var subsReady = FlowRouter.subsReady();
    if (subsReady) {
      if (!Battle.findOne()) {
        console.log('not found');
        BlazeLayout.render('default', {
          yield: 'notFound'
        });
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
        Bert.alert('Cannot join the battle!', 'danger', 'growl-top-right');
      } else {
        Bert.alert('You joined the battle!', 'success', 'growl-top-right');
        // Check and start game
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
        Bert.alert('Cannot leave the battle!', 'error', 'growl-top-right');
      } else {
        Bert.alert('You left the battle!', 'success', 'growl-top-right');
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
