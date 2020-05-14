// shell which runs several "SpeciesRunner"'s, returning (callback) the score(s) and snake(s)
class SiblingRunner{
    // callback should take a matrix with 2 parameters: the score(s) and snake(s)
    constructor(snakesIn, numReturn, numRuns, callback, scoringFunction, timeoutFunction, modeIn = 0) {
        this.numReturn = numReturn;
        this.myCallback = callback;

        // the runners with the scores
        this.runners = Array.apply(null, {length: snakesIn.length});
        for(let i = 0; i < this.runners.length; i++){
            this.runners[i] = [new SpeciesRunner(snakesIn[i], numRuns, this.callback.bind(this), scoringFunction, timeoutFunction, modeIn), 0];
        }

        this.currIndex = 0;
    }
    start(){
        if(this.currIndex === 0) {
            this.runners[0][0].runNext();
        }
        else{
            console.log("start() called twice on SiblingRunner");
        }
    }
    // callback function
    callback(score){
        this.runners[this.currIndex][1] = score;

        this.currIndex++;
        if(this.currIndex === this.runners.length){
            // finish
            // sort scores
            this.runners.sort(function (a, b) {
                return b[1] - a[1];
            });

            // "return"
            let ans = Array.apply(null, {length: this.numReturn});
            for(let i = 0; i < ans.length; i++){
                ans[i] = [this.runners[i][0].origSnake, this.runners[i][1]];
            }
            this.myCallback(ans);
        }
        else{
            this.runners[this.currIndex][0].runNext();
        }
    }
}