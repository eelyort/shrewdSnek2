const numRunVars = 3;

// name, val, description, min, max, step
const defaultEvolutionParams = [
    ["Number of Snakes", 1600, "The number of snakes in each generation.", 10, 25000, 50],
    ["Reproductions", [[new SingleWeightSwapReproduction(), 1], [new NodeSwapReproduction(), 1]], "The methods whereby two parents will produce offspring and their relative probabilities."],
    ["Mutations", [[new PercentMutation(), 1], [new ReplaceMutation(), 1], [new AddMutation(), 1], [new NegateMutation(), 1]], "The possible methods by which the snakes will be changed and their relative probabilities."],
    ["Likely-hood Mutations", 3, "How likely a parent is to mutate, values above 1 translate to 1 mutation + x probability of a second.", 0, 5000, 0.1],
    ["Number of Runs", 3, "The number of times each specific snake is run, this helps to reduce evolution by luck. Otherwise, especially in the first few generations, snake will survive simply because an apple happened to spawn in their path.", 1, 13],
    ["Mode Normalization", 0, "Related to the above, this is how the actual score is selected from the scores above."],
    ["Ticks per Apple Score", 50, "The amount of ticks a snake must survive to get the same score as they would from eating an apple.", 1, 999999, 5],
    ["Max Time Score", 1, "The max score (in apples) a snake can get by surviving and not eating apples.", 0, 1000],
    ["Ticks till Time Out", 200, "The amount of ticks a snake can survive without eating any apples, if it goes past this number it dies.", 1, 999999, 10],
    ["Ticks till Time Out Growth", 30, "The amount of ticks added to the above per length, at longer lengths it makes sense that it takes longer to get the apple.", 0, 1000],
    ["Percentage Survive", 0.02, "The percentage of each generation that will survive and compete in the next generation unchanged.", 0, 1, 0.02],
    ["Percentage Parents", 0.2, "The percentage of each generation that lives long enough to give birth to children.", 0, 1, 0.02],
    ["Parent Selection Shape", 0.78, "The selection of parents is done with an exponential trend, (this)^(x/sqrt(numParents)). Decreasing this number makes the most successful snake be selected as a parent more often.", 0.001, 2, 0.01]
];

