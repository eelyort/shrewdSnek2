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
        this.applePosition;

        // ticks so far
        this.timeTicks = 0;

        // tick rate and throttling
        this.tickRate = tickRateStart;
        this.then = Date.now();
        this.now = this.then;

        // still running
        this.paused = false;
        this.running = true;

        // TODO: game start

        // start
        this.gameClock();

        this.mySnake.updateParentRunner(this);

        // TODO: test
        this.testVar = 0;
    }

    // function which handles the internal game clock and throttles framerate
    gameClock(){
        // game still running
        if(this.running) {
            // milliseconds btw ticks
            let tickInterval = 1000 / this.tickRate;

            // call this method in a certain amount of time
            setTimeout(() => {
                this.gameClock();
            }, Math.ceil(tickInterval / 5));

            // not paused
            if(!this.paused) {
                this.now = Date.now();
                if (this.now >= this.then + tickInterval) {
                    this.then = this.then + tickInterval;
                    this.tick();
                }
            }
            // paused
            else{
                this.then = Date.now();
            }
        }
        // game ended
        else if(!this.running && !this.paused){
            this.finish();
            this.paused = true;
        }
    }

    // one game tick
    tick(){
        this.timeTicks++;
        if(!this.mySnake.makeTick()){
            this.running = false;
        }
        // spawn apple
        if(!this.appleSpawned){
            let r, c, index;
            while(!this.appleSpawned) {
                r = Math.floor(Math.random() * this.gridSize);
                c = Math.floor(Math.random() * this.gridSize);
                index = (r * (this.gridSize + 2)) + c + 1;

                if(this.grid[index] == 0){
                    this.appleSpawned = true;
                    this.grid[index] = 2;
                    this.applePosition = index;
                }
            }
        }
    }

    // keyEvent, called from outside
    keyEventIn(keyEvent){
        // alert("Runner keyEvent: " + keyEvent);
        this.mySnake.updateDecision(keyEvent);
        // alert("Runner keyEvent2: " + keyEvent);
    }

    // draw, call from outside
    draw(ctx){
        if(!this.running){

        }
        ctx.clearRect(0, 0 , ctx.canvas.width, ctx.canvas.height);

        // draw snake
        this.mySnake.draw(ctx);

        // draw apple
        if(this.appleSpawned) {
            ctx.fillStyle = appleColor;

            let r = Math.floor(this.applePosition / (this.gridSize+2));
            let c = this.applePosition % (this.gridSize+2) - 1;
            let step = ctx.canvas.width/this.gridSize;

            ctx.beginPath();
            ctx.rect(c*step, r*step, step, step);
            ctx.fill();
            ctx.closePath();
        }
    }

    // pause the game, call from outside
    pause(){
        this.paused = true;
    }

    // unpause the game, call from outside
    unpause(){
        this.paused = false;
        // this.gameClock();
    }

    // finish and callback
    finish(){
        this.score = this.mySnake.myLength;
        // alert("ded");
        // TODO
        // alert(this.callBack);
        this.callBack();
    }
}