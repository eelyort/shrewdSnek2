let blankBrains = [];

// Parent skeleton brain class
// Specifications
//  -Takes in an "input" into method, gets decision (direction) out
//  -Can mutate with many methods, variable parameters
class Brain extends Component{
    constructor(id){
        super(id);
        this.brainID = -1;

        this.componentName = "Empty Brain";
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
    // returns a copy of this brain
    cloneMe(){
        let clone = new Brain();
        clone.getDecision = this.getDecision;

        this.cloneComponents(clone);

        return clone;
    }
    // private, meant to be used by other brains only
    // assumes the output array is a 4 length array
    //  N(0), E(1), S(2), W(3)
    getOutput(outputArr){
        // search for max
        let maxI = 0;
        for (let i = 1; i < 4; i++) {
            if(outputArr[i] > outputArr[maxI]){
                maxI = i;
            }
        }

        // return decision
        return maxI;
    }
    updateWithInput(input){
        // do nothing
    }
    static parse(str){
        let ans = super.parse(str, brainPrototypes);
        if(ans.componentID === 2){
            ans.helperParse();
        }

        return ans;
    }
    // made to parse the first evolutions and no more
    static OLDPARSE(str){
        console.log("OLDPARSE:");
        let ans = super.parse(str, brainPrototypes);
        Object.setPrototypeOf(ans.myNormalizer, TanhNormalizer.prototype);
        return ans;
    }
}

// Path Brain, snake follows a path infinitely, made for Mother's Day
class PathBrain extends Brain{
    // path format: array of values
    //  single number: goto that index
    //  array of [r, c]: goto that r, c
    //  negatives: go in one direction until hit next val or wall (not body segments)
    //   -1: north
    //   -2: east
    //   -3: south
    //   -4: west
    constructor(path){
        super(0);

        this.myRawPath = path;
        this.currIdx = 0;

        // decompiled path, turns all [r, c] into actual indexes
        this.myDecompiledPath = null;

        this.componentName = "Path Brain";
        this.componentDescription = "A brain which simply follows the given path until it dies.";
    }
    // decompiler
    decompile(gridSize){
        // init
        this.myDecompiledPath = Array.apply(null, {length: this.myRawPath.length});
        for(let i = 0; i < this.myDecompiledPath.length; i++){
            this.myDecompiledPath[i] = 0;
        }

        // loop through and decompile
        for (let i = 0; i < this.myRawPath.length; i++) {
            let curr = this.myRawPath[i];

            // console.log(`curr: ${curr}`);

            // need to decompile
            if(Array.isArray(curr)){
                // console.log("Is array");

                let r = curr[0];
                let c = curr[1];

                // console.log(`r: ${r}, c: ${c}`);

                this.myDecompiledPath[i] = (r * (gridSize + 2)) + c + 1;
            }
            // keep
            else{
                this.myDecompiledPath[i] = curr;
            }
        }
    }
    // follow the path
    getDecision(brainInput) {
        // filter out key presses
        if(brainInput[0] === -1){
            return 4;
        }

        // decompile
        if(this.myDecompiledPath == null){
            this.decompile(brainInput[1]);
            // console.log("Decompiled to: " + this.myDecompiledPath);
        }

        // pull input
        let headPos = brainInput[0];
        let gridSize = brainInput[1];

        let curr = this.myDecompiledPath[this.currIdx];

        // edge case: exiting from a negative number
        while(curr === headPos){
            // update index
            this.currIdx++;
            if(this.currIdx === this.myDecompiledPath.length){
                this.currIdx = 0;
            }
            curr = this.myDecompiledPath[this.currIdx];
        }

        // negative numbers
        if(curr < 0){
            // going to absolute value
            let adjacents = [0, -(gridSize + 2), 1, (gridSize + 2), -1];

            // get positions
            let nextPos = headPos + adjacents[Math.abs(curr)];
            let nextPath = this.myDecompiledPath[((this.currIdx === this.myDecompiledPath.length - 1) ? (0) : (this.currIdx + 1))];
            // console.log(`headPos: ${headPos}, nextPos: ${nextPos}, nextPath: ${nextPath}`);

            // deconstruct
            let r = Math.floor(nextPos / (gridSize + 2));
            let c = (nextPos % (gridSize + 2)) - 1;

            // stop moving sideways next call if
            //  moving into next path square
            if(nextPos === nextPath){
                // update index
                this.currIdx++;
                if(this.currIdx === this.myDecompiledPath.length){
                    this.currIdx = 0;
                }
            }
            //  next to wall on top or bottom
            if(curr % 2 && (r === 0 || r === gridSize - 1)){
                // update index
                this.currIdx++;
                if(this.currIdx === this.myDecompiledPath.length){
                    this.currIdx = 0;
                }
            }
            //  next to wall on left/right
            if(!(curr % 2) && (c === 0 || c === gridSize - 1)){
                // update index
                this.currIdx++;
                if(this.currIdx === this.myDecompiledPath.length){
                    this.currIdx = 0;
                }
            }

            // go in correct direction
            return (Math.abs(curr) - 1);
        }
        // index
        else{
            // update index
            this.currIdx++;
            if(this.currIdx === this.myDecompiledPath.length){
                this.currIdx = 0;
            }

            // console.log(`curr: ${curr}, headPos: ${headPos}`);

            // return this.getOutput([curr === headPos - 1, curr === headPos + 1, curr === headPos - (gridSize +2 ), curr === headPos + (gridSize + 2)]);
            // left
            if(curr === headPos - 1){
                return 3;
            }
            // right
            if(curr === headPos + 1){
                return 1;
            }
            // up
            if(curr === headPos - (gridSize + 2)){
                return 0;
            }
            // down
            if(curr === headPos + (gridSize + 2)){
                return 2;
            }

            // should never get here
            console.log("Error at PathBrain getDecision!");

            return 4;
        }
    }
    // clone
    cloneMe() {
        return new PathBrain(this.myRawPath);
    }
}
blankBrains.push(new PathBrain(
    [[ 0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ 4, 0 ], [ 5, 0 ], [ 6, 0 ], [ 7, 0 ], [ 8, 0 ], [ 9, 0 ], [ 10, 0 ], [ 11, 0 ], [ 11, 1 ], [ 11, 2 ], [ 11, 3 ], [ 11, 4 ], [ 11, 5 ], [ 11, 6 ], [ 11, 7 ], [ 11, 8 ], [ 11, 9 ], [ 11, 10 ], [ 11, 11 ], [ 10, 11 ], [ 9, 11 ], [ 8, 11 ], [ 7, 11 ], [ 6, 11 ], [ 5, 11 ], [ 4, 11 ], [ 3, 11 ], [ 2, 11 ], [ 1, 11 ], [ 0, 11 ], [ 0, 10 ], [ 0, 9 ], [ 0, 8 ], [ 0, 7 ], [ 0, 6 ], [ 0, 5 ], [ 0, 4 ], [ 0, 3 ], [ 0, 2 ], [ 0, 1 ]]));

// Player controlled snake, basically just parses an array to a direction
class PlayerControlledBrain extends Brain{
    constructor(){
        // alert("Player Controlled Brain");
        super(1);
        this.brainID = 0;

        this.componentName = "Player Controlled Brain";
        this.componentDescription = "This brain controls the snake based off of key inputs, meant to be used with Player Controlled Input";
    }
    // assumes the input is an array of 0-1
    getDecision(brainInput) {
        // filter out when there is no keypress
        if(brainInput[0] === -1){
            return 4;
        }
        return this.getOutput(brainInput);
    }
}
blankBrains.push(new PlayerControlledBrain());

// Neural network brain - fixed topology and feedforward only
class NeuralNetBrain extends Brain{
    constructor(normalizer, depth, width, startWeight, startBias){
        super(2);

        this.componentName = "Basic Neural Network Brain";
        this.componentDescription = "This brain is a simple neural network, with a set depth and width. It can be used with most forms of machine learning. It makes all of its decisions via forward propagation.";

        // sigmoid/htan func to normalize/activate nodes
        this.myNormalizer = normalizer;

        // number of hidden layers
        this.myDepth = depth;
        // number of nodes in every hidden layer
        this.myWidth = width;
        // number of nodes in input
        this.myInputWidth = -1;
        // initial values for weights and biases
        this.startWeight = startWeight;
        this.startBias = startBias;

        // Create the matrix containing all the values
        //
        // First dimension: layers
        //  this.myMat[i] returns the i-th layer
        //  this.myDepth = outputs
        //
        // Second dimension: value type
        //  For all this.myMat[layer], this.myMat[layer][0].length = this.myMat[layer][1].length = this.myMat[layer][2].length
        //  General:
        //   this.myMat[layer][0] = activated values
        //   this.myMat[layer][1] = weights array
        //   this.myMat[layer][2] = biases
        //
        // Third dimension
        //  this.myMat[layer][type][i] = i-th node
        //  weights:
        //   this.myMat[layer][type][1][i] = array of weights for the i-th node
        //   this.myMat[layer][type][1][i][j] = weight: (last layer's node j) -> (this layer's node i)
        //
        // First dimension
        this.myMat = Array.apply(null, {length: (this.myDepth + 1)});
        // Second dimension
        for (let layer = 0; layer < this.myMat.length; layer++) {
            this.myMat[layer] = Array.apply(null, {length: 3});
        }
        // Third dimension
        // hidden layers
        for (let layer = 0; layer < this.myMat.length - 1; layer++) {

            // values
            this.myMat[layer][0] = Array.apply(null, {length: this.myWidth});
            for (let node = 0; node < this.myMat[layer][0].length; node++) {
                this.myMat[layer][0][node] = 0;
            }

            // weights
            this.myMat[layer][1] = Array.apply(null, {length: this.myWidth});
            for (let node = 0; node < this.myWidth; node++) {

                // from input
                if(layer === 0){
                    break;
                }

                // from previous hidden layer
                else {
                    this.myMat[layer][1][node] = Array.apply(null, {length: this.myWidth});
                    for (let source = 0; source < this.myMat[layer][1][node].length; source++) {
                        this.myMat[layer][1][node][source] = 0;
                    }
                }
            }

            // biases
            this.myMat[layer][2] = Array.apply(null, {length: this.myWidth});
            for (let node = 0; node < this.myMat[layer][2].length; node++) {
                this.myMat[layer][2][node] = 0;
            }
        }
        // output layer
        // values
        this.myMat[this.myMat.length - 1][0] = Array.apply(null, {length: 4});
        for (let node = 0; node < this.myMat[this.myMat.length - 1][0].length; node++) {
            this.myMat[this.myMat.length - 1][0][node] = 0;
        }

        // weights
        this.myMat[this.myMat.length - 1][1] = Array.apply(null, {length: 4});
        for (let node = 0; node < 4; node++) {
            this.myMat[this.myMat.length - 1][1][node] = Array.apply(null, {length: this.myWidth});
            for (let source = 0; source < this.myMat[this.myMat.length - 1][1][node].length; source++) {
                this.myMat[this.myMat.length - 1][1][node][source] = 0;
            }
        }

        // biases
        this.myMat[this.myMat.length - 1][2] = Array.apply(null, {length: 4});
        for (let node = 0; node < this.myMat[this.myMat.length - 1][2].length; node++) {
            this.myMat[this.myMat.length - 1][2][node] = 0;
        }

        // track whether this has been given values already
        this.hasValues = false;
    }
    // forward propagation
    getDecision(brainInput) {
        // console.log("getDecision, brainInput: " + brainInput);
        // input to first hidden layer
        // pre-activation
        for (let node = 0; node < this.myWidth; node++) {
            // console.log(`node: ${node}, dotting: ${this.myMat[0][1][node]}, bias: ${this.myMat[0][2][node]}`);
            this.myMat[0][0][node] = math.dot(brainInput, this.myMat[0][1][node]) + this.myMat[0][2][node];
        }
        // activation
        this.myNormalizer.normalizeCol(this.myMat[0][0]);

        // console.log("first col: " +  this.myMat[0][0]);

        // everything else
        for (let layer = 1; layer < this.myMat.length; layer++) {
            // pre-activation
            for (let node = 0; node < this.myMat[layer][0].length; node++) {
                this.myMat[layer][0][node] = math.dot(this.myMat[layer - 1][0], this.myMat[layer][1][node]) + this.myMat[layer][2][node];
            }
            // activation
            this.myNormalizer.normalizeCol(this.myMat[layer][0]);
        }

        // console.log("Brain output:");
        // console.log(this.myMat[this.myMat.length - 1][0]);

        // output
        return this.getOutput(this.myMat[this.myMat.length - 1][0]);
    }

