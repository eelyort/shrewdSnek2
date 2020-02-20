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

// Player controlled snake, basically just parses an array to a direction
class PlayerControlledBrain extends SnakeBrain{
    constructor(){
        super();
    }
    // assumes the input is an array of 0-1
    getDecision(brainInput) {
        if(brainInput[0]){
            return 0;
        }
        if(brainInput[1]){
            return 1;
        }
        if(brainInput[2]){
            return 2;
        }
        if(brainInput[3]){
            return 3;
        }
        return 4;
    }
}