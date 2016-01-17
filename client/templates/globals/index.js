Template.index.helpers({
  recentBattles: () => Battle.find(),
  rankings: () => GameProfile.find({}, {sort: {'profile': -1}, limit: 10})
});
