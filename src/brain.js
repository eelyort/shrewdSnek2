// Parent skeleton brain class
// Specifications
//  -Takes in an "input" into method, gets decision (direction) out
//  -Can mutate with set method, variable parameters
class SnakeBrain{
    constructor(){

    }
    // takes in input(compress into array)
    // outputs a direction:
    //   0 = North
    //   1 = East
    //   2 = South
    //   3 = West
    //   4 = None
    getDecision(brainInput){
        return 0;
    }
    mutateMe(mutateParameters){

    }
}

// Player controlled snake, basically just parses a key event into direction
class PlayerControlledBrain extends SnakeBrain{
    constructor(){
        super();
    }
    // assumes the input is a key event
    getDecision(brainInput) {
        if(brainInput.key == "Up" || brainInput.key == "ArrowUp" || brainInput.key == "W" || brainInput.key == "w"){
            return 0;
        }
        if(brainInput.key == "Right" || brainInput.key == "ArrowRight" || brainInput.key == "D" || brainInput.key == "d"){
            return 1;
        }
        if(brainInput.key == "Down" || brainInput.key == "ArrowDown" || brainInput.key == "S" || brainInput.key == "s"){
            return 2;
        }
        if(brainInput.key == "Left" || brainInput.key == "ArrowLeft" || brainInput.key == 'A' || brainInput.key == 'a') {
            return 3;
        }
        return 4;
    }
}