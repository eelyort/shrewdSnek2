// Parent skeleton input class
// Specifications
//  -Takes in snake, gets info from there
//  -Creates and returns an array
//  -Inputlength is the length of the returned array
class Input extends SnakeComponent{
    constructor(){
        super();
        this.mySnake = null;
        this.inputLength = 0;
        this.inputID = -1;
    }
    generateInput(keyEvent){
        return [];
    }
    // returns a copy of this input
    cloneMe(){
        let clone = new Input();
        clone.generateInput = this.generateInput;
        clone.inputLength = this.inputLength;
        return clone;
    }
    // called by snake constructor
    updateParentSnake(snake){
        this.mySnake = snake;
    }
}

// Input which basically just agglomerates smaller inputs
// Specifications
//  -Basically appends input arrays to each other
class MultipleInput extends Input{
    constructor(firstInput){
        super();
        this.myInputs = new CustomQueue();
        this.addInput(firstInput);
        this.componentName("Multiple Input");
    }
    addInput(inputToAdd){
        this.inputLength += inputToAdd.inputLength;
        this.myInputs.enqueue(inputToAdd);
    }
    generateInput(keyEvent) {
        let ansInput = new Array[this.inputLength];
        let index = 0;
        let currNode = this.myInputs.startNode;
        while(currNode != null){
            // get input from current module
            let tempIn = currNode.myVal.generateInput(keyEvent);
            // copy the contents
            for (let i = 0; i < tempIn.length; i++) {
                ansInput[index] = tempIn[i];
                index++;
            }

            // go to the next module
            currNode = currNode.myNext;
        }

        // return the result
        return ansInput;
    }
    // returns a copy of this input, object type decays, but all functionality is preserved
    cloneMe(snake){
        let clone = super.cloneMe(snake).bind(this);
        clone.myInputs = this.myInputs;
        clone.addInput = this.addInput;
        return clone;
    }
}

// User input
//  basically parses a key event
class PlayerControlledInput extends Input{
    constructor(){
        // alert("Player Controlled Input");
        super();
        this.inputLength = 4;
        this.inputID = 0;

        this.componentName = "Player Controlled Input";
        this.componentDescription = "This takes input from the keyboard, namely WASD and the arrow keys"
    }
    generateInput(keyEvent) {
        if(keyEvent == null){
            return null;
        }
        // alert("generateInput with keyEvent.key: " + keyEvent.key);
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
        // alert("ansInput: " + ansInput);
        return ansInput;
    }
}

// Simple input, snake follows a path infinitely, made for Mother's Day
//  works with PathBrain
class SimpleInput extends Input{
    constructor(){
        super();
    }
    // returns headpos, gridsize
    generateInput(keyEvent) {
        if(keyEvent){
            // console.log("hi");
            return [];
        }
        return [this.mySnake.myHeadPos, this.mySnake.gridSize];
    }
}