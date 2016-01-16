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
            battleText: 'After spending two years in the Office for House-Elf Relocation, Scamander joined the Beast Division and put his knowledge of magical beasts to good use. In 1918, Scamander was commissioned by Augustus Worme of Obscurus Books to write Fantastic Beasts and Where to Find Them.'
          }
        });
        return documentId;
      } catch (exception) {
        return exception;
      }
    }
});
