// Parent skeleton input class
// Specifications
//  -Takes in snake, gets info from there
//  -Creates and returns an array
//  -Inputlength is the length of the returned array
class Input extends Component{
    constructor(id, inputLength){
        super(id);
        this.mySnake = null;
        this.inputLength = inputLength;
        this.inputID = -1;
    }
    generateInput(keyEvent){
        let arr = Array.apply(null, {length: this.inputLength});
        for(let i = 0; i < arr.length; i++){
            arr[i] = 0;
        }

        this.getInput(keyEvent, arr);

        return arr;
    }
    // where all the actual code logic should be
    getInput(keyEvent, array, offset = 0){
        // do nothing
        console.log("!!! Empty getInput Called !!!");
        // return array;
    }
    // returns a copy of this input
    cloneMe(){
        let clone = new Input();
        clone.getInput = this.getInput;
        clone.inputLength = this.inputLength;

        this.cloneComponents(clone);

        return clone;
    }
    // called by snake constructor
    updateParentSnake(snake){
        this.mySnake = snake;
    }
    // stringify, circular structure disables straight JSON.stringify
    stringify() {
        let snek = this.mySnake;
        this.mySnake = null;
        let ans = JSON.stringify(this);
        this.mySnake = snek;
        return ans;
    }
    // parse
    static parse(str){
        let ans = super.parse(str, inputPrototypes);

        // special for multiple input
        if(ans.componentID === 0){
            ans.helperParse();
        }

        return ans;

    }
}

// Input which basically just agglomerates smaller inputs
// Specifications
//  -Basically appends input arrays to each other
class MultipleInput extends Input{
    constructor(){
        super(0, 0);

        this.myInputs = new CustomQueue();
        this.componentName = "Multiple Input";

        // read starting inputs
        for (let i = 0; i < arguments.length; i++) {
            this.addInput(arguments[i]);
        }

        // console.log(`inputLength: ${this.inputLength}, myInputs: ${this.myInputs.logQueue()}`);

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
            currNode.myVal.getInput(keyEvent, ansInput, index);

            index += currNode.myVal.inputLength;

            // go to the next module
            currNode = currNode.myNext;
        }

        // return the result
        return ansInput;
    }


    // returns a copy of this input, object type decays, but all functionality is preserved
    cloneMe(snake){
        let clone = new MultipleInput();

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
    // stringify
    stringify() {
        // save the circular stuff into temp variables
        let snake = this.mySnake;
        let inputs = Array.apply(null, {length: this.myInputs.size});
        for(let i = 0; i < inputs.length; i++){
            inputs[i] = this.myInputs.poll();
        }

        // save the inputs here
        this.myInputs = Array.apply(null, {length: inputs.length});
        for(let i = 0; i < this.myInputs.length; i++){
            this.myInputs[i] = inputs[i].stringify();
        }

        // delete the circular stuff
        this.mySnake = null;

        // generate json
        let ans = JSON.stringify(this);

        // put the circular stuff back
        this.myInputs = new CustomQueue();
        for (let i = 0; i < inputs.length; i++) {
            this.myInputs.enqueue(inputs[i]);
        }
        this.mySnake = snake;

        return ans;
    }

    // helper parse
    helperParse(){
        // console.log("Helper parse, this.strInputs: ");
        // console.log(this.strInputs);

        let saved = this.myInputs;

        this.myInputs = new CustomQueue();
        for (let i = 0; i < saved.length; i++) {
            this.myInputs.enqueue(Input.parse(saved[i]));
        }
    }
}

// User input
//  basically parses a key event
class PlayerControlledInput extends Input{
    constructor(){
        // alert("Player Controlled Input");
        super(1, 4);
        this.inputID = 0;

        this.componentName = "Player Controlled Input";
        this.componentDescription = "This takes input from the keyboard, namely WASD and the arrow keys"
    }
    getInput(keyEvent, array, offset = 0) {
        if(!keyEvent){
            array[offset] = -1;
            return;
        }
        // key pressed
        if(keyEvent.key === "Up" || keyEvent.key === "ArrowUp" || keyEvent.key === "W" || keyEvent.key === "w"){
            array[offset] = 1;
        }
        else if(keyEvent.key === "Right" || keyEvent.key === "ArrowRight" || keyEvent.key === "D" || keyEvent.key === "d"){
            array[1 + offset] = 1;
        }
        else if(keyEvent.key === "Down" || keyEvent.key === "ArrowDown" || keyEvent.key === "S" || keyEvent.key === "s"){
            array[2 + offset] = 1;
        }
        else if(keyEvent.key === "Left" || keyEvent.key === "ArrowLeft" || keyEvent.key === 'A' || keyEvent.key === 'a') {
            array[3 + offset] = 1;
        }
        else{
            array[offset] = -1;
        }
    }
}