// "main" class for running evolutions
// all logic should be in this class
// start/actions should be called from outside, no ui on this layer
class Evolution extends Component{
    // Parameters
    //  snakes has the snakes or snake to run in this evolution
    //  reproductions has an array of reproductions to use, along with the probabilities of each
    //  mutations is like above but for mutations
    //  likelyhood mutation is the chance of a mutation
    //   0.5 gives 50% probability
    //   1.5 gives 1 mutation for sure, 50% for a second mutation
    //  numRuns is the amount of times to run each snake
    //  modeIn is the way any given snake's runs are normalized
    //  score function
    //   ticks per apple - the number of ticks a snake must survive to gain the same amount of points as an apple
    //   max time score - a percentage of how many apple's scores a snake can potentially gain for time
    //  timeouttime - the number of ticks a snake can go without eating an apple before being killed
    //   timeoutgrowth - amount of ticks added to timeouttime per length
    constructor(snakes, callback = null){
        super(0, `Evolution`, "Evolution");

        this.parameters = null;
        this.setParams();

        this.myCallback2 = callback;

        this.generationNumber = 0;

        // best, mean, median
        this.statistics = [];

        if(Array.isArray(snakes)) {
            // this stores the snakes in the current generation, it should always be ONLY snake objects
            //  each i: [snake, index]
            this.currentGeneration = Array.apply(null, {length: snakes.length});
            for (let i = 0; i < this.currentGeneration.length; i++) {
                this.currentGeneration[i] = [snakes[i], 1];
            }
        }
        else{
            this.currentGeneration = [[snakes, 1]];
        }

        // the snakes of the next generation, will be run on next run call
        this.nextGeneration = null;
    }
    setDefaultName(){
        if(this.currentGeneration[0][1]){
            this.componentName = `Evolution: ${this.currentGeneration[0][1].getComponentName()}`;
            this.componentDescription = `Evolution of the snake \"${this.currentGeneration[0][1].getComponentName()}\"`;
        }
    }
    setParams(){
        // defaults
        if(arguments.length === 0 && this.parameters == null){
            // console.log("Evolution setParams called with no arguments, adding default values");
            this.parameters = defaultEvolutionParams.map((arr, i) => arr[1]);
        }

        // mismatch
        else if(arguments.length && arguments.length !== this.parameters.length){
            // console.log("Warning, Evolution setParams() called with incorrect number of arguments, exiting");
            return false;
        }

        // set arguments
        else{
            for (let i = 0; i < arguments.length; i++) {
                this.parameters[i] = arguments[i];
            }
        }

        // analyze/simplify elements
        // max time score
        this.parameters[7] = this.parameters[7]-0.0001;

        // clamp
        this.parameters = this.parameters.map((val, i) => {
            if(defaultEvolutionParams[i].length >= 5 && !isNaN(val)){
                const [n, v, d, min, max] = defaultEvolutionParams[i];
                return Math.min(max, Math.max(min, val));
            }
            return val;
        });

        // reproductions
        let reprod = this.parameters[1];
        let bool = true;
        let tot = 0;
        for (let i = 0; i < reprod.length; i++) {
            tot += reprod[i][1];
            if(reprod[0] !== reprod[i]){
                bool = false;
            }
        }
        // case where probabilities are equal
        if(bool){
            this.reproductionPercents = null;
        }
        // probabilities inequal
        else {
            this.reproductionPercents = Array.apply(null, {length: reprod.length});
            for (let i = 0; i < this.reproductionPercents.length; i++) {
                this.reproductionPercents[i] = reprod[i][1] / tot;
            }
        }

        // mutations
        let mutate = this.parameters[2];
        bool = true;
        tot = 0;
        for (let i = 0; i < mutate.length; i++) {
            tot += mutate[i][1];
            if(mutate[i] !== mutate[0]){
                bool = false;
            }
        }
        // special case where probabilities are equal
        if(bool) {
            this.mutationPercents = null;
        }
        else {
            this.mutationPercents = Array.apply(null, {length: mutate.length});
            for (let i = 0; i < this.mutationPercents.length; i++) {
                this.mutationPercents[i] = mutate[i][1] / tot;
            }
        }

        // scoring function
        this.scoreFunc = function (score, timeSinceLastApple, appleVal) {
            return score + Math.min(timeSinceLastApple / this.parameters[6], this.parameters[7]) * appleVal;
        };

        // timeout function
        this.timeOutFunc = function (len) {
            return this.parameters[8] + len * this.parameters[9];
        };

        // stores the same as runningVars[0], but is synchronous, use ONLY FOR DISPLAY
        this.runningProgress = 0;

        // the (temporary) variables in use when a generation is running
        this.runningResults = null;
        // index (of the next snake to be started), number running, number finished
        this.runningBuffer = new SharedArrayBuffer(Int16Array.BYTES_PER_ELEMENT * numRunVars);
        this.runningVars = new Int16Array(this.runningBuffer);

        return true;
    }

