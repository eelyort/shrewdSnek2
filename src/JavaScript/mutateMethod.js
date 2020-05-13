// class which represents a single possible mutation
//  pass it a brain - mutates a random weight/bias/node
class Mutation extends SnakeComponent{
    constructor(mutationParameters){
        super();

        // array of the parameters: this.mutationParameters[i] is the i-th parameter
        //  second dimension is: [0]-name, [1]-value, [2]-description
        this.mutationParameters = mutationParameters;

        this.componentName = "Empty Mutation";
    }
    // sets parameters
    setParams(){
        if(arguments.length !== this.mutationParameters.length){
            console.log("Mutation setParams() argument length mismatch");
        }

        for (let i = 0; i < arguments.length; i++) {
            this.mutationParameters[i][1] = arguments[i];
        }
    }
    // given a value, returns a mutated version of that same value
    mutateSingle(valIn){
        return valIn;
    }
    // helper function, selects a random weight/bias from a brain
    selectRandom(brain){
        let mat = brain.myMat;

        // select a random weight
        // since its a non-square array this is going to weird
        let total = 0;
        // thresholds[i] = the number of elements in layer i
        let thresholds = [];
        for (let i = 0; i < mat.length; i++) {
            /*  I'm here for clarity, please don't delete me
            let sum = 0;

            // number of unique weights: #nodes * #nodesPrev
            sum += mat[i].length * ((i === 0) ? (brain.myInputWidth) : (mat[i-1].length));

            // number of unique biases: #nodes
            sum += mat[i].length;

            thresholds[i] = sum;
            */
            thresholds[i] = mat[i][0].length * (1 + ((i === 0) ? (brain.myInputWidth) : (mat[i-1][0].length)));
            total += thresholds[i];
        }
        let selected = Math.floor(Math.random() * total);

        // deconstruct into correct indexes
        let sLayer, sType, sNode, sJ;

        // get the correct layer
        for (let layer = 0; layer < mat.length; layer++) {
            // use the thresholds
            if(selected < thresholds[layer]){
                selected -= thresholds[layer];
                continue;
            }

            // correct layer
            else{
                sLayer = layer;
                let prevW = ((layer === 0) ? (brain.myInputWidth) : (mat[layer-1][0].length));
                let w = mat[layer][0].length;

                // weights
                if(selected < prevW * w){
                    sType = 1;

                    sNode = selected / prevW;
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
    // given a brain mutates it
    mutateBrain(brain){
        let mat = brain.myMat;

        // select a random weight
        let select = this.selectRandom(brain);
        let sLayer = select[0];
        let sType = select[1];
        let sNode = select[2];
        let sJ = select[3];

        // mutate the weight
        if(sType === 1){
            mat[sLayer][sType][sNode][sJ] = this.mutateSingle(mat[sLayer][sType][sNode][sJ]);
        }
        else{
            mat[sLayer][sType][sNode] = this.mutateSingle(mat[sLayer][sType][sNode]);
        }
    }
    // clones this Mutation, object type decays but otherwise all functionality is preserved
    cloneMe(){
        let clone = new Mutation(null);
        
        // clone functions
        clone.mutateSingle = this.mutateSingle;
        clone.mutateBrain = this.mutateBrain;
        
        // clone name and description
        clone.componentName = this.componentName;
        clone.componentDescription = this.componentDescription;
        
        // clone params
        clone.mutationParameters = Array.apply(null, {length: this.mutationParameters.length});
        // loop through parameters
        for(let i = 0; i < clone.mutationParameters.length; i++){

            // loop through values
            clone.mutationParameters[i] = Array.apply(null, {length: this.mutationParameters[i].length});
            for(let j = 0; j < clone.mutationParameters[j].length; j++){
                clone.mutationParameters[i][j] = this.mutationParameters[i][j];
            }
        }

        return clone;
    }
}

// scales the value by a percentage
class PercentMutation extends Mutation{
    constructor(){
        super([
            ["Minimum", 0, "The minimum scalar the weight can be multiplied by."],
            ["Maximum", 2, "The maximum scalar the weight can be multiplied by."]
        ]);

        this.componentName = "Percent Mutation";
        this.componentDescription = "Scales the weight by some percentage.";
    }
    mutateSingle(valIn) {
        let max = this.mutationParameters[1][1];
        let min = this.mutationParameters[0][1];
        let ran = (Math.random() * (max - min)) + min;

        return valIn * ran;
    }
}

// replaces the weight with a random value
class ReplaceMutation extends Mutation{
    constructor(){
        super([
            ["Minimum", -1, "The minimum scalar the weight can be changed to."],
            ["Maximum", 1, "The maximum scalar the weight can be changed to."]
        ]);

        this.componentName = "Replace Mutation";
        this.componentDescription = "Replaces the current weight with a new random weight.";
    }
    mutateSingle(valIn) {
        let max = this.mutationParameters[1][1];
        let min = this.mutationParameters[0][1];

        return (Math.random() * (max - min)) + min;
    }
}

// adds a random number
class AddMutation extends Mutation{
    constructor(){
        super([
            ["Minimum", -1, "The minimum scalar added to the weight."],
            ["Maximum", 1, "The maximum scalar added to the weight."]
        ]);

        this.componentName = "Addition/Subtraction Mutation";
        this.componentDescription = "Adds a random number to the weight.";
    }
    mutateSingle(valIn) {
        let max = this.mutationParameters[1][1];
        let min = this.mutationParameters[0][1];

        return valIn + ((Math.random() * (max - min)) + min);
    }
}

// changes the sign of the weight
class NegateMutation extends Mutation{
    constructor(){
        super([]);

        this.componentName = "Negation Mutation";
        this.componentDescription = "This changes the sign of the selected weight";
    }
    mutateSingle(valIn) {
        return -valIn;
    }
}

// swaps x pairs of the weights on the currently selected node
class SwapMutation extends Mutation{
    constructor() {
        super([
            ["Number Pairs", 1, "The number of pairs of weight on the selected node to swap"],
            ["Include Biases", false, "Whether to allow bias swapping, this is not recommended because bias and weights are typically different."]
        ]);

        this.componentName = "Swap Mutation";
        this.componentDescription = "This swaps some of the weights on the selected node.";
    }
    mutateBrain(brain) {
        let mat = brain.myMat;
        let numPairs = this.mutationParameters[0][1];
        let swapBias = this.mutationParameters[1][1];

        // randomly select the node
        let select = this.selectRandom(brain);
        let sLayer = select[0];
        let wLastLayer = ((sLayer === 0) ? (brain.myInputWidth) : (mat[sLayer-1][0].length));
        let sNode = select[2];

        // pairs
        for (let i = 0; i < numPairs; i++) {
            // can swap bias
            if(swapBias) {
                // choose 2 random weights
                // first one
                let type1, j1;
                let ran1 = Math.floor(Math.random() * (wLastLayer + 1));
                // weight
                if (ran1 < wLastLayer) {
                    let type1 = 1;
                    let j1 = ran1;
                }
                // bias
                else {
                    let type1 = 2;
                }

                // second one
                let type2, j2;
                let ran2 = Math.floor(Math.random() * (wLastLayer + 1));
                // weight
                if (ran2 < wLastLayer) {
                    let type2 = 1;
                    let j2 = ran2;
                }
                // bias
                else {
                    let type2 = 2;
                }

                // swap the two
                let temp = ((type1 === 1) ? (mat[sLayer][type1][sNode][j1]) : (mat[sLayer][type2][sNode]));
                if(type1 === 1){
                    mat[sLayer][type1][sNode][j1] = ((type2 === 1) ? (mat[sLayer][type2][sNode][j2]) : (mat[sLayer][type2][sNode]));
                }
                else{
                    mat[sLayer][type1][sNode] = ((type2 === 1) ? (mat[sLayer][type2][sNode][j2]) : (mat[sLayer][type2][sNode]));
                }
                if(type2 === 1){
                    mat[sLayer][type2][sNode][j2] = temp;
                }
                else{
                    mat[sLayer][type2][sNode] = temp;
                }
            }

            // only swap weights
            else{
                // choose 2 random weights
                let j1 = Math.floor(Math.random() * wLastLayer);
                let j2 = Math.floor(Math.random() * wLastLayer);

                // swap the two
                let temp = mat[sLayer][1][sNode][j1];
                mat[sLayer][1][sNode][j1] = mat[sLayer][1][sNode][j2];
                mat[sLayer][1][sNode][j2] = temp;
            }
        }
    }
}