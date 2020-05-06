class SingleSnakeRunner{
    constructor(snakeIn, tickRateStart, callback){
        this.mySnake = snakeIn;
        this.gridSize = this.mySnake.gridSize;
        this.callBack = callback;

        // grid is 1d array of width/height gridSize+2/gridSize
        // top left corner is 0, top left corner of board is 1
        // "invalid" column of padding on left and right
        //   0 is empty
        //   1 is body (including head)
        //   2 is apple
        //  -1 is invalid
        this.grid = new Array((this.gridSize+2) * this.gridSize);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = 0;
        }
        // fill in invalid columns
        for (let i = 0; i < this.grid.length; i += (this.gridSize+2)) {
            this.grid[i] = -1;
            this.grid[i + (this.gridSize+1)] = -1;
        }

        // apple
        this.appleSpawned = false;
        this.applePosition = -1;
        this.appleDrawn = false;

        // ticks so far
        this.timeTicks = 0;

        // tick rate and throttling
        this.tickRate = tickRateStart;
        this.then = Date.now();
        this.now = this.then;

        // still running
        this.paused = false;
        this.running = true;
        // master kill switch
        this.dead = false;

        // whether this is being drawn every frame or not
        this.focused = false;
        this.fullDraw = true;

        this.mySnake.updateParentRunner(this);
    }
    // start
    startMe(){
        // start
        this.then = Date.now();
        this.now = this.then;
        this.gameClock();
    }
    // function which acts as if the menu or something just focused on this and began drawing it every draw call
    focusMe(){
        // console.log("runner focusMe() called");
        this.focused = true;
        // this.mySnake.focusMe();
    }
    focusEnd(){
        this.focused = false;
        this.fullDraw = true;
        this.mySnake.focusEnd();
    }

    // function which handles the internal game clock and throttles framerate
    gameClock(){
        // master kill switch
        if(this.dead){
            return;
        }

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
            // console.log("Game finished");
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

    // called from snake, processes the logic of apple eating
    appleEaten(){
        this.appleSpawned = false;
        this.appleDrawn = false;
    }

    // draw, call from outside
    draw(ctx){
        if(!this.running){
            // draw ded snek
            this.mySnake.draw(ctx);

            // don't need to clear screen or draw apple or anything
            return;
        }

        // only clear screen if not focused
        if(this.fullDraw) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.appleDrawn = false;

            // last full draw before only doing partial draws
            if(this.focused){
                this.fullDraw = false;
                this.mySnake.focusMe();
            }
        }

        this.drawApple(ctx);

        // draw snake - handles its fullDraw stuff on its own
        this.mySnake.draw(ctx);
    }
    drawApple(ctx){
        if(!this.appleDrawn && this.appleSpawned){
            // draw apple
            ctx.fillStyle = appleColor;

            let r = Math.floor(this.applePosition / (this.gridSize+2));
            let c = this.applePosition % (this.gridSize+2) - 1;
            let step = ctx.canvas.width/this.gridSize;

            ctx.beginPath();
            ctx.rect(c*step, r*step, step, step);
            ctx.fill();
            ctx.closePath();

            this.appleDrawn = true;
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
        this.callBack();
        this.dead = true;
        // this.score = this.mySnake.myLength;
        // this.draw();
    }

    // kills the thread
    kill(){
        this.dead = true;
    }
}