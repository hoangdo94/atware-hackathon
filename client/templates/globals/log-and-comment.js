Template.logAndComment.helpers({
  battleInfo: () => Battle.findOne(),
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
        if (log.word) {
          mess = 'ended the battle with the last word: <b>"'+ log.word +'"</b> and became the winner. Congrats!!';
        } else {
          mess = '<b>Battle ended!</b>.';
        }
        break;
      case ACTION.ATTACK:
        mess = 'attacked with the word: <b>"' +log.word+ '"</b>, dealt <b>' + Math.round(log.value*100)/100 + '</b> damages.';
        break;
      default:
        mess = 'Unkown.';
    }
    return mess;
  },
  shareData: () => {
    let b = Battle.findOne();
    let p1,p2;
    p1 = GameProfile.findOne({
      userId: b.users[0].userId
    }).nickname;
    p2 = GameProfile.findOne({
      userId: b.users[1].userId
    }).nickname;
    return {
      title: b.title + ': ' + p1 + ' vs. ' + p2,
      author: 'Vodkars Battle',
    };
  }
});
