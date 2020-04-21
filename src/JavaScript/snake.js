// Modular snake, all logic should be elsewhere in input/brain/whatnot
//  There should be very little actual code here
class Snake{
    constructor(inputIn, brainIn, headPosIn, startLengthIn, appleVal) {
        // set variables
        // MOVED TO SINGLESNAKERUNNER CONSTRUCTOR
        this.mySingleSnakeRunner = null;
        // input
        this.myInput = inputIn;
        this.myInput.updateParentSnake(this);
        this.myBrain = brainIn;
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

        this.gridSize = -1;

        this.appleVal = appleVal;

        // Used for labeling in output/input text files
        this.name = "";
    }
    // set name, caps at "snakeNameChars" chars
    setName(name){
        if(name.length < snakeNameChars){
            this.name = name;
        }
        else{
            this.name = name.substring(0, snakeNameChars);
        }
    }
    // to set parent runner
    updateParentRunner(singleSnakeRunnerIn){
        this.mySingleSnakeRunner = singleSnakeRunnerIn;
        this.gridSize = this.mySingleSnakeRunner.gridSize;
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
            return false;
        }

        // apple
        if(grid[newPos] == 2){
            // console.log("Eating apple, this.appleVal: " + this.appleVal);
            this.myLength += this.appleVal;
            // alert("Ate apple");
            this.mySingleSnakeRunner.appleSpawned = false;
        }

        // manage length
        // console.log("my length: " + this.myLength);
        // console.log("this.myBodySegs.size: " + this.myBodySegs.size);
        if(this.myBodySegs.size > this.myLength){
            grid[this.myBodySegs.poll()] = 0;
        }

        // move
        this.myHeadPos = newPos;
        grid[newPos] = 1;
        this.myBodySegs.enqueue(newPos);

        return true;
    }
    // processes one tick, returns the same as makeMove()
    makeTick(){
        this.updateDecision(null);

        return this.makeMove();
    }
    // draw
    draw(ctx){
        // alert("Snake draw");
        let curr = this.myBodySegs.startNode;
        let width = ctx.canvas.width;
        // width/height of one grid square
        let step = width/this.gridSize;
        // draw snake different color if ded
        if(this.mySingleSnakeRunner.running == true) {
            ctx.fillStyle = snakeColor;
        }
        else{
            ctx.fillStyle = snakeDedColor;
        }
        while(curr != null){
            let currVal = curr.myVal;
            // alert("currVal: " + currVal);
            // alert("gridSize: " + this.gridSize);
            let r = Math.floor(currVal / (this.gridSize+2));
            // alert("row: " + r);
            // minus one to account for the padding
            let c = currVal % (this.gridSize+2) - 1;
            // alert("col: " + c);
            // alert("step: " + step);

            ctx.beginPath();
            // alert("rect is from x: " + c*step + ", y: " + r*step + ", w: " + step + ", h: " + step);
            ctx.rect(c*step, r*step, step, step);
            ctx.fill();
            ctx.closePath();

            curr = curr.myNext;
        }

        // alert(ctx);
        // ctx.beginPath();
        // ctx.rect(0, 50, 50, 50);
        // ctx.fillStyle = "#0000ff";
        // ctx.fill();
        // ctx.closePath();
    }
    // returns a copy of this snake
    cloneMe(){
        let clone = new Snake(this.myInput.cloneMe(), this.myBrain.cloneMe(), this.startHeadPos, this.startLength, this.appleVal);
        return clone;
    }
}
