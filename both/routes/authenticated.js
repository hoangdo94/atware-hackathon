const authenticatedRoutes = FlowRouter.group({
  name: 'authenticated'
});

authenticatedRoutes.route( '/vodkar-shop', {
  name: 'vodkar-shop',
  action() {
    BlazeLayout.render( 'default', { yield: 'shop' } );
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
  },
  subscriptions() {
    this.register('joinableBattlesSubs', Meteor.subscribe('joinableBattles'));
  }
});

authenticatedRoutes.route( '/battle/:id' , {
  name: 'battle',
  action(params) {
    BlazeLayout.render( 'default', { yield: 'battle', battleId: params.id } );
  },
  subscriptions(params) {
    this.register('battleSubs', Meteor.subscribe('battle', {battleId: params.id}));
  }
});
