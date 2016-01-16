Accounts.onCreateUser((options, user) => {
  if (!options || !user) {
    return;
  } else {
    var defaultModel = VodkarModel.findOne({
      'price': 0
    });
    GameProfile.insert({
      userId: user._id,
      nickname: options.profile.nickname || 'Vodkar',
      modelsOwned: [defaultModel._id],
      currentModel: defaultModel._id
    });
  }
  return user;
});
