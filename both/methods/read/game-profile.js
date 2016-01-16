Meteor.methods({
  getUserGameProfile( userId ) {
    check( userId, String );
    console.log(userId);
    var document = GameProfile.findOne( {userId: userId} );

    if ( !document ) {
      throw new Meteor.Error( 'profile-not-found', 'No Game profiles found matching this query.' );
    }

    return document;
  }
});
