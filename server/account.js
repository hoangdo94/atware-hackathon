Accounts.onCreateUser((options, user) => {
  console.log(options, user);
  if (!options || !user) {
    console.log('error creating user');
    return;
  } else {
    GameProfile.insert( {
      userId: user._id,
    } );
  }
  return user;
});
