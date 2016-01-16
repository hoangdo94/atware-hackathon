Template.header.events({
  'click .logout' () {
    Meteor.logout( ( error ) => {
      if ( error ) {
        Bert.alert( error.reason, 'warning', 'growl-top-right' );
      } else {
        Bert.alert( 'Logged out!', 'success', 'growl-top-right' );
      }
    });
  }
});
