Template.registerHelper('userNickname', (userId) => {
  var gp = GameProfile.findOne({
    userId: userId
  });
  if (gp) {
    return gp.nickname;
  }
  return 'Unknown Vodkar';
});
Template.registerHelper('userVodkarModel', (userId) => {
  var gp = GameProfile.findOne({
    userId: userId
  });
  if (gp) {
    return gp.modelImgUrl;
  }
  return '/avatars/default.png';
});
Template.registerHelper('showPercentage', (input) => {
    return (Math.round(input * 10000) / 100 + " %");
});

Template.registerHelper('beautifyDate', (date) => moment(date).format('MMM Do YYYY, h:mm:ss A'));
