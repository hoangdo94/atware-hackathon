FlowRouter.notFound = {
  action() {
    BlazeLayout.render( 'default', { yield: 'notFound' } );
  }
};
FlowRouter.subscriptions = function() {
  this.register('usersGameProfileSubs', Meteor.subscribe('usersGameProfile'));
};
