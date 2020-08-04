let blankMutations = [];

// class which represents a single possible mutation
//  pass it a brain - mutates a random weight/bias/node
//  IMPORTANT: destructive, doesn't make a clone TODO: make clones in evolutionRunner
class Mutation extends Component{
    constructor(id, mutationParameters){
        super(id);

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
    // given a brain mutates it
    mutateBrain(brain){
        // select a random weight
        let select = brain.selectRandom();
        let sLayer = select[0];
        let sType = select[1];
        let sNode = select[2];
        let sJ = select[3];

        // console.log(`mutateBrain: select: ${select}`);

        // mutate the weight
        if(sType === 1){
            brain.myMat[sLayer][sType][sNode][sJ] = this.mutateSingle(brain.myMat[sLayer][sType][sNode][sJ]);
        }
        else{
            brain.myMat[sLayer][sType][sNode] = this.mutateSingle(brain.myMat[sLayer][sType][sNode]);
        }
    }
    // given a value, returns a mutated version of that same value
    mutateSingle(valIn){
        console.log("WARNING: EFFECT-LESS BASIC MUTATION CALLED");
        return valIn;
    }
    // clones this Mutation, object type decays but otherwise all functionality is preserved
    cloneMe(){
        let clone = new Mutation(null);
        
        // clone functions
        clone.mutateSingle = this.mutateSingle;
        clone.mutateBrain = this.mutateBrain;
        
        // clone name and description
        this.cloneComponents(clone);
        
        // clone params
        clone.mutationParameters = JSON.parse(JSON.stringify(this.mutationParameters));

        return clone;
    }
    static parse(str){
        return super.parse(str, blankMutations);
    }
}

// scales the value by a percentage
class PercentMutation extends Mutation{
    constructor(){
        super(0, [
            ["Minimum", 0.4, "The minimum scalar the weight can be multiplied by.", 0, 1, 0.1],
            ["Maximum", 1.6, "The maximum scalar the weight can be multiplied by.", 1, 10, 0.1]
        ]);

        this.componentName = "Percent Mutation";
        this.componentDescription = "Scales the weight by some percentage.";
    }
    mutateSingle(valIn) {
        let max = this.mutationParameters[1][1];
        let min = this.mutationParameters[0][1];
        let ran = (Math.random() * (max - min)) + min;

        // console.log(`PercentMutate, ran: ${ran}`);

        return valIn * ran;
    }
}
blankMutations.push(new PercentMutation());

// replaces the weight with a random value
class ReplaceMutation extends Mutation{
    constructor(){
        super(1, [
            ["Minimum", -1, "The minimum scalar the weight can be changed to.", -100, 0, 0.5],
            ["Maximum", 1, "The maximum scalar the weight can be changed to.", 0, 100, 0.5]
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
blankMutations.push(new ReplaceMutation());

// adds a random number
class AddMutation extends Mutation{
    constructor(){
        super(2, [
            ["Minimum", -0.5, "The minimum scalar added to the weight.", -100, 0, 0.5],
            ["Maximum", 0.5, "The maximum scalar added to the weight.", 0, 100, 0.5]
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
blankMutations.push(new AddMutation());

// changes the sign of the weight
class NegateMutation extends Mutation{
    constructor(){
        super(3, []);

        this.componentName = "Negation Mutation";
        this.componentDescription = "This changes the sign of the selected weight";
    }
    mutateSingle(valIn) {
        return -valIn;
    }
}
blankMutations.push(new NegateMutation());

// swaps x pairs of the weights on the currently selected node
class SwapMutation extends Mutation{
    constructor() {
        super(4, [
            ["Number Pairs", 1, "The number of pairs of weight on the selected node to swap", 0, 200],
            ["Include Biases", false, "Whether to allow bias swapping, this is not recommended because bias and weights are typically different.", [true, false]]
        ]);

        this.componentName = "Swap Mutation";
        this.componentDescription = "This swaps some of the weights on the selected node.";
    }
    mutateBrain(brain) {
        let numPairs = this.mutationParameters[0][1];
        let swapBias = this.mutationParameters[1][1];

        // randomly select the node
        let select = brain.selectRandom();
        let sLayer = select[0];
        let wLastLayer = ((sLayer === 0) ? (brain.myInputWidth) : (brain.myMat[sLayer-1][0].length));
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
                    type1 = 1;
                    j1 = ran1;
                }
                // bias
                else {
                    type1 = 2;
                }

                // second one
                let type2, j2;
                let ran2 = Math.floor(Math.random() * (wLastLayer + 1));
                // weight
                if (ran2 < wLastLayer) {
                    type2 = 1;
                    j2 = ran2;
                }
                // bias
                else {
                    type2 = 2;
                }

                // swap the two
                let temp = ((type1 === 1) ? (brain.myMat[sLayer][type1][sNode][j1]) : (brain.myMat[sLayer][type2][sNode]));
                if(type1 === 1){
                    brain.myMat[sLayer][type1][sNode][j1] = ((type2 === 1) ? (brain.myMat[sLayer][type2][sNode][j2]) : (brain.myMat[sLayer][type2][sNode]));
                }
                else{
                    brain.myMat[sLayer][type1][sNode] = ((type2 === 1) ? (brain.myMat[sLayer][type2][sNode][j2]) : (brain.myMat[sLayer][type2][sNode]));
                }
                if(type2 === 1){
                    brain.myMat[sLayer][type2][sNode][j2] = temp;
                }
                else{
                    brain.myMat[sLayer][type2][sNode] = temp;
                }
            }

            // only swap weights
            else{
                // choose 2 random weights
                let j1 = Math.floor(Math.random() * wLastLayer);
                let j2 = Math.floor(Math.random() * wLastLayer);

                // swap the two
                let temp = brain.myMat[sLayer][1][sNode][j1];
                brain.myMat[sLayer][1][sNode][j1] = brain.myMat[sLayer][1][sNode][j2];
                brain.myMat[sLayer][1][sNode][j2] = temp;
            }
        }
    }
}
blankMutations.push(new SwapMutation());