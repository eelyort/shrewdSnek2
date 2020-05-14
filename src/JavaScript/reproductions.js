// similar to mutations.js, this deals with taking two "parents" and produces "offspring"
//  works off of brains
class Reproduction extends Component{
    constructor(reproductionParams){
        super();

        // array of the parameters: this.mutationParameters[i] is the i-th parameter
        //  second dimension is: [0]-name, [1]-value, [2]-description
        this.reproductionParameters = reproductionParams;

        this.componentName = "Empty Reproduction";
    }
    // produces offspring given two parents
    produceOffspring(parent1Brain, parent2Brain){
        return [parent1Brain.cloneMe(), parent2Brain.cloneMe()];
    }
    // sets parameters
    setParams(){
        if(arguments.length !== this.mutationParameters.length){
            console.log("Reproduction setParams() argument length mismatch");
        }

        for (let i = 0; i < arguments.length; i++) {
            this.reproductionParameters[i][1] = arguments[i];
        }
    }
    // clones this Mutation, object type decays but otherwise all functionality is preserved
    cloneMe(){
        let clone = new Reproduction(null);

        // clone functions
        clone.produceOffspring = this.produceOffspring;

        // clone name and description
        clone.componentName = this.componentName;
        clone.componentDescription = this.componentDescription;

        // clone params
        // deepcopy array
        clone.reproductionParameters = JSON.parse(JSON.stringify(this.reproductionParameters));

        return clone;
    }
}

// swaps single pairs of weights
class SingleWeightSwapReproduction extends Reproduction{
    constructor(){
        super([
            ["Number of Pairs", 1, "The number of pairs of weights/biases to swap among the parents."]
        ]);
        
        // name
        this.componentName = "Multiple Swap Reproduction";
        this.componentDescription = "This swaps a number of the weights/biases of the two parents to produce 2 offspring, 1 of which will survive";
    }
    // assumes brains have same topology
    produceOffspring(parent1Brain, parent2Brain) {
        // children
        let child1Brain = parent1Brain.cloneMe();
        let child2Brain = parent2Brain.cloneMe();

        // swap
        for (let i = 0; i < this.reproductionParameters[0][1]; i++) {
            // get random weight
            let select = child1Brain.selectRandom();
            let sLayer = select[0];
            let sType = select[1];
            let sNode = select[2];
            let sJ = select[3];

            // swap
            // weights
            if(sType === 1) {
                let temp = child1Brain.myMat[sLayer][sType][sNode][sJ];
                child1Brain.myMat[sLayer][sType][sNode][sJ] = child2Brain.myMat[sLayer][sType][sNode][sJ];
                child2Brain.myMat[sLayer][sType][sNode][sJ] = temp;
            }
            // biases
            else{
                let temp = child1Brain.myMat[sLayer][sType][sNode];
                child1Brain.myMat[sLayer][sType][sNode] = child2Brain.myMat[sLayer][sType][sNode];
                child2Brain = temp;
            }
        }

        return [child1Brain, child2Brain];
    }
}

// swaps all the weights and biases of x nodes
class NodeSwapReproduction extends Reproduction{
    constructor(){
        super([
            ["Number of Swaps", 1, "Number of nodes to swap the weights/biases of."]
        ]);
        
        this.componentName = "Node Swap Reproduction";
        this.componentDescription = "This swaps all the weights and biases for x nodes.";
    }
    // assumes brains have the same topology
    produceOffspring(parent1Brain, parent2Brain) {
        // children
        let child1Brain = parent1Brain.cloneMe();
        let child2Brain = parent2Brain.cloneMe();

        // swaps
        for (let i = 0; i < this.reproductionParameters[0][1]; i++) {
            // select random node
            let select = child1Brain.selectRandom();
            let sLayer = select[0];
            let sNode = select[2];

            // swap
            // weights
            let temp = JSON.stringify(child1Brain.myMat[sLayer][1][sNode]);
            child1Brain.myMat[sLayer][1][sNode] = JSON.parse(JSON.stringify(child2Brain.myMat[sLayer][1][sNode]));
            child2Brain.myMat[sLayer][1][sNode] = JSON.parse(temp);
            // bias
            temp = child1Brain.myMat[sLayer][2][sNode];
            child1Brain.myMat[sLayer][2][sNode] = child2Brain.myMat[sLayer][2][sNode];
            child2Brain.myMat[sLayer][2][sNode] = temp;
        }

        return [child1Brain, child2Brain];
    }
}

// swaps an entire layer of weights/biases
class LayerSwapReproduction extends Reproduction{
    constructor(){
        super([
            ["Number of Swaps", 1, "Number of layers to swap the weights/biases of."]
        ]);

        this.componentName = "Layer Swap Reproduction";
        this.componentDescription = "This swaps all the weights/biases for x layers. Only recommended on networks with many layers";
    }
    // assumes brains have the same topology
    produceOffspring(parent1Brain, parent2Brain) {
        // children
        let child1Brain = parent1Brain.cloneMe();
        let child2Brain = parent2Brain.cloneMe();

        // swaps
        for (let i = 0; i < this.reproductionParameters[0][1]; i++) {
            // pick random layer
            let sLayer = Math.floor(Math.random() * child1Brain.myMat.length);

            // swap
            let temp = JSON.stringify(child1Brain.myMat[sLayer]);
            child1Brain.myMat[sLayer] = JSON.parse(JSON.stringify(child2Brain.myMat[sLayer]));
            child2Brain.myMat[sLayer] = JSON.parse(temp);
        }

        return [child1Brain, child2Brain];
    }
}