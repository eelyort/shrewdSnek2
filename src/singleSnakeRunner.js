class SingleSnakeRunner{
    constructor(snakeIn, gridSize, appleVal, tickRateStart, callback){
        this.mySnake = snakeIn;
        this.gridSize = gridSize;
        this.callBack = callback;

        // grid is 1d array of width/height gridSize+2/gridSize
        // top left corner is 0, top left corner of board is 1
        // "invalid" column of padding on left and right
        //   0 is empty
        //   1 is body (including head)
        //   2 is apple
        //  -1 is invalid
        this.grid = new Array((gridSize+2) * gridSize);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = 0;
        }
        // fill in invalid columns
        for (let i = 0; i < this.grid.length; i += (gridSize+2)) {
            this.grid[i] = -1;
            this.grid[i + (gridSize+1)] = -1;
        }

        // apple
        this.appleVal = appleVal;
        this.appleSpawned = false;

        // ticks so far
        this.timeTicks = 0;

        // tick rate and throttling
        this.tickRate = tickRateStart;
        this.then = Date.now();
        this.now = then;

        // still running
        this.paused = false;
        this.running = true;

        // TODO: game start

        // start
        this.gameClock();
    }

    // function which handles the internal game clock and throttles framerate
    gameClock(){
        // game still running
        if(this.running && !this.paused) {
            // milliseconds btw ticks
            let tickInterval = 1000 / this.tickRate;

            // call this method in a certain amount of time
            setTimeout(() => {
                this.gameClock();
            }, Math.ceil(tickInterval / 5));

            this.now = Date.now();
            if (this.now >= this.then + tickInterval) {
                this.then = this.then + tickInterval;
                this.tick();
            }

            // TODO
        }
        // game ended
        else if(!this.running && !this.paused){
            this.finish();
            this.paused = true;
        }
        // paused
        else{

        }
    }

    // one game tick
    tick(){
        // spawn apple
        if(!this.appleSpawned){
            // TODO
        }

        this.mySnake.makeTick();
        this.timeTicks++;
    }

    // keyEvent, called from outside
    keyEventIn(keyEvent){
        this.mySnake.updateDecision(keyEvent);
    }

    // draw, call from outside
    draw(ctx){
        ctx.clearRect(0, 0, ctx.data.width, ctx.data.height);
        this.mySnake.draw(ctx);
        // TODO: draw apple
    }

    // finish and callback
    finish(){
        this.score = this.mySnake.myLength;
        // TODO
        this.callBack();
    }
}