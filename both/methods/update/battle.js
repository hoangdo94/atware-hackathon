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
      var text = "dummy";
      if (Meteor.isServer) {
        var length = Math.round(Math.random()*15 +15);
        var randomWords = Meteor.npmRequire('random-words');
        text = randomWords({exactly: length, join: ' '});
      }
      try {
        var documentId = Battle.update(argument.battleId, {
          $set: {
            startTime: Date.now(),
            battleText: text,
            battleTextArr: text.split(' ')
          }
        });
        // Update the 2 player's game played
        var battle = Battle.findOne(argument.battleId);
        var user0Id = battle.users[0].userId;
        var user1Id = battle.users[1].userId;
        GameProfile.update({
          userId: user0Id
        }, {
          $push: {
            'gamesPlayed': argument.battleId
          }
        });
        GameProfile.update({
          userId: user1Id
        }, {
          $push: {
            'gamesPlayed': argument.battleId
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
            // User 1 is the winner
            winnerId = users[1].userId;
            loserId = users[0].userId;
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
        var users, player, opponent, points, accuracy, wpm;
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
          accuracy = argument.accuracy;
          wpm = Math.floor(users[0].wordsCompleted / battleTimeInMinutes);
          points = Math.round((battle.users[0].wordsCompleted * accuracy * wpm) / 20);
          Battle.update(argument.battleId, {
            $set: {
              'users.0.accuracy': accuracy,
              'users.0.wpm': wpm
            },
          });
          var playerGP = GameProfile.findOne({ userId: battle.users[0].userId});
          if (playerGP.gamesPlayed.length === 0){
            var newAvgWPM = wpm;
            var newAvgAccuracy = accuracy;
          } else {
            var newAvgWPM = Math.round((wpm + playerGP.avgWPM * (playerGP.gamesPlayed.length - 1)) / playerGP.gamesPlayed.length);
            var newAvgAccuracy = Math.round((accuracy + playerGP.avgAccuracy * (playerGP.gamesPlayed.length - 1)) / playerGP.gamesPlayed.length * 100) / 100;
          }
          var gameProfileModifier = {
            $inc: { points: points},
            $set: {
              avgWPM: newAvgWPM,
              avgAccuracy: newAvgAccuracy
            },
            $push: {}
          };
          if (battle.users[0].currentHp > battle.users[1].currentHp){
            // User 0 is the winner
            gameProfileModifier['$push'] = {
              'gamesWon': argument.battleId
            }
          }
          GameProfile.update({userId: battle.users[0].userId}, gameProfileModifier);
        } else {
          accuracy = argument.accuracy;
          wpm = Math.floor(users[1].wordsCompleted / battleTimeInMinutes);
          points = Math.round((battle.users[1].wordsCompleted * accuracy * wpm) / 20);
          Battle.update(argument.battleId, {
            $set: {
              'users.1.accuracy': accuracy,
              'users.1.wpm': wpm
            },
          });
          var playerGP = GameProfile.findOne({ userId: battle.users[1].userId});
          if (playerGP.gamesPlayed.length === 0){
            var newAvgWPM = wpm;
            var newAvgAccuracy = accuracy;
          } else {
            var newAvgWPM = Math.round((wpm + playerGP.avgWPM * (playerGP.gamesPlayed.length - 1)) / playerGP.gamesPlayed.length);
            var newAvgAccuracy = Math.round((accuracy + playerGP.avgAccuracy * (playerGP.gamesPlayed.length - 1)) / playerGP.gamesPlayed.length * 100) / 100;
          }
          var gameProfileModifier = {
            $inc: { points: points},
            $set: {
              avgWPM: newAvgWPM,
              avgAccuracy: newAvgAccuracy
            },
            $push: {}
          };
          if (battle.users[1].currentHp > battle.users[0].currentHp){
            // User 1 is the winner
            gameProfileModifier['$push'] = {
              'gamesWon': argument.battleId
            }
          }
          GameProfile.update({userId: battle.users[1].userId}, gameProfileModifier);
        }
        return points;
      } catch (exception) {
        return exception;
      }
    },
    generateRandomText: (length) => {
      check(length, Number);
      if (Meteor.isServer) {
        var randomWords = Meteor.npmRequire('random-words');
        var text = randomWords({exactly: length, join: ' '});
        return text;
      } else {
        return 'dummy dummy';
      }
    }
});
