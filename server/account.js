Accounts.onCreateUser((options, user) => {
  if (!options || !user) {
    return;
  } else {
    GameProfile.insert( {
      userId: user._id,
      nickname: options.profile.nickname || 'Vodkar'
    } );
  }
  return user;
});
