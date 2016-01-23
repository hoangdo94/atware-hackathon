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
          },
          $push: {
            'battleLog': {
              userId: argument.userId,
              time: Date.now(),
              action: ACTION.JOIN_BATTLE,
              value: 0
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
      /*
       * User leaves battle
       * - If battle didn't start:
       *   + creator leaves: destroy the battle
       *   + else just remove user from users array
       * - If battle started, but didn't finnish: finish the battle, and set leaving user to loser
       */
      var battle = Battle.findOne(argument.battleId);
      //- If battle didn't start
      if (!battle) return null;
      if (!battle.startTime) {
        //console.log('battle didn\'t start');
        //+ creator leaves: destroy the battle
        if (battle.creatorId === argument.userId) {
          //console.log('creator leaves: destroy the battle');
          return Battle.remove(argument.battleId);
        }
        //+ else just remove user from users array
        //console.log('else just remove user from users array');
        if (battle.users[1] && battle.users[1].userId === argument.userId) {
          return Battle.update(argument.battleId, {
            $pull: {
              'users': {
                userId: argument.userId,
              }
            },
            $push: {
              'battleLog': {
                userId: argument.userId,
                time: Date.now(),
                action: ACTION.LEAVE_BATTLE,
                value: 0
              }
            }
          });
        }

      } else if (!battle.endTime) { //- If battle started: finish the battle, and set leaving user to loser
        //console.log('battle started, but didn\'t finnish: finish the battle, and set leaving user to loser');
        var time = Date.now();
        var playerIndex;
        if (battle.users[0].userId === argument.userId) playerIndex = 0;
        else if (battle.users[1].userId === argument.userId) playerIndex = 1;
        else return null;

        if (playerIndex === 0) {
          //first player leaves the battle
          //console.log('first player leaves the battle');
          Battle.update(argument.battleId, {
            $set: {
              'endTime': time,
              'winnerId': battle.users[1].userId,
              'users.0.currentHp': 0,
              'users.0.result': 'lose',
              'users.1.result': 'win',
            },
            $push: {
              'battleLog': {
                $each: [{
                  userId: argument.userId,
                  time: time,
                  action: ACTION.LEAVE_BATTLE,
                  value: 0
                }, {
                  userId: 0,
                  time: time,
                  action: ACTION.END_BATTLE,
                  value: 0
                }]
              }
            }
          });
        } else {
          //second player leaves the battle
          //console.log('second player leaves the battle');
          Battle.update(argument.battleId, {
            $set: {
              'endTime': time,
              'winnerId': battle.users[0].userId,
              'users.1.currentHp': 0,
              'users.1.result': 'lose',
              'users.0.result': 'win',
            },
            $push: {
              'battleLog': {
                $each: [{
                  userId: argument.userId,
                  time: time,
                  action: ACTION.LEAVE_BATTLE,
                  value: 0
                }, {
                  userId: 0,
                  time: time,
                  action: ACTION.END_BATTLE,
                  value: 0
                }]
              }
            }
          });
        }
        return calculateAndUpdateUserProfile(argument, true);
      }
    },
    startBattle(argument) {
      check(argument, Object);
      //console.log(argument);
      var text = "";
      if (Meteor.isServer) {
        var length = Math.round(Math.random() * 15 + 15);
        var randomWords = Meteor.npmRequire('random-words');
        text = randomWords({
          exactly: length,
          join: ' '
        });
      }
      var battle = Battle.findOne(argument.battleId);
      if (battle) {
        if (battle.creatorId !== argument.userId) {
          throw new Meteor.Error('cannot-start-battle', 'You aren\'t the creator of this battle.');
        }
        var time = Date.now();
        var documentId = Battle.update(argument.battleId, {
          $set: {
            startTime: time,
            battleText: text,
            battleTextArr: text.split(' ')
          },
          $push: {
            'battleLog': {
              userId: argument.userId,
              time: time,
              action: ACTION.START_BATTLE,
              value: 0
            }
          }
        });
        // Update the 2 player's game played
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
      }
    },
    endBattle(argument) {
      check(argument, Object);
      try {
        var battle = Battle.findOne(argument.battleId);
        if (battle) {
          var users = battle.users;
          if (battle.endTime) {
            return null;
          }
          var time = Date.now();
          Battle.update(argument.battleId, {
            $set: {
              'endTime': time
            },
            $push: {
              'battleLog': {
                userId: (users[0].currentHp > users[1].currentHp)?users[0].userId:users[1].userId,
                time: time,
                action: ACTION.END_BATTLE,
                value: 0,
                word: battle.battleTextArr[battle.battleTextArr.length - 1]
              }
            }
          });

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
              $push: {
                'battleLog': {
                  userId: argument.userId,
                  time: Date.now(),
                  action: ACTION.ATTACK,
                  value: damage,
                  word: word
                }
              }
            });
          } else {
            documentId = Battle.update(argument.battleId, {
              $inc: {
                'users.1.wordsCompleted': 1,
                'users.0.currentHp': -damage
              },
              $push: {
                'battleLog': {
                  userId: argument.userId,
                  time: Date.now(),
                  action: ACTION.ATTACK,
                  value: damage,
                  word: word
                }
              }
            });
          }
          return documentId;
        }
      } catch (exception) {
        return exception;
      }
    },
    sendBattleSummary(argument) {
      check(argument, Object);
      return calculateAndUpdateUserProfile(argument, false);
    }
});

