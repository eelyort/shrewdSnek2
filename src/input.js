// Parent skeleton input class
// Specifications
//  -Takes in snake, gets info from there
//  -Creates and returns an array
class Input{
    constructor(snake){
        this.mySnake = snake;
    }
    generateInput(keyEvent){
        return [];
    }
}

// User input
//  basically parses a key event
class PlayerControlledInput extends Input{
    constructor(snake){
        super(snake);
    }
    generateInput(keyEvent) {
        let ansInput = [false, false, false, false];
        if(keyEvent.key == "Up" || keyEvent.key == "ArrowUp" || keyEvent.key == "W" || keyEvent.key == "w"){
            ansInput[0] = true;
        }
        else if(keyEvent.key == "Right" || keyEvent.key == "ArrowRight" || keyEvent.key == "D" || keyEvent.key == "d"){
            ansInput[1] = true;
        }
        else if(keyEvent.key == "Down" || keyEvent.key == "ArrowDown" || keyEvent.key == "S" || keyEvent.key == "s"){
            ansInput[2] = true;
        }
        else if(keyEvent.key == "Left" || keyEvent.key == "ArrowLeft" || keyEvent.key == 'A' || keyEvent.key == 'a') {
            ansInput[3] = true;
        }
        return ansInput;
    }
}