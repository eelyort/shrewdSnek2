class SingleSnakeRunner{
    constructor(snakeIn, tickRateStart, callback, tickTimeOut = null, appleSpawnIn = null){
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
        this.grid = Array.apply(null, {length: (this.gridSize+2) * this.gridSize});
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
        // ticks since last apple
        this.ticksSinceApple = 0;

        // how long the snake can go without eating an apple (in ticks) before instantly dying
        //  null makes the snake never time out
        this.tickTimeOut = tickTimeOut;

        // tick rate and throttling
        this.tickRate = tickRateStart;
        // tick interval holder
        this.intervalID = null;

        // still running
        this.running = true;
        // master kill switch
        this.dead = false;

        // whether this is being drawn every frame or not
        this.focused = false;
        this.fullDraw = true;

        // apple spawner function
        this.appleSpawn = ((appleSpawnIn == null) ? (defaultAppleSpawn.bind(this)) : (appleSpawnIn.bind(this)));

        this.mySnake.updateParentRunner(this);
    }
    // sets the interval to call
    changeTickRate(newVal){
        if(newVal !== this.tickRate || !this.intervalID) {
            this.tickRate = newVal;

            // clear previous
            if (this.intervalID) {
                clearInterval(this.intervalID);
            }

            // start new
            this.intervalID = setInterval(this.tick.bind(this), 1000 / this.tickRate);
        }
    }
    // start
    startMe(){
        // start
        this.changeTickRate(this.tickRate);
    }
    // function which acts as if the menu or something just focused on this and began drawing it every draw call
    focusMe(){
        // prevent the "bleeding" effect where clear rect doesn't fully erase a high? resolutions
        if(this.mySnake.gridSize < 101) {
            this.focused = true;
            this.mySnake.focusMe();
        }
    }
    focusEnd(){
        this.focused = false;
        this.fullDraw = true;
        this.mySnake.focusEnd();
    }

    // one game tick
    tick(){
        // game still running
        if(this.running) {
            this.timeTicks++;

            this.ticksSinceApple++;
            // time out
            if (this.tickTimeOut && this.ticksSinceApple > this.tickTimeOut(this.mySnake.myLength)) {
                this.finish();
                return;
            }

            // run the snake
            if (!this.mySnake.makeMove()) {
                this.finish();
                return;
            }
            // spawn apple
            if (!this.appleSpawned) {
                this.appleSpawn();
                this.ticksSinceApple = 0;
            }
        }
    }

    // keyEvent, called from outside
    keyEventIn(keyEvent){
        this.mySnake.updateDecision(keyEvent);
    }

    // called from snake, processes the logic of apple eating
    appleEaten(){
        this.appleSpawned = false;
        this.appleDrawn = false;
    }

    // draw, call from outside
    draw(ctx){
        if(this.dead){
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

            let [r, c] = deconstructRC(this.applePosition, this.gridSize);
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
        this.running = false;
    }

    // unpause the game, call from outside
    unpause(){
        this.running = true;
    }

    // finish and callback
    finish(){
        this.kill();
        this.callBack();
    }

    // kills the thread
    kill(){
        this.dead = true;

        this.running = false;

        // clear previous
        if(this.intervalID != null){
            clearInterval(this.intervalID);
        }
    }
}