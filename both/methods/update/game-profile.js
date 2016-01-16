Meteor.methods({
  updateUserNickname( argument ) {
    check( argument, Object );
    try {
      GameProfile.update( {
        userId: argument.userId
      }, {
        $set: { 'nickname': argument.nickname }
      });
    } catch( exception ) {
      return exception;
    }
  }
});
