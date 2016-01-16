Meteor.methods({
  joinBattle(argument) {
      check(argument, Object);

      try {
        var documentId = Battle.update(argument.battleId, {
          $addToSet: {
            'users': {
              userId: argument.userId,
              wordsCompleted: 0,
              currentHp: 100
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
            battleText: 'after spending putang ina mo bobo',
            battleTextArr: 'after spending putang ina mo bobo'.split(' ')
          }
        });
        return documentId;
      } catch (exception) {
        return exception;
      }
    },
    endBattle(argument) {
      check(argument, Object);
      try {
        var battle = Battle.findOne(argument.battleId);
        if (battle) {
          if (battle.endTime) {
            return null;
          }
          Battle.update(argument.battleId, {
            $set: {
              'endTime': Date.now()
            }
          });
          var users = battle.users;
          var winnerId;
          if (users[0].currentHp > users[1].currentHp) {
            winnerId = users[0].userId;
            Battle.update(argument.battleId, {
              $set: {
                'winnerId': winnerId,
                'users.1.currentHp': 0
              }
            });
          } else {
            winnerId = users[1].userId;
            Battle.update(argument.battleId, {
              $set: {
                'winnerId': winnerId,
                'users.0.currentHp': 0
              }
            });
          }
          return winnerId;
        }
      } catch (exception) {
        return exception;
      }
    },
    vodkarAttack(argument) {
      check(argument, Object);
      try {
        var battle = Battle.findOne(argument.battleId);
        if (battle) {
          var users = battle.users;
          var player, opponent;
          if (users[0].userId === argument.userId) {
            player = 0;
            opponent = 1;
          } else {
            player = 1;
            opponent = 0;
          }
          // console.log(player, opponent);
          var word = battle.battleTextArr[users[player].wordsCompleted];
          var damage = (100 * word.length / (battle.battleText.length - battle.battleTextArr.length + 1));
          // console.log(word, damage);
          var documentId;
          if (player === 0) {
            documentId = Battle.update(argument.battleId, {
              $inc: {
                'users.0.wordsCompleted': 1,
                'users.1.currentHp': -damage
              },
            });
          } else {
            documentId = Battle.update(argument.battleId, {
              $inc: {
                'users.1.wordsCompleted': 1,
                'users.0.currentHp': -damage
              },
            });
          }
          return documentId;
        }
      } catch (exception) {
        return exception;
      }
    }
});
