// Player controlled snake
const presetPlayerControlled = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    1,
    3
);
presetPlayerControlled.name = "Player Controlled";

let loadedSnakes = {presetPlayerControlled};

// TODO: delete these
const presetPlayerControlledB = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    1,
    4
);
presetPlayerControlledB.name = "Player Controlled B";

const presetPlayerControlledC = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    1,
    6
);
presetPlayerControlledC.name = "Player Controlled C";

const presetPlayerControlledD = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    1,
    6
);
presetPlayerControlledD.name = "Player Controlled C";

const presetPlayerControlledE = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    1,
    6
);
presetPlayerControlledE.name = "Player Controlled C";

const presetPlayerControlledF = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    1,
    6
);
presetPlayerControlledF.name = "Player Controlled C";