/* Format of file (single snake), infinite whitespace allowed between lines

Snake - NameSnake

Input
inputID - inputName
inputID2 - inputName2

Mutate Method
mutateID - mutateName
etc

Brain
braidID - brainName
etc

Head Position
headPos

Start Length
startLengthIn

End Snake

 */

// TODO: replace this with JSON.parse?

// id of inputs so can initialize them by id, assume multiple input is implied
const inputIDs = [
    function () {
        return new PlayerControlledInput();
    }
];

// id of brain
const brainIDs = [
    function (mutate) {
        return new PlayerControlledBrain(mutate);
    }
];

// id of mutate methods
const mutateIDs = [
    function () {
        return new MutateMethod();
    }
];

// reads a single snake from a file
function readOneSnake(filePath){
    let str;
    const fs = require('fs');
    let lines = str.toLowerCase().split("\n");
    return readOneSnakeLines(lines);
}
// same as above but takes lines
function readOneSnakeLines(lines){
    let lineIndex = 0;

    // search for start of snake
    while(lineIndex < lines.length && lines[lineIndex].length > 4 && lines[lineIndex].substring(0, 5) !== "snake"){
        lineIndex++;
    }
    // grab the snake's name
    let name = lines[lineIndex].substring(8);
    // ignore line with "snake"
    lineIndex++;

    // input
    while(lineIndex < lines.length && lines[lineIndex] !== "input"){
        lineIndex++;
    }
    // ignore line with "input"
    lineIndex++;
    // assume multiple input
    let inputs = [];
    while(lineIndex < lines.length && lines[lineIndex] !== "mutate method"){
        if(lines[lineIndex] != null && lines[lineIndex].length > 0){
            // pushes in the function which creates it
            inputs.push(inputIDs[parseInt( lines[lineIndex].split(" ")[0] )]);
        }
        lineIndex++;
    }
    
    // mutate method
    // ignore line with "mutate method"
    lineIndex++;
    let mutateMethod = null;
    while(lineIndex < lines.length && lines[lineIndex] !== "brain"){
        if(lines[lineIndex] != null && lines[lineIndex].length > 0){
            if(mutateMethod === null) {
                // the function which creates it
                mutateMethod = mutateIDs[parseInt(lines[lineIndex].split(" ")[0])];
            }
            else{
                alert("!!!More than one mutate method detected in readOneSnakeLines!!!");
                return null;
            }
        }
        lineIndex++;
    }
    
    // brain
    // ignore line with "brain"
    lineIndex++;
    let brain = null;
    while(lineIndex < lines.length && lines[lineIndex] !== "head position"){
        if(lines[lineIndex] != null && lines[lineIndex].length > 0){
            if(brain === null) {
                // the function which creates it
                brain = brainIDs[parseInt(lines[lineIndex].split(" ")[0])];
            }
            else{
                alert("!!!More than one brain detected in readOneSnakeLines!!!");
                return null;
            }
        }
        lineIndex++;
    }

    // headpos and start length
    let headPos, startLen;
    lineIndex++;
    while(lineIndex < lines.length && lines[lineIndex] !== "start length"){
        if(lines[lineIndex] != null && lines[lineIndex].length > 0){
            headPos = parseInt(lines[lineIndex]);
        }
        lineIndex++;
    }
    lineIndex++;
    while(lineIndex < lines.length && lines[lineIndex] !== "end snake"){
        if(lines[lineIndex] != null && lines[lineIndex].length > 0){
            startLen = parseInt(lines[lineIndex]);
        }
        lineIndex++;
    }

    // check for empty fields
    if(input == null){
        alert("!!!No input in readOneSnakeLines!!!");
        return null;
    }
    if(mutateMethod == null){
        alert("!!!No mutate method in readOneSnakeLines!!!");
        return null;
    }
    if(brain == null){
        alert("!!!No brain in readOneSnakeLines!!!");
        return null;
    }

    // process
    // process inputs
    let input = null;
    // multiple
    if(inputs.length > 1){
        input = new MultipleInput(inputs[0]);
        for (let i = 1; i < inputs.length; i++) {
            input.addInput(inputs[i]());
        }
    }
    // single input
    else{
        input = inputs[0]();
    }
    // process mutate method
    mutateMethod = mutateMethod();
    // process brain
    brain = brain(mutateMethod);

    // create
    let snake = new Snake(
        input,
        brain,
        ((headPos === undefined) ? (1) : (headPos)),
        ((startLen === undefined) ? (3) : (startLen))
    );
    snake.name = name;

    // create and return
    return snake;
}