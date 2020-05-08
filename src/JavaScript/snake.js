// Modular snake, all logic should be elsewhere in input/brain/whatnot
//  There should be very little actual code here
class Snake extends SnakeComponent{
    constructor(inputIn, brainIn, headPosIn, startLengthIn, appleVal, gridSizeIn, nameIn = "", descriptionIn = "") {
        super("", descriptionIn);
        this.setName(nameIn);
        // set variables
        // MOVED TO SINGLESNAKERUNNER CONSTRUCTOR
        this.mySingleSnakeRunner = null;
        // input
        this.myInput = inputIn;
        this.myInput.updateParentSnake(this);
        this.myBrain = brainIn;
        this.myBrain.updateWithInput(this.myInput);
        // let these be ints of range: [0, gridSize^2)
        this.startHeadPos = headPosIn;
        this.myHeadPos = headPosIn;
        this.myTailPos = this.myHeadPos;
        // queue of body segments so that can remove them when needed
        this.myBodySegs = new CustomQueue();
        this.myBodySegs.enqueue(this.myHeadPos);

        // N(0), E(1), S(2), W(3)
        this.myDirection = 1;
        this.previousDir = -1;
        this.startLength = startLengthIn;
        this.myLength = startLengthIn;

        this.gridSize = gridSizeIn;

        this.appleVal = appleVal;

        // whether this is being drawn every frame or not
        this.focused = false;
        // used to erase body segments, used only when focused
        this.bodySegsToErase = new CustomQueue();
        this.bodySegsToDraw = new CustomQueue();
    }
    focusMe(){
        this.focused = true;
    }
    focusEnd(){
        this.focused = false;
    }
    // set name, caps at "snakeNameChars" chars
    setName(name){
        if(name.length < snakeNameChars){
            this.componentName = name;
        }
        else{
            this.componentName = name.substring(0, snakeNameChars);
        }
    }
    // to set parent runner
    updateParentRunner(singleSnakeRunnerIn){
        this.mySingleSnakeRunner = singleSnakeRunnerIn;
        // alert("gridSize snake update to: " + this.gridSize);
    }
    // for printing purposes
    getDecision(keyEvent){
        // if(keyEvent != null){
        //     alert("Snake getDecision called with keyEvent: " + keyEvent);
        // }
        return this.myBrain.getDecision(this.myInput.generateInput(keyEvent));
    }
    // updates direction, should be called only on key events
    updateDecision(keyEvent){
        let decision = this.getDecision(keyEvent);
        // if(keyEvent != null){
        //     alert("decision: " + decision);
        // }

        // filter out useless information
        if(decision == 0 || decision == 1 || decision == 2 || decision == 3){
            // make it so u cannot instantly kill self by going backwards
            if(!((decision > 1 && decision-2 == this.previousDir) || (decision < 2 && decision+2 == this.previousDir))) {
                this.myDirection = decision;
            }
        }
    }
    // actually moves the snake on the board
    // returns false if dead, true otherwise
    makeMove(){
        let adjacent = 0;
        switch (this.myDirection) {
            case 0:
                adjacent = -(this.gridSize+2);
                break;
            case 1:
                adjacent = 1;
                break;
            case 2:
                adjacent = (this.gridSize+2);
                break;
            case 3:
                adjacent = -1;
                break;
            default:
                alert("INVALID this.myDirection!!!");
        }

        this.previousDir = this.myDirection;

        let grid = this.mySingleSnakeRunner.grid;
        let newPos = this.myHeadPos + adjacent;

        // running into wall or self
        if(newPos < 0 || newPos >= grid.length || grid[newPos] == -1 || grid[newPos] == 1){
            // console.log(`Dead: toErase.len: ${this.bodySegsToErase.size}, toDraw.len: ${this.bodySegsToDraw.size}, bodySegs.len: ${this.myBodySegs.size}`);
            return false;
        }

        // manage length
        while(this.myBodySegs.size > this.myLength - 1){
            let tailPos = this.myBodySegs.poll();
            grid[tailPos] = 0;

            // when focused, changed body segments get shoved into queues for drawing
            if(this.focused){
                this.bodySegsToErase.enqueue(tailPos);
            }
        }

        // apple
        if(grid[newPos] == 2){
            // console.log("Eating apple, this.appleVal: " + this.appleVal);
            this.myLength += this.appleVal;
            // alert("Ate apple");
            this.mySingleSnakeRunner.appleEaten();
        }

        // move
        this.myHeadPos = newPos;
        grid[newPos] = 1;
        this.myBodySegs.enqueue(newPos);

        // when focused, changed body segments get shoved into queues for drawing
        if(this.focused){
            this.bodySegsToDraw.enqueue(newPos);
        }

        // console.log(`end of snake makeMove(), bodySegsToDraw.size: ${this.bodySegsToDraw.size}, this.bodySegsToErase.size: ${this.bodySegsToErase.size}`);

        return true;
    }
    // processes one tick, returns the same as makeMove()
    makeTick(){
        this.updateDecision(null);

        return this.makeMove();
    }
    // draw
    draw(ctx){
        let width = ctx.canvas.width;
        // width/height of one grid square
        let step = width/this.gridSize;
        // draw snake different color if ded
        if(this.mySingleSnakeRunner.running) {
            ctx.fillStyle = snakeColor;
            // console.log("alive");
        }
        else{
            ctx.fillStyle = snakeDedColor;
        }

        // full draw: assumed canvas is cleared, go through and draw all body segments
        if(!this.focused){
            // pseudo iterator
            let curr = this.myBodySegs.startNode;

            while(curr != null){
                let currVal = curr.myVal;
                let r = Math.floor(currVal / (this.gridSize+2));
                // minus one to account for the padding
                let c = currVal % (this.gridSize+2) - 1;

                ctx.beginPath();
                ctx.rect(c*step, r*step, step, step);
                ctx.fill();
                ctx.closePath();

                curr = curr.myNext;
            }
        }
        // partial draw, only erase the tail parts and draw the head parts
        else{
            // the very specific case of the snake just dying so only its front few segments are red
            if(!this.mySingleSnakeRunner.running){
                // pseudo iterator
                let curr = this.myBodySegs.startNode;

                while(curr != null){
                    let currVal = curr.myVal;
                    let r = Math.floor(currVal / (this.gridSize+2));
                    // minus one to account for the padding
                    let c = currVal % (this.gridSize+2) - 1;

                    ctx.beginPath();
                    ctx.rect(c*step, r*step, step, step);
                    ctx.fill();
                    ctx.closePath();

                    curr = curr.myNext;
                }
            }
            else {
                // draw head
                while (this.bodySegsToDraw.size > 0) {
                    let currVal = this.bodySegsToDraw.poll();
                    let r = Math.floor(currVal / (this.gridSize + 2));
                    // minus one to account for the padding
                    let c = currVal % (this.gridSize + 2) - 1;

                    ctx.beginPath();
                    ctx.rect(c * step, r * step, step, step);
                    ctx.fill();
                    ctx.closePath();
                }
            }

            // erase tails
            while(this.bodySegsToErase.size > 0){
                let currVal = this.bodySegsToErase.poll();
                let r = Math.floor(currVal / (this.gridSize+2));
                // minus one to account for the padding
                let c = currVal % (this.gridSize+2) - 1;

                ctx.clearRect(c*step, r*step, step, step);
            }
        }
    }
    // returns a copy of this snake
    cloneMe(){
        // console.log("cloning snake, this.gridSize: " + this.gridSize);
        let clone = new Snake(this.myInput.cloneMe(), this.myBrain.cloneMe(), this.startHeadPos, this.startLength, this.appleVal, this.gridSize);
        return clone;
    }
}
