var done = false;
var t = '';
var done = false;
var total = 0;
var correct = 0;
var index = 0;
Template.battle.onCreated(() => {

});

Template.battle.helpers({
  battleInfo: () => Battle.findOne(),
  isJoined: () => {
    let b = Battle.findOne();
    if (b && b.users) {
      let userId = Meteor.userId();
      for (let i=0; i< b.users.length; i++) {
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
  }
});

Template.battle.events({
  'click .btn-join-battle': (evt, tmpl) => {
    Meteor.call('joinBattle', {
      battleId: tmpl.data.battleId(),
      userId: Meteor.userId(),
      userEmail: Meteor.user().emails[0].address
    }, (err) => {
      if (err) {
        Bert.alert('Cannot join the battle!', 'error');
      } else {
        Bert.alert('You joined the battle!', 'success');
        //check and start game
        if (Battle.findOne().users.length === 2) {
          console.log('start game');
          Meteor.call('startBattle', {
            battleId: tmpl.data.battleId()
          }, (err) => {
            console.log(err);
          });
        }
      }
    });
  },
  'click .btn-leave-battle': (evt, tmpl) => {
    Meteor.call('leaveBattle', {
      battleId: tmpl.data.battleId(),
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
      if (done) return;
      var word = template.$('#key').text();
      if (event.which !== 0) {
        total++;
        var s = String.fromCharCode(event.which);
        t += s;
        if (word.substring(index, index + t.length) == t) {
          var lastIndex = word.substring(index).search(' ');
          if (lastIndex > -1)
            template.$("#key").html("<span class='highlighted'>" + word.substring(0, index) + "</span>" + "<span class='highlight underline'>" + t +"</span>"+ "<span class='highlight'>" + word.substring(index).substring(t.length, lastIndex) + "</span>" + word.substring(index).substring(lastIndex));   
          else
            template.$("#key").html("<span class='highlighted'>" + word.substring(0, index) + "</span>" + "<span class='highlight underline'>" + t +"</span>"+ "<span class='highlight'>" + word.substring(index + t.length) + "</span>");   
          correct++;
          template.$(".txtbox").val(t);
          if (s == ' ') {
            index += t.length;
            t = '';
            template.$(".txtbox").val('');
            template.$("#key").html("<span class='highlighted'>" + word.substring(0, index) + "</span>" + word.substring(index));
          }
          if (word.substring(t.length + index) == '') {
            console.log(t);
            done = true;
            console.log(100 * correct / total);
            console.log(template.$(".txtbox").val());
            template.$(".txtbox").val('');
            template.$("#key").html(word);
          }
        }
        else
        {
          t = '';
          template.$(".txtbox").val('');
          template.$("#key").html("<span class='highlighted'>" + word.substring(0, index) + "</span>" + word.substring(index));
        }
      }
    }
});
