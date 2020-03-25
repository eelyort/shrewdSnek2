// Player controlled snake
const presetPlayerControlled = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    1,
    3
);
presetPlayerControlled.name = "Player Controlled";

let loadedSnakes = {presetPlayerControlled};