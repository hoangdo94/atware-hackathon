Template.registerHelper( 'userNickname', ( userId ) => {
  var gp = GameProfile.findOne({userId: userId});
  if (gp) {
    return gp.nickname;
  }
  return 'Unknown Vodkar';
});
