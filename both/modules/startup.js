let startup = () => {
  //actions enum
  ACTION = {
    CREATE_BATTLE: 0,
    JOIN_BATTLE: 1,
    LEAVE_BATTLE: 2,
    START_BATTLE: 3,
    END_BATTLE: 4,
    ATTACK: 5
  };
};

Modules.both.startup = startup;
