const authenticatedRoutes = FlowRouter.group({
  name: 'authenticated'
});

authenticatedRoutes.route( '/', {
  name: 'index',
  action() {
    BlazeLayout.render( 'default', { yield: 'index' } );
  }
});

authenticatedRoutes.route( '/dashboard', {
  name: 'dashboard',
  action() {
    BlazeLayout.render( 'default', { yield: 'dashboard' } );
  }
});

authenticatedRoutes.route( '/create-battle', {
  name: 'create-battle',
  action() {
    BlazeLayout.render( 'default', { yield: 'createBattle' } );
  }
});

authenticatedRoutes.route( '/join-battle', {
  name: 'join-battle',
  action() {
    BlazeLayout.render( 'default', { yield: 'joinBattle' } );
  }
});

authenticatedRoutes.route( '/battle/:id' , {
  name: 'battle',
  action(params, queryParams) {
    BlazeLayout.render( 'default', { yield: 'battle', battleId: params.id } );
  }
});
