// TODO: replace with text file as soon as file reading/output is finished
// Player controlled snake
// const presetPlayerControlledInput = new PlayerControlledInput();
// const presetPlayerControlledBrain = new PlayerControlledBrain();
const presetPlayerControlled = new Snake(
    new PlayerControlledInput(),
    new PlayerControlledBrain(),
    1,
    3
);

// alert(presetPlayerControlled);
// alert(presetPlayerControlled.myBrain);
// alert(presetPlayerControlled.myBrain.mutateMethod);