    // called in snake.js to update the brain with the length of the inputs
    updateWithInput(input){
        if(this.hasValues){
            // console.log(`Warning: updateWithInput called on brain with values already, ignoring new input`);
            return;
        }

        this.myInputWidth = input.inputLength;

        // update network
        for (let node = 0; node < this.myWidth; node++) {
            this.myMat[0][1][node] = Array.apply(null, {length: this.myInputWidth});
            for (let source = 0; source < this.myMat[0][1][node].length; source++) {
                this.myMat[0][1][node][source] = 0;
            }
        }

        // init random
        if(!this.hasValues){
            this.initRandom();
        }
    }
    // helper function, selects a random weight/bias from a brain
    selectRandom(){
        // select a random weight
        // since its a non-square array this is going to weird
        let total = 0;
        // thresholds[i] = the number of elements in layer i
        let thresholds = Array.apply(null, {length: this.myMat.length});
        for (let i = 0; i < this.myMat.length; i++) {
            /*  I'm here for clarity, please don't delete me
            let sum = 0;

            // number of unique weights: #nodes * #nodesPrev
            sum += this.myMat[i].length * ((i === 0) ? (this.myInputWidth) : (this.myMat[i-1].length));

            // number of unique biases: #nodes
            sum += this.myMat[i].length;

            thresholds[i] = sum;
            */
            thresholds[i] = this.myMat[i][0].length * (1 + ((i === 0) ? (this.myInputWidth) : (this.myMat[i-1][0].length)));
            total += thresholds[i];
        }
        // console.log(`selectRandom(), thresholds: ${thresholds}`);

        // random number
        let selected = Math.floor(Math.random() * total);
        // console.log(`selectRandom(), selected: ${selected}`);

        // deconstruct into correct indexes
        let sLayer, sType, sNode, sJ;

        // get the correct layer
        for (let layer = 0; layer < this.myMat.length; layer++) {
            // use the thresholds
            if(selected >= thresholds[layer]){
                selected -= thresholds[layer];
                continue;
            }

            // correct layer
            else{
                sLayer = layer;
                let prevW = ((layer === 0) ? (this.myInputWidth) : (this.myMat[layer-1][0].length));
                let w = this.myMat[layer][0].length;

                // weights
                if(selected < prevW * w){
                    sType = 1;

                    sNode = Math.floor(selected / prevW);
                    sJ = selected % prevW;
                }

                // biases
                else{
                    sType = 2;
                    sNode = selected - (prevW * w);
                }

                break;
            }
        }

        return [sLayer, sType, sNode, sJ];
    }
    // override clone method
    cloneMe() {
        let clone = new NeuralNetBrain(this.myNormalizer.cloneMe(), this.myDepth, this.myWidth, this.startWeight, this.startBias);

        // console.log(`this.myMat: ${this.myMat}`);
        // console.log("stringifyied: " + JSON.stringify(this.myMat));

        // deepcopy everything
        clone.myMat = JSON.parse(JSON.stringify(this.myMat));
        clone.hasValues = this.hasValues;
        clone.myInputWidth = this.myInputWidth;

        // console.log("brain clone:");
        // console.log(clone);

        // if(!(clone instanceof NeuralNetBrain)){
        //     console.log("cloned brain not brain...");
        //     console.log(this);
        // }

        return clone;
    }
    // IMPORTANT: loads all the needed parameters given a string
    //  assumes that input size is correct
    //  string:
    //   pure json.stringify
    loadParams(str){
        // json map
        let map = JSON.parse(str);

        // set map
        this.myMat = map.get("matrix");

        // track
        this.hasValues = true;

        console.log("loadParams() called: this.myMat: " + this.myMat);
    }
    // init all values with random numbers
    initRandom(){
        if(this.hasValues){
            console.log("!!! InitRandom called on a this that already had values, overriding... !!!");
            alert("!!! InitRandom called on a brain that already had values, overriding... !!!");
        }

        for (let layer = 0; layer < this.myMat.length; layer++) {
            for (let node = 0; node < this.myMat[layer][0].length; node++) {
                // weights
                for (let source = 0; source < this.myMat[layer][1][node].length; source++) {
                    this.myMat[layer][1][node][source] = this.startWeight/Math.sqrt(this.myMat[layer][0].length);
                }
                
                // bias
                this.myMat[layer][2][node] = this.startBias;
            }
        }

        this.hasValues = true;

        // console.log(`initRandom() success: this.myMat: ${this.myMat}`);
    }
    // save/load methods
    stringify() {
        // problematic stuff
        let tempNormalizer = this.myNormalizer;
        this.myNormalizer = tempNormalizer.stringify();

        let ans = JSON.stringify(this);

        // put it back
        this.myNormalizer = tempNormalizer;
    }
    helperParse(){
        // get normalizer back
        this.myNormalizer = Normalizer.parse(this.myNormalizer);
    }
}
blankBrains.push(new NeuralNetBrain(new TanhNormalizer(), 2, 6, 0.1, 0.1));

const brainPrototypes = [PathBrain.prototype, PlayerControlledBrain.prototype, NeuralNetBrain.prototype];