// searches in a direction for a specific grid value
class DirectionalInput extends Input{
    constructor(adjacents, vals){
        super(2, adjacents.length);

        // "step" with which to search
        this.originalAdjacents = adjacents;
        this.myAdjacents = null;
        this.vals = vals;

        // console.log(`Directional Input, adjacents: ${this.myAdjacents} | vals: ${this.vals}`);

        this.componentName = "Directional Input";
        this.componentDescription = "This input effectively looks in every specified direction and returns the minimum distance to the target values.";
    }
    // raycasts in every direction in adjacents, returning the minimum distance to vals or wall
    getInput(keyEvent, array, offset = 0) {
        // helper vars
        let head = this.mySnake.myHeadPos;
        let grid = this.mySnake.mySingleSnakeRunner.grid;

        // for each direction in adjacents
        for (let i = 0; i < this.myAdjacents.length; i++) {
            let adj = this.myAdjacents[i];

            // ignore adjacent's that would cause an infinite loop
            if(!adj){
                array[i + offset] = 0;
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

            array[i + offset] = dist;
        }

        // console.log(array);
    }
    cloneMe(){
        let adj = Array.apply(null, {length: this.originalAdjacents.length});
        for(let i = 0; i < adj.length; i++){
            adj[i] = this.originalAdjacents[i];
        }

        let valsN = Array.apply(null, {length: this.vals.length});
        for(let i = 0; i < valsN.length; i++){
            valsN[i] = this.vals[i];
        }

        let clone = new DirectionalInput(adj, valsN);
        this.cloneComponents(clone);

        return clone;
    }
    updateParentSnake(snake) {
        super.updateParentSnake(snake);

        let gridSize = this.mySnake.gridSize;

        // parse adjacents
        this.myAdjacents = Array.apply(null, {length: this.originalAdjacents.length});
        for(let i = 0; i < this.myAdjacents.length; i++){
            if(typeof this.originalAdjacents[i] == "number"){
                this.myAdjacents[i] = this.originalAdjacents[i];
            }
            else{
                let key = this.originalAdjacents[i].toLowerCase();
                let ans;
                switch (key) {
                    case 'n':
                        ans = -(gridSize + 2);
                        break;
                    case 'ne':
                        ans = -(gridSize + 2) + 1;
                        break;
                    case 'e':
                        ans = 1;
                        break;
                    case 'se':
                        ans = (gridSize + 2) + 1;
                        break;
                    case 's':
                        ans = (gridSize + 2);
                        break;
                    case 'sw':
                        ans = (gridSize + 2) - 1;
                        break;
                    case 'w':
                        ans = -1;
                        break;
                    case 'nw':
                        ans = -(gridSize + 2) - 1;
                        break;
                    default:
                        console.log("UNKNOWN ADJACENT IN UPDATEWITHPARENTSNAKE");
                }
                this.myAdjacents[i] = ans;
            }
        }
    }
}
// raycasts all cardinal directions
class CardinalDirectionalInput extends DirectionalInput{
    constructor(vals) {
        super(["N", "E", "S", "W"], vals);

        this.componentName = "Cardinal Direction";
        this.componentDescription = "This input effectively looks in every cardinal direction and returns the minimum distance to the target values.";
    }
    // // grab grid size and use to calculate adjacents
    // updateParentSnake(snake) {
    //     super.updateParentSnake(snake);
    //
    //     let gridSize = this.mySnake.gridSize;
    //     // N, E, S, W
    //     this.myAdjacents = [-(gridSize+2), 1, (gridSize + 2), -1];
    //
    //     // console.log(`updateParentSnake, adj: ${this.myAdjacents} | vals: ${this.vals}`);
    // }
}
// intercardinal directions
class InterCardinalDirectionalInput extends DirectionalInput{
    constructor(vals) {
        super(["NE", "SE", "SW", "NW"], vals);

        this.componentName = "Inter-cardinal Direction";
        this.componentDescription = "This input effectively looks in every inter-cardinal direction and returns the minimum distance to the target values.";
    }
    // // grab grid size and use to calculate adjacents
    // updateParentSnake(snake) {
    //     super.updateParentSnake(snake);
    //
    //     let gridSize = this.mySnake.gridSize;
    //     // NE, SE, SW, NW
    //     this.myAdjacents = [-(gridSize+2) + 1, (gridSize + 2) + 1, (gridSize + 2) - 1, -(gridSize + 2) - 1];
    // }
}
// combines cardinal and intercardinal directions
class CardinalIntercardinalDirectionalInput extends DirectionalInput{
    constructor(vals){
        // N, NE, E, SE, S, SW, W, NW
        super(["N", "NE", "E", "SE", "S", "SW", "W", "NW"], vals);

        this.componentName = "All Direction";
        this.componentDescription = "This input effectively looks in every inter-cardinal direction and every cardinal direction and returns the minimum distance to the target values.";
    }
    // updateParentSnake(snake) {
    //     super.updateParentSnake(snake);
    //
    //     let gridSize = this.mySnake.gridSize;
    //     this.myAdjacents = [-(gridSize+2), -(gridSize+2) + 1, 1, (gridSize + 2) + 1, (gridSize + 2), (gridSize + 2) - 1, -1, -(gridSize + 2) - 1];
    // }
}

// Simple input, made for Mother's Day
//  works with PathBrain
class SimpleInput extends Input{
    constructor(){
        super(3, 2);
    }
    // returns headpos, gridsize
    getInput(keyEvent, array, offset = 0) {
        if(keyEvent){
            array[offset] = -1;
        }
        array[offset] = this.mySnake.myHeadPos;
        array[1 + offset] = this.mySnake.gridSize;
    }
}

// simply has the snake's length
class LengthInput extends Input{
    constructor(){
        super(4, 1);

        this.componentName = "Length Input";
        this.componentDescription = "This simply has the snake's current length as the input.";
    }
    // length
    getInput(keyEvent, array, offset = 0) {
        if(keyEvent){
            array[offset] = -1;
            return;
        }
        array[offset] = this.mySnake.myLength;
    }
}

const inputPrototypes = [MultipleInput.prototype, PlayerControlledInput.prototype, DirectionalInput.prototype, SimpleInput.prototype, LengthInput.prototype];
