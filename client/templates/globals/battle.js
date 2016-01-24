Template.battle.onCreated(() => {
  t = '';
  total = 0;
  correct = 0;
  index = 0;
  wc0 = 100;
  wc1 = 100;
  isSummarySent = false;
  var test = test;

  Template.instance().autorun(function() {
    if (Battle.findOne()) {
      var battle = Battle.findOne();
      var startTime = battle.startTime;
      var endTime = battle.endTime;
      //play attack animation and focus on text input
      if (startTime) {
        //focus
        if (!endTime) $('#input-text').focus();
        //animation
        var users = battle.users;
        if (users[0].currentHp < wc0) {
          //second user attack
          wc0 = users[0].currentHp;
          $('#vodkar-0 .attack-effect').show().addClass('animated tada');
          $('#vodkar-0 .attack-effect').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).hide().removeClass('animated tada');
            $('#vodkar-0 img').addClass('animated shake');
            $('#vodkar-0 img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
              $(this).removeClass('animated shake');
              if (wc0 <= 0) {
                $('#vodkar-0 img').addClass('animated hinge loser');
                $('#vodkar-0 img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                  $(this).removeClass('animated hinge loser');
                });
              }
            });
          });
        }
        if (users[1].currentHp < wc1) {
          //first user attack
          wc1 = users[1].currentHp;
          $('#vodkar-1 .attack-effect').show().addClass('animated tada');
          $('#vodkar-1 .attack-effect').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).hide().removeClass('animated tada');
            $('#vodkar-1 img').addClass('animated shake');
            $('#vodkar-1 img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
              $(this).removeClass('animated shake');
              if (wc1 <= 0) {
                $('#vodkar-1 img').addClass('animated hinge loser');
                $('#vodkar-1 img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                  $(this).removeClass('animated hinge loser');
                });
              }
            });
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
            var requestObject = {
              battleId: FlowRouter.getParam('id'),
              userId: Meteor.userId(),
              wordsMissed: total - correct
            };
            isSummarySent = true;
            Meteor.call('sendBattleSummary', requestObject, (err, points) => {
              if (!points) return;
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
    Meteor.call('leaveBattle', {
      battleId: FlowRouter.getParam('id'),
      userId: Meteor.userId(),
      wordsMissed: total - correct
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

Template.battle.onRendered(() => {

});
