// Parent skeleton brain class
// Specifications
//  -Takes in an "input" into method, gets decision (direction) out
//  -Can mutate with many methods, variable parameters
class SnakeBrain extends SnakeComponent{
    constructor(mutateMethod){
        super();
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
}

// Path Brain, snake follows a path infinitely, made for Mother's Day
class PathBrain extends SnakeBrain{
    // path format: array of values
    //  single number: goto that index
    //  array of [r, c]: goto that r, c
    //  negatives: go in one direction until hit next val or wall (not body segments)
    //   -1: north
    //   -2: east
    //   -3: south
    //   -4: west
    constructor(path){
        super(new MutateMethod());

        this.myRawPath = path;
        this.currIdx = 0;

        // decompiled path, turns all [r, c] into actual indexes
        this.myDecompiledPath = null;
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
        if(brainInput.length === 0){
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

// Player controlled snake, basically just parses an array to a direction
class PlayerControlledBrain extends SnakeBrain{
    constructor(){
        // alert("Player Controlled Brain");
        super(new MutateMethod());
        this.brainID = 0;

        this.componentName = "Player Controlled Brain";
        this.componentDescription = "This brain controls the snake based off of key inputs, meant to be used with Player Controlled Input";
    }
    // assumes the input is an array of 0-1
    getDecision(brainInput) {
        if(brainInput == null){
            return 4;
        }
        return this.getOutput(brainInput);
    }
}

// Neural network brain
class NeuralNetBrain extends SnakeBrain{
    constructor(mutateMethod, normalizer, depth, width, startWeight, startBias){
        super(mutateMethod);

        this.componentName = "Basic Neural Network";
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
            this.myMat[0][0][node] = math.dot(brainInput, this.myMat[0][1][node]) + this.myMat[0][2][node];
        }
        // activation
        this.myNormalizer.normalizeCol(this.myMat[0][0]);

        // everything else
        for (let layer = 1; layer < this.myMat.length; layer++) {
            // pre-activation
            for (let node = 0; node < this.myMat[layer][0].length; node++) {
                this.myMat[layer][0][node] = math.dot(this.myMat[layer - 1][0], this.myMat[layer][1][node]) + this.myMat[layer][2][node];
            }
            // activation
            this.myNormalizer.normalizeCol(this.myMat[layer][0]);
        }

        // output
        return this.getOutput(this.myMat[this.myMat.length - 1][0]);
    }

    // called in snake.js to update the brain with the length of the inputs
    updateWithInput(input){
        if(this.hasValues){
            console.log(`Warning: updateWithInput called on brain with values already, ignoring new input`);
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
    }
    // override clone method
    cloneMe() {
        let clone = new NeuralNetBrain(this.mutateMethod.cloneMe(), this.myNormalizer.cloneMe(), this.myDepth, this.myWidth, this.startWeight, this.startBias);

        // copy everything
        for (let layer = 0; layer < this.myMat.length; layer++) {
            // define layer if needed
            if(clone.myMat[layer] === undefined){
                clone.myMat[layer] = Array.apply(null, {length: this.myMat[layer].length});
            }

            for (let type = 0; type < this.myMat[layer].length; type++) {
                // skip unneeded definitions
                if(this.myMat[layer][type] === undefined){
                    continue;
                }

                // define type if needed
                if(clone.myMat[layer][type] === undefined){
                    clone.myMat[layer][type] = Array.apply(null, {length: this.myMat[layer][type].length});
                }

                // weights
                if(type === 1){
                    // loop through nodes
                    for (let node = 0; node < this.myMat[layer][type].length; node++) {
                        // define array if needed
                        if(clone.myMat[layer][type][node] === undefined){
                            clone.myMat[layer][type][node] = Array.apply(0, {length: this.myMat[layer][type][node].length});
                        }

                        // copy values
                        for (let source = 0; source < this.myMat[layer][type][node].length; source++) {
                            clone.myMat[layer][type][node][source] = this.myMat[layer][type][node][source];
                        }
                    }
                }
                // biases and values
                else {
                    for (let node = 0; node < this.myMat[layer][type].length; node++) {
                        clone.myMat[layer][type][node] = this.myMat[layer][type][node];
                    }
                }
            }
        }
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
            console.log("!!! InitRandom called on a brain that already had values, overriding... !!!");
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

        console.log(`initRandom() success: this.myMat: ${this.myMat}`);
    }
}