    // creates the next generation from the current generation and its scores
    //  handles the mutations, reproductions, and whatnot
    createNextGeneration(){
        let numPerGen = this.parameters[0];

        // create next gen
        this.nextGeneration = Array.apply(null, {length: numPerGen});
        for(let i = 0; i < this.nextGeneration.length; i++){
            this.nextGeneration[i] = null;
        }

        // edge case: first generation
        if(this.currentGeneration.length === 1){
            // console.log("createNextGeneration() spawning mutated clones due to only one input snake");

            // input snake
            let originator = this.currentGeneration[0][0].cloneMe();

            if(!originator.myBrain.hasValues){
                originator.myBrain.initRandom();
            }

            let numMutations = originator.myBrain.myDepth * originator.myBrain.myWidth * 50;

            this.nextGeneration = Array.apply(null, {length: numPerGen});

            // have one snake of just the original un-cloned
            this.nextGeneration[0] = new SpeciesRunner(originator.cloneMe(), this.parameters[4], this.myCallback.bind(this), this.scoreFunc.bind(this), this.timeOutFunc.bind(this), this.parameters[5][1], 0);

            // create the next generation with a bunch of mutated versions of the originator snake
            for(let i = 1; i < this.nextGeneration.length; i++){

                let snake = originator.cloneMe();

                // mutate the snake a bunch of times
                for (let j = 0; j < numMutations; j++) {
                    this.mutatePrivate(snake);
                }

                this.nextGeneration[i] = new SpeciesRunner(snake, this.parameters[4], this.myCallback.bind(this), this.scoreFunc.bind(this), this.timeOutFunc.bind(this), this.parameters[5][1], i);
                // this.nextGeneration[i] = snake;
            }

            // console.log(this.nextGeneration);

            return;
        }

        // regular
        // console.log("Regular Create Next Generation:");
        // number of snakes in next generation
        let idx = 0;

        // the best snakes survive and continue on into the next generation unchanged
        let numSurvive = Math.floor(numPerGen * this.parameters[10]);
        for (; idx < numSurvive; idx++) {
            this.nextGeneration[idx] = new SpeciesRunner(this.currentGeneration[idx][0].cloneMe(), this.parameters[4], this.myCallback.bind(this), this.scoreFunc.bind(this), this.timeOutFunc.bind(this), this.parameters[5][1], idx);
            // this.nextGeneration[idx] = this.currentGeneration[idx][0].cloneMe();
        }
        // console.log(`numSurvive: ${numSurvive}, idx: ${idx}`);

        // get the proportions of which snakes should be chosen as parents by their scores
        //  the function here is: arg12^x
        let shapeParam = this.parameters[12];
        let numParents = Math.min(Math.max(2, Math.floor(numPerGen * this.parameters[11])), numPerGen);
        let f = function (x) {
            return Math.pow(shapeParam, x/Math.sqrt(numParents));
        };
        let fI = function (x) {
            return (Math.log(x)/Math.log(shapeParam)) * Math.sqrt(numParents);
        };
        let min = Math.min(f(0), f(numParents));
        let max = Math.max(f(0), f(numParents));
        let pickRanParent = function () {
            return Math.floor(fI((Math.random() * (max-min)) + min));
        };

        // pick parents, clone, mutate, make offspring until next generation is filled
        while(idx < numPerGen){
            // pick and clone parents
            let p1 = this.currentGeneration[pickRanParent()][0].cloneMe();
            let p2 = this.currentGeneration[pickRanParent()][0].cloneMe();

            // mutate them
            let mutateLikelyHood = this.parameters[3];
            // guaranteed mutations
            if(mutateLikelyHood >= 1){
                for (let i = 0; i < Math.floor(mutateLikelyHood); i++) {
                    this.mutatePrivate(p1);
                    this.mutatePrivate(p2);
                }
            }
            // possible extra mutation
            if(Math.random() < mutateLikelyHood % 1){
                this.mutatePrivate(p1);
                this.mutatePrivate(p2);
            }

            // create offspring
            let offspring = this.reproducePrivate(p1, p2);

            // chuck the offspring into a siblingRunner for next generation
            this.nextGeneration[idx] = new SiblingRunner(offspring, 1, this.parameters[4], this.myCallback.bind(this), this.scoreFunc.bind(this), this.timeOutFunc.bind(this), this.parameters[5][1], idx);
            // this.nextGeneration[idx] = offspring;

            idx++;
        }

        // console.log(this.nextGeneration);
    }

    // --------------------------- Running Generation Methods ----------------------------------------------------------
    // main method to run a generation, call from outside
    runGeneration(){
        // console.log("runGeneration, nextGeneration: ");
        // console.log(this);
        // console.log(this.nextGeneration);
        // check if ready
        if(!this.nextGeneration){
            console.log("!!!!! Cannot Run Non-Existent Generation !!!!!");
            return;
        }

        // set parameters
        this.runningProgress = 0;
        this.runningResults = Array.apply(null, {length: this.parameters[0]});
        for(let i = 0; i < this.runningResults.length; i++){
            this.runningResults[i] = null;
        }
        // index (of the next snake to be started), number running, number finished
        this.runningVars = new Int16Array(this.runningBuffer);
        for (let i = 0; i < numRunVars; i++) {
            Atomics.store(this.runningVars, i, 0);
        }

        // start the generation
        this.generationNumber++;
        this.myInterval = setInterval(this.update.bind(this), Math.ceil(1000 / evolutionUpdatePerSec));
    }

    // function called every once in a while, begins new snakes when needed, updates visible parameters
    update(){
        // update progress
        this.runningProgress = Atomics.load(this.runningVars, 2);

        // finished
        if(Atomics.load(this.runningVars, 2) >= this.parameters[0]){
            this.finish();

            return;
        }

        // start new snakes - async so it doesn't freeze the screen
        setTimeout(function () {
            while(Atomics.load(this.runningVars, 1) < maxNumThreads){
                if(!this.startNextPrivate()){
                    break;
                }
            }
        }.bind(this), 1);
    }

