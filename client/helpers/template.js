Template.registerHelper('userNickname', (userId) => {
  var gp = GameProfile.findOne({
    userId: userId
  });
  if (gp) {
    return gp.nickname;
  }
  return 'Unknown Vodkar';
});
Template.registerHelper('beautifyDate', (date) => moment(date).format('MMM Do YYYY, h:mm:ss A'));
