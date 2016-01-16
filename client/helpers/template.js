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
    return VodkarModel.findOne(gp.currentModel).imageUrl;
  }
  return '/avatars/default.png';
});
Template.registerHelper('userVodkarClass', (userId) => {
  var gp = GameProfile.findOne({
    userId: userId
  });
  if (gp) {
    return VodkarModel.findOne(gp.currentModel).title;
  }
  return 'Unknown';
});
Template.registerHelper('showPercentage', (input) => {
    return (Math.round(input * 10000) / 100 + " %");
});

Template.registerHelper('beautifyDate', (date) => moment(date).format('MMM Do YYYY, h:mm:ss A'));
