// Parent skeleton input class
// Specifications
//  -Takes in snake, gets info from there
//  -Creates and returns an array
//  -Inputlength is the length of the returned array
class Input extends SnakeComponent{
    constructor(inputLength){
        super();
        this.mySnake = null;
        this.inputLength = inputLength;
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
    constructor(input){
        super(0);

        this.myInputs = new CustomQueue();
        this.componentName = "Multiple Input";

        // read starting inputs
        if(Array.isArray(input)){
            // console.log("hi");
            for (let i = 0; i < input.length; i++) {
                this.addInput(input[i]);
            }
        }
        else{
            // console.log("hi2");
            this.addInput(input);
        }

        // console.log("Multiple Input, myInputs: \n" + this.myInputs.logQueue());
    }
    addInput(inputToAdd){
        this.inputLength += inputToAdd.inputLength;
        this.myInputs.enqueue(inputToAdd);
    }
    generateInput(keyEvent) {
        // init ans array
        let ansInput = Array.apply(null, {length: this.inputLength});
        for(let i = 0; i < ansInput.length; i++){
            ansInput[i] = 0;
        }

        let index = 0;
        let currNode = this.myInputs.startNode;
        while(currNode){
            // get input from current module
            let tempIn = currNode.myVal.generateInput(keyEvent);
            // console.log(`GenerateInput, currNode: ${currNode}, currNode.myVal: ${currNode.myVal.componentName}, tempIn: ${tempIn}, .generateInput: ${currNode.myVal.generateInput}`);

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
        let clone = new MultipleInput([]);

        let curr = this.myInputs.startNode;
        while(curr){
            clone.addInput(curr.myVal.cloneMe());

            curr = curr.myNext;
        }
        return clone;
    }
    updateParentSnake(snake) {
        super.updateParentSnake(snake);

        let curr = this.myInputs.startNode;
        while(curr){
            // console.log(`updateParentSnake, curr: ${curr}, curr.myVal: ${curr.myVal}`);
            curr.myVal.updateParentSnake(snake);
            curr = curr.myNext;
        }
    }
}

// User input
//  basically parses a key event
class PlayerControlledInput extends Input{
    constructor(){
        // alert("Player Controlled Input");
        super(4);
        this.inputID = 0;

        this.componentName = "Player Controlled Input";
        this.componentDescription = "This takes input from the keyboard, namely WASD and the arrow keys"
    }
    generateInput(keyEvent) {
        if(keyEvent == null){
            return [-1, -1, -1, -1];
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

// searches in a direction for a specific grid value
class DirectionalInput extends Input{
    constructor(adjacents, vals){
        super(adjacents.length);

        // "step" with which to search
        this.myAdjacents = adjacents;
        this.vals = vals;

        console.log(`Directional Input, adjacents: ${this.myAdjacents} | vals: ${this.vals}`);

        this.componentName = "Directional Input";
        this.componentDescription = "This input effectively looks in every specified direction and returns the minimum distance to the target values.";
    }
    // raycasts in every direction in adjacents, returning the minimum distance to vals or wall
    generateInput(keyEvent) {
        // init empty array
        let ans = Array.apply(null, {length: this.myAdjacents.length});
        for(let i = 0; i < ans.length; i++){
            ans[i] = 0;
        }

        // helper vars
        let head = this.mySnake.myHeadPos;
        let grid = this.mySnake.mySingleSnakeRunner.grid;

        // console.log(`Top of generateInput: adjacents: ${this.myAdjacents}`);

        // for each direction in adjacents
        for (let i = 0; i < this.myAdjacents.length; i++) {
            let adj = this.myAdjacents[i];

            // ignore adjacent's that would cause an infinite loop
            if(adj === 0){
                ans[i] = 0;
                continue;
            }

            // loop until vals or wall encountered
            let dist = 1;
            let newPos = head + adj;
            let curr = ((newPos < 0 || newPos >= grid.length) ? (-1) : (grid[newPos]));
            // console.log(`adj: ${adj}, head: ${head}, newPos: ${newPos}, curr: ${curr}`);

            while(curr !== -1 && !this.vals.includes(curr)){
                newPos += adj;
                curr = ((newPos < 0 || newPos >= grid.length) ? (-1) : (grid[newPos]));
                dist++;
            }

            ans[i] = dist;
        }

        console.log(ans);

        // return
        return ans;
    }
    cloneMe(){
        let adj = Array.apply(null, {length: this.myAdjacents.length});
        for(let i = 0; i < adj.length; i++){
            adj[i] = this.myAdjacents[i];
        }

        let valsN = Array.apply(null, {length: this.vals.length});
        for(let i = 0; i < valsN.length; i++){
            valsN[i] = this.vals[i];
        }

        return new DirectionalInput(adj, valsN);
    }
    updateParentSnake(snake) {
        super.updateParentSnake(snake);
    }
}
// raycasts all cardinal directions
class CardinalDirectionalInput extends DirectionalInput{
    constructor(vals) {
        super([0, 1, 0, -1], vals);
    }
    // grab grid size and use to calculate adjacents
    updateParentSnake(snake) {
        super.updateParentSnake(snake);

        let gridSize = this.mySnake.gridSize;
        // N, E, S, W
        this.myAdjacents = [-(gridSize+2), 1, (gridSize + 2), -1];

        // console.log(`updateParentSnake, adj: ${this.myAdjacents} | vals: ${this.vals}`);
    }
}
// intercardinal directions
class InterCardinalDirectionalInput extends DirectionalInput{
    constructor(vals) {
        super([0, 0, 0, 0], vals);
    }
    // grab grid size and use to calculate adjacents
    updateParentSnake(snake) {
        super.updateParentSnake(snake);

        let gridSize = this.mySnake.gridSize;
        // NE, SE, SW, NW
        this.myAdjacents = [-(gridSize+2) + 1, (gridSize + 2) + 1, (gridSize + 2) - 1, -(gridSize + 2) - 1];
    }
}

// Simple input, made for Mother's Day
//  works with PathBrain
class SimpleInput extends Input{
    constructor(){
        super(2);
    }
    // returns headpos, gridsize
    generateInput(keyEvent) {
        if(keyEvent){
            // console.log("hi");
            return [-1, -1];
        }
        return [this.mySnake.myHeadPos, this.mySnake.gridSize];
    }
}