var calculateAndUpdateUserProfile = (argument, isLeft) => {
    console.log(argument, isLeft);

    var users, player, opponent, points, accuracy, wpm;
    var playerGP, gameProfileModifier;
    var battle = Battle.findOne(argument.battleId);
    if (!battle) return null;
    var endTimeMs = new Date(battle.endTime).getTime();
    var startTimeMs = new Date(battle.startTime).getTime();
    var battleTimeInSeconds = (endTimeMs - startTimeMs) / 1000;

    users = battle.users;
    if (users[0].userId === argument.userId) {
      player = 0;
      opponent = 1;
    } else if (users[1].userId === argument.userId) {
      player = 1;
      opponent = 0;
    } else {
      return null;
    }

    if (player === 0) {
      accuracy = users[0].wordsCompleted / (users[0].wordsCompleted + argument.wordsMissed);
      wpm = Math.floor(users[0].wordsCompleted / (battleTimeInSeconds / 60));
      points = (isLeft || users[0].wordsCompleted === 0) ? 0 : Math.round((users[0].wordsCompleted * accuracy * wpm) / 20);
      Battle.update(argument.battleId, {
        $set: {
          'users.0.accuracy': accuracy,
          'users.0.wpm': wpm
        },
      });
      playerGP = GameProfile.findOne({
        userId: users[0].userId
      });
      gameProfileModifier = {
        $inc: {
          points: points,
          wordsCompleted: users[0].wordsCompleted,
          wordsMissed: argument.wordsMissed,
          timePlayed: battleTimeInSeconds
        },
        $push: {}
      };
      if (battle.users[0].currentHp > battle.users[1].currentHp) {
        // User 0 is the winner
        gameProfileModifier.$push = {
          'gamesWon': argument.battleId
        };
      }
      GameProfile.update({
        userId: battle.users[0].userId
      }, gameProfileModifier);
    } else {
      accuracy = users[1].wordsCompleted / (users[1].wordsCompleted + argument.wordsMissed);
      wpm = Math.floor(users[1].wordsCompleted / (battleTimeInSeconds / 60));
      points = (isLeft || users[1].wordsCompleted === 0) ? 0 : Math.round((battle.users[1].wordsCompleted * accuracy * wpm) / 20);
      Battle.update(argument.battleId, {
        $set: {
          'users.1.accuracy': accuracy,
          'users.1.wpm': wpm
        },
      });
      playerGP = GameProfile.findOne({
        userId: users[1].userId
      });
      gameProfileModifier = {
        $inc: {
          points: points,
          wordsCompleted: users[0].wordsCompleted,
          wordsMissed: argument.wordsMissed,
          timePlayed: battleTimeInSeconds
        },
        $push: {}
      };
      if (battle.users[1].currentHp > battle.users[0].currentHp) {
        // User 1 is the winner
        gameProfileModifier.$push = {
          'gamesWon': argument.battleId
        };
      }
      GameProfile.update({
        userId: users[1].userId
      }, gameProfileModifier);
    }
    return points;

};
