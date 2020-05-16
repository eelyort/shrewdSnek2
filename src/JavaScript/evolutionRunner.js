const numRunVars = 3;

// "main" class for running evolutions
// all logic should be in this class
// start/actions should be called from outside, no ui on this layer
class Evolution{
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
    constructor(snakes, snakeScores = null){
        this.parameters = null;
        this.setParams();

        this.generationNumber = 0;

        // this stores the snakes in the current generation, it should always be ONLY snake objects
        //  each i: [snake, index]
        this.currentGeneration = Array.apply(null, {length: snakes.length});
        for(let i = 0; i < this.currentGeneration.length; i++){
            this.currentGeneration[i] = [snakes[i], 1];
        }

        // the snakes of the next generation, will be run on next run call
        this.nextGeneration = null;
    }
    setParams(){
        // defaults
        if(arguments.length === 0 && this.parameters == null){
            console.log("Evolution setParams called with no arguments, adding default values");
            this.parameters = [
                ["Number of Snakes", 500, "The number of snakes in each generation."],
                ["Reproductions", [[new SingleWeightSwapReproduction(), 1], [new NodeSwapReproduction(), 1]], "The methods whereby two parents will produce offspring and their relative probabilities."],
                ["Mutations", [[new PercentMutation(), 1], [new ReplaceMutation(), 1], [new AddMutation(), 1], [new NegateMutation(), 1]], "The possible methods by which the snakes will be changed and their relative probabilities."],
                ["Likely-hood Mutations", 1, "How likely a parent is to mutate, values above 1 translate to 1 mutation + x probability of a second."],
                ["Number of Runs", 5, "The number of times each specific snake is run, this helps to reduce evolution by luck. Otherwise, especially in the first few generations, snake will survive simply because an apple happened to spawn in their path."],
                ["Mode Normalization", 0, "Related to the above, this is how the actual score is selected from the scores above. 0-median, 1-mean"],
                ["Ticks per Apple Score", 50, "The amount of ticks a snake must survive to get the same score as they would from eating an apple."],
                ["Max Time Score", 0.999, "The max score (in apples) a snake can get by surviving and not eating apples."],
                ["Ticks till Time Out", 100, "The amount of ticks a snake can survive without eating any apples, if it goes past this number it dies."],
                ["Ticks till Time Out Growth", 10, "The amount of ticks added to the above per length, at longer lengths it makes sense that it takes longer to get the apple."],
                ["Percentage Survive", 0.05, "The percentage of each generation that will survive and compete in the next generation unchanged."],
                ["Percentage Parents", 0.2, "The percentage of each generation that lives long enough to give birth to children."],
                ["Parent Selection Shape", 0.8, "The selection of parents is done with an exponential trend, (this)^(x/sqrt(numParents)). Decreasing this number makes the most successful snake be selected as a parent more often. It is clamped to (0, 2]"]
            ];
        }

        // mismatch
        else if(arguments.length && arguments.length !== this.parameters.length){
            console.log("Warning, Evolution setParams() called with incorrect number of arguments, exiting");
            return;
        }

        // set arguments
        else{
            for (let i = 0; i < arguments.length; i++) {
                this.parameters[i][1] = arguments[i];
            }
        }

        // analyze/simplify elements
        // reproductions
        let reprod = this.parameters[1][1];
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
        let mutate = this.parameters[2][1];
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

        // clamp shape to (0, 2]
        this.parameters[12][1] = Math.max(this.parameters[12][1], 0.00001);
        this.parameters[12][1] = Math.min(this.parameters[12][1], 2);

        // scoring function
        this.scoreFunc = function (score, timeSinceLastApple) {
            return score + Math.min(timeSinceLastApple / this.parameters[6][1], this.parameters[7][1]);
        };

        // timeout function
        this.timeOutFunc = function (len) {
            return this.parameters[8][1] + len * this.parameters[9][1];
        };
        
        // stores the same as runningVars[0], but is synchronous, use ONLY FOR DISPLAY
        this.runningProgress = 0;

        // the (temporary) variables in use when a generation is running
        this.runningResults = null;
        // index (of the next snake to be started), number running, number finished
        this.runningBuffer = new SharedArrayBuffer(Uint16Array.BYTES_PER_ELEMENT * numRunVars);
        this.runningVars = new Uint16Array(this.runningBuffer);
        this.runningVars = [0, 0, 0];
    }

