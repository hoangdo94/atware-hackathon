Accounts.onCreateUser((options, user) => {
  console.log('options', options);
  if (!options || !user) {
    console.log('error creating user');
    return;
  } else {
    GameProfile.insert( {
      userId: user._id,
      nickname: options.profile.nickname || 'Vodkar'
    } );
  }
  return user;
});
