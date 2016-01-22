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
          mess = 'ended the battle with the last word: <b>"'+ log.word +'"</b> and became the winner, congrats!!';
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
  }
});
