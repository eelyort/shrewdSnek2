// Parent skeleton input class
// Specifications
//  -Takes in snake, gets info from there
//  -Creates and returns an array
//  -Inputlength is the length of the returned array
class Input{
    constructor(){
        this.mySnake = null;
        this.inputLength = 0;
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
        super();
        this.inputLength = 4;
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