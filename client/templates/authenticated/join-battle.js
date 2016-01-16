Template.joinBattle.helpers({
  'waitingBattles': () => Battle.find({startTime: {$exists: false}}),
  'inProgressBattles': () => Battle.find({startTime: {$exists: true}})
});

Template.battle.events({

});
