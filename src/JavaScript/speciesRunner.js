// Shell class which simply runs multiple "singleSnakeRunner"'s and returns mean/median score
class SpeciesRunner{
    // callback should take a single parameter, the score
    constructor(snakeIn, numRuns, callback, scoringFunction, modeIn = 0) {
        this.origSnake = snakeIn;
        this.myCallback = callback;

        // number of times this snake should be run
        this.numRuns = numRuns;

        // 0 - median, 1 - mean
        this.myMode = modeIn;

        // array of the scores each run got
        this.scores = Array.apply(null, {length: this.numRuns});
        for(let i = 0; i < this.scores.length; i++){
            this.scores[i] = 0;
        }

        // function which is used to find the "score" of the snakes: (score, time)
        this.scoreFunc = scoringFunction;

        // speed constant, control performance by number of speciesRunners
        this.tickRate = speciesRunnerTickRate;

        this.currIndex = 0;
        this.runningInstance = null;

        // TODO: probably better to call this in evolutionRunner or something
        // this.runNext();
    }
    runNext(){
        if(this.currIndex === this.numRuns){
            this.finish();
            return;
        }

        let snek = this.origSnake.cloneMe();
        if(this.runningInstance != null){
            this.runningInstance.kill();
        }
        this.runningInstance = new SingleSnakeRunner(snek, this.tickRate, this.endOne().bind(this));
        this.runningInstance.startMe();
    }
    // callback called whenever an instance finishes
    endOne(){
        // record the score this run got
        this.scores[this.currIndex] = this.scoreFunc(this.runningInstance.mySnake.myLength, this.runningInstance.timeTicks);

        // update index and run next one
        this.currIndex++;
        this.runNext();
    }
    // process scores and return ans
    finish(){
        console.log(`SpeciesRunner finish(), scores: ${this.scores}`);

        let ans = -1;

        // median
        if(this.myMode === 0){
            // sort - pass it a comparator function
            this.scores.sort(function (a, b) {
                return a - b;
            });

            // used multiple times
            let mid = Math.floor(this.scores.length/2);

            // odd number
            if(this.scores.length % 2 == 1){
                ans = this.scores[mid];
            }
            // even
            else{
                ans = (this.scores[mid - 1] + this.scores[mid])/2;
            }
        }
        // mean
        else if(this.myMode === 1){
            let sum = 0;
            for (let i = 0; i < this.scores.length; i++) {
                sum += this.scores[i];
            }
            ans = sum/this.scores.length;
        }
        else{
            console.log(`Unknown Mode in SpeciesRunner: ${this.myMode}`);
        }

        // clean up trash
        if(this.runningInstance != null){
            this.runningInstance.kill();
        }

        // "return"
        console.log("SpeciesRunner finish() returning: " + ans);
        this.myCallback(ans);
    }
}