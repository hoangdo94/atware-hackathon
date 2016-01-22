Template.index.helpers({
  recentBattles: () => Battle.find(),
  rankings: () => GameProfile.find({}, {sort: {'points': -1}, limit: 10})
});
