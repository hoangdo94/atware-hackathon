Template.registerHelper('userNickname', (userId) => {
  var gp = GameProfile.findOne({
    userId: userId
  });
  if (gp) {
    return gp.nickname;
  }
  return '';
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
  if (isNaN(input)) return 'N/A';
  return (Math.round(input * 10000) / 100 + " %");
});

Template.registerHelper('beatifyTime', (date) => moment(date).format('DD/MM/YYYY, HH:mm:ss')); //DD/MM/YYYY, HH:mm:ss

Template.registerHelper('humanizeDuration', (duration) => moment.duration(duration, 'seconds').humanize());

Template.registerHelper('mathRound', (num) => Math.round(num*100)/100);
