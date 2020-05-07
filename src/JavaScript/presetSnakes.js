// array of loaded snakes
let loadedSnakes = [];

// Player controlled snake
const presetPlayerControlled = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    0,
    3,
    3,
    25,
    "Player",
    "Starter Human Controlled Snake. Control with the WASD or arrow keys."
);
loadedSnakes.push(presetPlayerControlled);

// snakes which you cannot edit
const protectedSnakes = loadedSnakes.length;

// TODO delete me
const testSnake = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(null),
    0,
    3,
    3,
    5,
    "Test Snake",
    "Starter Human Controlled Snake. Control with the WASD or arrow keys."
);
loadedSnakes.push(testSnake);