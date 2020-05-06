// Shell class which simply runs multiple "singleSnakeRunner"'s and returns mean/median score
class SpeciesRunner{
    constructor(snakeIn, numRuns, callback, modeIn = 0) {
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

        // speed constant, control performance by number of speciesRunners
        this.tickRate = 200;
    }
}