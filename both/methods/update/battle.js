Meteor.methods({
  joinBattle(argument) {
      check(argument, Object);

      try {
        var documentId = Battle.update(argument.battleId, {
          $addToSet: {
            'users': {
              userId: argument.userId,
              userEmail: argument.userEmail
            }
          }
        });
        return documentId;
      } catch (exception) {
        return exception;
      }
    },
    leaveBattle(argument) {
      check(argument, Object);

      try {
        var documentId = Battle.update(argument.battleId, {
          $pull: {
            'users': {
              userId: argument.userId,
            }
          }
        });
        return documentId;
      } catch (exception) {
        return exception;
      }
    },
    startBattle(argument) {
      check(argument, Object);

      try {
        var documentId = Battle.update(argument.battleId, {
          $set: {
            startTime: Date.now(),
            battleText: 'After spending'
          }
        });
        return documentId;
      } catch (exception) {
        return exception;
      }
    }
});
