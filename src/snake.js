// Modular snake, all logic should be elsewhere in input/brain/whatnot
//  There should be very little actual code here
class Snake{
    constructor(parentSingleSnakeRunner, inputIn, brainIn, headPosIn, startLengthIn) {
        // set variables
        this.mySingleSnakeRunner = parentSingleSnakeRunner;
        // input
        this.myInput = inputIn;
        this.myInput.updateParentSnake(this);
        this.myBrain = brainIn;
        // let these be ints of range: [0, gridSize^2)
        this.myHeadPos = headPosIn;
        this.myTailPos = this.myHeadPos;
        // queue of body segments so that can remove them when needed
        this.myBodySegs = new CustomQueue();
        this.myBodySegs.enqueue(this.myHeadPos);

        // N(0), E(1), S(2), W(3)
        this.myDirection = 0;
        this.myLength = startLengthIn;

        this.gridSize = parentSingleSnakeRunner.gridSize;

        this.score = 0;
    }
    // for printing purposes
    getDecision(keyEvent){
        this.myBrain.getDecision(this.myInput.generateInput(keyEvent));
    }
    // updates direction, should be called only on key events
    updateDecision(keyEvent){
        let decision = this.getDecision(keyEvent);

        // filter out useless information
        if(decision == 0 || decision == 1 || decision == 2 || decision == 3){
            this.myDirection = decision;
        }
    }
    // actually moves the snake on the board
    // returns false if dead, true otherwise
    makeMove(){
        let adjacent = 0;
        switch (this.myDirection) {
            case 0:
                adjacent = -this.gridSize;
                break;
            case 1:
                adjacent = 1;
                break;
            case 2:
                adjacent = this.gridSize;
                break;
            case 3:
                adjacent = -1;
                break;
            default:
                alert("INVALID this.myDirection!!!");
        }

        let grid = this.mySingleSnakeRunner.grid;
        let newPos = this.myHeadPos + adjacent;

        // running into wall or self
        if(newPos < 0 || newPos >= grid.length || grid[newPos] == -1 || grid[newPos] == 1){
            return false;
        }

        // apple
        if(grid[newPos] == 2){
            this.myLength += this.mySingleSnakeRunner.appleVal;
        }

        // move
        this.myHeadPos = newPos;
        grid[newPos] = 1;
        this.myBodySegs.enqueue(newPos);

        // manage length
        if(this.myBodySegs.size > this.myLength){
            grid[this.myBodySegs.poll()] = 0;
        }
        return true;
    }
    // processes one tick
    makeTick(){
        this.updateDecision(null);

        this.makeMove();
    }
    // draw
    draw(ctx){
        let curr = this.myBodySegs.startNode;
        ctx.fillStyle = snakeColor;
        while(curr != null){
            let currVal = curr.myVal;
            let r = Math.floor(currVal / (this.gridSize+2));
            let c = currVal % (this.gridSize+2);

            ctx.beginPath();
            ctx.rect(c*this.gridSize - 1, r*this.gridSize, this.gridSize, this.gridSize);
            ctx.fill();
            ctx.closePath();

            curr = curr.myNext;
        }
    }
    // returns a copy of this snake
    cloneMe(parentSingleSnakeRunner, headPosIn, startLengthIn){
        let clone = new Snake(parentSingleSnakeRunner, this.myInput.cloneMe(), this.myBrain.cloneMe(), headPosIn, startLengthIn);
        return clone;
    }
}