    // called to end and process
    finish(){
        // stop the update clock
        if(this.myInterval){
            clearInterval(this.myInterval);
        }

        // console.log(`running vars: [${Atomics.load(this.runningVars, 0)}, ${Atomics.load(this.runningVars, 1)}, ${Atomics.load(this.runningVars, 2)}]`);

        // console.log("finish, before sort, results:");
        // console.log(this.runningResults);

        // sort
        this.runningResults.sort(function (a, b) {
            return b[1] - a[1];
        });

        // delete and TODO save? last generation
        // console.log(`Old generation being deleted at EvolutionRunner finish(), old gen: ${JSON.stringify(this.currentGeneration)}`);
        this.currentGeneration = this.runningResults;

        // statistics
        const precision = Math.pow(10, scoreDisplayPrecision);
        const numPerGen = this.parameters[0];
        const even = numPerGen % 2 === 0;
        const half = Math.floor(numPerGen/2);
        let sum = 0;
        let medSum = 0;
        this.currentGeneration.map(((value, index) => {
            sum += value[1];
            if(even && (index === half || index === half-1)){
                medSum += value[1];
            }
            else if(!even && index === half){
                medSum += value[1];
            }
        }));
        const best = this.currentGeneration[0][1];
        const mean = (sum/numPerGen);
        const median = ((even) ? (medSum/2) : (medSum));
        this.statistics.push([best, mean, median]);

        if(this.myCallback2){
            this.myCallback2(this.currentGeneration[0][0]);
        }
    }

    // starts the next one
    startNextPrivate(){
        let idx = Atomics.load(this.runningVars, 0);

        // index (of the next snake to be started), number running, number finished

        // end if no more to do
        if(idx >= this.nextGeneration.length){
            return false;
        }

        let runner = this.nextGeneration[idx];
        // species runner
        if(runner instanceof SpeciesRunner){
            // console.log("speciesRunner");
            let old = Atomics.add(this.runningVars, 0, 1);
            // test to make sure the same snake isn't run multiple times
            if(old !== idx){
                Atomics.sub(this.runningVars, 0, 1);
            }
            else{
                Atomics.add(this.runningVars, 1, 1);
                runner.runNext();
            }
        }
        // sibling runner
        else{
            // console.log("sibling runner");
            // console.log(runner);
            let num = runner.numReturn;
            let old = Atomics.add(this.runningVars, 0, num);
            // test to make sure the same snake isn't run multiple times
            if(old !== idx){
                Atomics.sub(this.runningVars, 0, num);
            }
            else{
                Atomics.add(this.runningVars, 1, runner.runners.length);
                runner.start();
            }
        }

        return true;
    }

    // callback method
    myCallback(index, snakeScoresMatrix){
        // console.log(`callback, index: ${index}, snakeScores: ${snakeScoresMatrix}`);

        let origIndex = index;

        // update the info
        this.runningResults[index] = snakeScoresMatrix[0];
        if(snakeScoresMatrix.length !== 1){
            for (let i = 1; i < snakeScoresMatrix.length; i++) {
                index++;
                this.runningResults[index] = snakeScoresMatrix[i];
            }
        }
        index++;

        // update vars - // index, number running, number finished
        let numFinished = index - origIndex;
        // number running
        Atomics.sub(this.runningVars, 1, 2);
        // number finished
        Atomics.add(this.runningVars, 2, numFinished);
    }

    // mutates a single snake - assumes mutatePercents is done already
    mutatePrivate(snake){
        // choose a random method
        let selected;

        // special case where probabilities are equal
        if(!this.mutationPercents){
            selected = Math.floor(Math.random() * this.parameters[2].length);
        }
        // unequal probabilities, significantly slower
        else {
            let ran = Math.random();
            for (selected = 0; selected < this.mutationPercents.length; selected++) {
                if (ran < this.mutationPercents[selected]) {
                    break;
                }
                ran -= this.mutationPercents[selected];
            }
        }

        // mutate by that method
        this.parameters[2][selected][0].mutateBrain(snake.myBrain);
    }

    // takes two offspring, chooses a random reproduction method and returns an array of offspring
    reproducePrivate(snake1, snake2){
        // choose a random method
        let selected;

        // special case where probabilities are equal
        if(!this.reproductionPercents){
            selected = Math.floor(Math.random() * this.parameters[1].length);
        }
        // unequal probabilities, significantly slower
        else {
            let ran = Math.random();
            for (selected = 0; selected < this.reproductionPercents.length; selected++) {
                if (ran < this.reproductionPercents[selected]) {
                    break;
                }
                ran -= this.reproductionPercents[selected];
            }
        }

        // reproduce by that method
        return this.parameters[1][selected][0].produceOffspring(snake1, snake2);
    }
    cloneMe(){
        let ans = new Evolution(null, null);
        this.cloneComponents(ans);
        ans.setParams.apply(ans, this.parameters.map((val, i) => val));
        ans.generationNumber = this.generationNumber;
        ans.currentGeneration = this.currentGeneration.map(((value, index) => [value[0].cloneMe(), value[1]]));

        return ans;
    }
}