    // creates the next generation from the current generation and its scores
    //  handles the mutations, reproductions, and whatnot
    createNextGeneration(){
        let numPerGen = this.parameters[0][1];

        // create next gen
        this.nextGeneration = Array.apply(null, {length: numPerGen});
        for(let i = 0; i < this.nextGeneration.length; i++){
            this.nextGeneration[i] = null;
        }


        // edge case: first generation
        if(this.currentGeneration.length === 1){
            console.log("createNextGeneration() spawning mutated clones due to only one input snake");

            // input snake
            let originator = this.currentGeneration[0].cloneMe();

            // create the next generation with a bunch of mutated versions of the originator snake
            this.nextGeneration = Array.apply(null, {length: numPerGen});
            for(let i = 0; i < this.nextGeneration.length; i++){

                let snake = originator.cloneMe();

                // mutate the snake a bunch of times
                for (let j = 0; j < 100; j++) {
                    this.mutatePrivate(snake);
                }

                this.nextGeneration[i] = new SpeciesRunner(snake, this.parameters[4][1], this.myCallback.bind(this), this.scoreFunc.bind(this), this.timeOutFunc.bind(this), this.parameters[5][1]);
                // this.nextGeneration[i] = snake;
            }

            return;
        }

        // regular
        // number of snakes in next generation
        let idx = 0;

        // the best snakes survive and continue on into the next generation unchanged
        let numSurvive = Math.floor(numPerGen * this.parameters[10][1]);
        for (; idx < numSurvive; idx++) {
            this.nextGeneration[idx] = new SpeciesRunner(this.currentGeneration[idx][0].cloneMe(), this.parameters[4][1], this.myCallback.bind(this), this.scoreFunc.bind(this), this.timeOutFunc.bind(this), this.parameters[5][1]);
            // this.nextGeneration[idx] = this.currentGeneration[idx][0].cloneMe();
        }

        // get the proportions of which snakes should be chosen as parents by their scores
        //  the function here is: arg12^x
        let shapeParam = this.parameters[12][1];
        let numParents = Math.floor(numPerGen * this.parameters[11][1]);
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
            let mutateLikelyHood = this.parameters[3][1];
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
            this.nextGeneration[idx] = new SiblingRunner(offspring, 1, this.parameters[4][1], this.myCallback.bind(this), this.scoreFunc.bind(this), this.timeOutFunc.bind(this), this.parameters[5][1]);
            // this.nextGeneration[idx] = offspring;

            idx++;
        }
    }

    // --------------------------- Running Generation Methods ----------------------------------------------------------
    // main method to run a generation, call from outside
    runGeneration(){
        // set parameters
        this.runningProgress = 0;
        this.runningResults = Array.apply(null, {length: this.parameters[0][1]});
        for(let i = 0; i < this.runningResults.length; i++){
            this.runningResults[i] = null;
        }
        for (let i = 0; i < numRunVars; i++) {
            this.runningVars[i] = 0;
        }

        // start the generation
        this.generationNumber++;
        this.myInterval = setInterval(this.update.bind(this), 1000 / evolutionUpdatePerSec);
    }
    
    // function called every once in a while, begins new snakes when needed, updates visible parameters
    update(){
        // update progress
        this.runningProgress = Atomics.load(this.runningVars, 0);
        
        // finished
        if(Atomics.load(this.runningVars, 2) === this.parameters[0][1] - 1){
            this.finish();
            
            return;
        }
        
        // start new snakes - async so it doesn't freeze the screen
        setTimeout(function () {
            while(Atomics.load(this.runningVars, 1) < maxNumThreads){
                this.startNextPrivate();
            }
        }.bind(this), 1);
    }

    // called to end and process
    finish(){
        // TODO
        // stop the update clock
        if(this.myInterval){
            clearInterval(this.myInterval);
        }

        // sort
        this.runningResults.sort(function (a, b) {
            return b[1] - a[1];
        });

        // delete and TODO save? last generation
        console.log(`Old generation being deleted at EvolutionRunner finish(), old gen: ${JSON.stringify(this.currentGeneration)}`);
        this.currentGeneration = this.runningResults;
    }

    // starts the next one
    startNextPrivate(){
        let idx = Atomics.load(this.runningVars, 0);
        let runner = this.nextGeneration[idx];
        // species runner
        if(runner instanceof SpeciesRunner){
            let old = Atomics.add(this.runningVars, 0, 1);
            // test to make sure the same snake isn't run multiple times
            if(old !== idx){
                Atomics.sub(this.runningVars, 0, 1);
            }
            else{
                runner.runNext();
            }
        }
        // sibling runner
        else{
            let num = runner.numReturn;
            let old = Atomics.add(this.runningVars, 0, num);
            // test to make sure the same snake isn't run multiple times
            if(old !== idx){
                Atomics.sub(this.runningVars, 0, num);
            }
            else{
                runner.start();
            }
        }
    }

    // callback method
    myCallback(index, snakeScoresMatrix){
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
        let numFinished = origIndex - index;
        // number running
        Atomics.sub(this.runningVars, 1, numFinished);
        // number finished
        Atomics.add(this.runningVars, 2, numFinished);
    }

    // mutates a single snake - assumes mutatePercents is done already
    mutatePrivate(snake){
        // choose a random method
        let selected;

        // special case where probabilities are equal
        if(!this.mutationPercents){
            selected = Math.floor(Math.random() * this.parameters[2][1].length);
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
        this.parameters[2][1][selected][0].mutateBrain(snake.myBrain);
    }

    // takes two offspring, chooses a random reproduction method and returns an array of offspring
    reproducePrivate(snake1, snake2){
        // choose a random method
        let selected;

        // special case where probabilities are equal
        if(!this.reproductionPercents){
            selected = Math.floor(Math.random() * this.parameters[1][1].length);
        }
        // unequal probabilities, significantly slower
        else {
            let ran = Math.random();
            for (selected = 0; selected < this.reproductionPercents.length; selected++) {
                if (ran < this.mutationPercents[selected]) {
                    break;
                }
                ran -= this.mutationPercents[selected];
            }
        }

        // reproduce by that method
        return this.parameters[1][1][selected][0].produceOffspring(snake1, snake2);
    }
}