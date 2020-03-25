// Parent skeleton brain class
// Specifications
//  -Takes in an "input" into method, gets decision (direction) out
//  -Can mutate with many methods, variable parameters
class SnakeBrain{
    constructor(mutateMethod){
        this.mutateMethod = mutateMethod;
        this.brainID = -1;
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
        this.mutateMethod.mutate(mutateParameters, this);
    }
    // returns a copy of this brain
    cloneMe(){
        let clone = new SnakeBrain(this.mutateMethod.cloneMe());
        clone.getDecision = this.getDecision;
        return clone;
    }
}

// Player controlled snake, basically just parses an array to a direction
class PlayerControlledBrain extends SnakeBrain{
    constructor(){
        // alert("Player Controlled Brain");
        super(new MutateMethod());
        this.brainID = 0;
    }
    // assumes the input is an array of 0-1
    getDecision(brainInput) {
        if(brainInput == null){
            return 4;
        }
        if(brainInput[0]){
            return 0;
        }
        if(brainInput[1]){
            return 1;
        }
        if(brainInput[2]){
            // alert("brain getDecision: 2");
            return 2;
        }
        if(brainInput[3]){
            return 3;
        }
        // alert("brain getDecision: 4");
        return 4;
    }
}