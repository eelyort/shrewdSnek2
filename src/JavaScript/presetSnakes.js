// Player controlled snake
const presetPlayerControlled = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    3,
    3
);
presetPlayerControlled.setName("Player");

// TODO: delete these
const presetPlayerControlledB = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    4,
    3
);
presetPlayerControlledB.setName("Player B");

const presetPlayerControlledC = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    6,
    5
);
presetPlayerControlledC.setName("Player Controlled C");

const presetPlayerControlledD = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    6,
    7
);
presetPlayerControlledD.setName("Player D");

const presetPlayerControlledE = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    6,
    10
);
presetPlayerControlledE.setName("Player E");

const presetPlayerControlledF = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    6,
    20
);
presetPlayerControlledF.setName("Player F");

let loadedSnakes = [presetPlayerControlled, presetPlayerControlledB, presetPlayerControlledC, presetPlayerControlledD, presetPlayerControlledE, presetPlayerControlledF];