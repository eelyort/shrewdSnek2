// Player controlled snake
const presetPlayerControlled = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    3,
    3,
    25,
    "Player",
    "Starter Human Controlled Snake. Controlled with WASD or the arrow keys."
);
// presetPlayerControlled.setName("Player");

// TODO: delete these
const presetPlayerControlledB = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    4,
    3,
    5
);
presetPlayerControlledB.setName("Player B");

const presetPlayerControlledC = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    6,
    5,
    25
);
presetPlayerControlledC.setName("Player Controlled C");

const presetPlayerControlledD = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    6,
    7,
    25
);
presetPlayerControlledD.setName("Player D");

const presetPlayerControlledE = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    6,
    10,
    25
);
presetPlayerControlledE.setName("Player E");

const presetPlayerControlledF = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    6,
    20,
    25
);
presetPlayerControlledF.setName("Player F");

let loadedSnakes = [presetPlayerControlled, presetPlayerControlledB, presetPlayerControlledC, presetPlayerControlledD, presetPlayerControlledE, presetPlayerControlledF];