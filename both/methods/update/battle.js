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
      var test = "She thanked the US and Japan for their support and vowed Taiwan would contribute to peace and stability in the region.";
      try {
        var documentId = Battle.update(argument.battleId, {
          $set: {
            startTime: Date.now(),
            battleText: test,
            battleTextArr: test.split(' ')
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
                'users.1.currentHp': 0,
                'users.1.result': 'lose',
                'users.0.result': 'win',
              },
              $inc: {
                'users.0.wordsCompleted': 1
              }
            });
          } else {
            winnerId = users[1].userId;
            Battle.update(argument.battleId, {
              $set: {
                'winnerId': winnerId,
                'users.0.currentHp': 0,
                'users.0.result': 'lose',
                'users.1.result': 'win'
              },
              $inc: {
                'users.1.wordsCompleted': 1
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
          var word = battle.battleTextArr[users[player].wordsCompleted];
          var damage = (100 * word.length / (battle.battleText.length - battle.battleTextArr.length + 1));
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
    },
    sendBattleSummary(argument){
      check(argument, Object);
      try {
        var users, player, opponent, points;
        var battle = Battle.findOne(argument.battleId);
        var endTimeMs = new Date(battle.endTime).getTime();
        var startTimeMs = new Date(battle.startTime).getTime();
        var battleTimeInMinutes = (endTimeMs - startTimeMs) / 60000;
        if (battle) {
          users = battle.users;
          if (users[0].userId === argument.userId) {
            player = 0;
            opponent = 1;
          } else {
            player = 1;
            opponent = 0;
          }
        }
        if (player === 0) {
          points = Math.round(battle.users[0].wordsCompleted * argument.accuracy * Math.floor(users[0].wordsCompleted / battleTimeInMinutes) / 20);
          Battle.update(argument.battleId, {
            $set: {
              'users.0.accuracy': argument.accuracy,
              'users.0.wpm': Math.floor(users[0].wordsCompleted / battleTimeInMinutes)
            },
          });
          GameProfile.update({userId: battle.users[0].userId}, {
            $inc: { points: points}
          });
        } else {
          points = Math.round(battle.users[1].wordsCompleted * argument.accuracy * Math.floor(users[0].wordsCompleted / battleTimeInMinutes) / 20);
          Battle.update(argument.battleId, {
            $set: {
              'users.1.accuracy': argument.accuracy,
              'users.1.wpm': Math.floor(users[1].wordsCompleted / battleTimeInMinutes)
            },
          });
          GameProfile.update({userId: battle.users[1].userId}, {
            $inc: { points: points}
          });
        }
        return points;
      } catch (exception) {
        return exception;
      }
    }
});
