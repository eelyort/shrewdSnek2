// Modular snake, all logic should be elsewhere in input/brain/whatnot
//  There should be very little actual code here
class Snake extends Component{
    constructor(inputIn, brainIn, headPosIn, startLengthIn, appleVal, gridSizeIn, nameIn = "", descriptionIn = "") {
        super(0, "", descriptionIn);
        this.setName(nameIn);
        // set variables
        this.mySingleSnakeRunner = null;
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
        this.bodySegsToDraw.enqueue(this.startHeadPos);

        this.uuid = "normal";

        // input
        this.changeInput(inputIn);
        this.changeBrain(brainIn);

        this.generationNumber = 0;
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
    // sets the name as if it is a clone: player (1), etc
    setNameClone(){
        const tokens = this.componentName.split(" ");
        const lastToken = tokens[tokens.length-1];
        const lastTokenNum = lastToken.substring(1, lastToken.length-1);
        // clone of a clone
        if(lastToken[0] === "(" && lastToken[lastToken.length-1] === ")" && !isNaN(lastTokenNum)){
            this.setName(this.componentName.substring(0, this.componentName.length-lastToken.length) + `(${parseInt(lastTokenNum)+1})`);
        }
        else{
            this.setName(this.componentName + " (1)");
        }
    }
    // changes the input
    changeInput(inputIn){
        this.myInput = inputIn;
        this.myInput.updateParentSnake(this);
        if(this.myBrain){
            this.myBrain.updateWithInput(this.myInput);
        }
    }
    // changes the brain
    changeBrain(brainIn){
        this.myBrain = brainIn;
        this.myBrain.updateWithInput(this.myInput);
    }
    // to set parent runner
    updateParentRunner(singleSnakeRunnerIn){
        this.mySingleSnakeRunner = singleSnakeRunnerIn;
        this.mySingleSnakeRunner.grid[this.startHeadPos] = 1;
    }

    // for printing purposes
    getDecision(keyEvent){
        return this.myBrain.getDecision(this.myInput.generateInput(keyEvent));
    }
    // updates direction, should be called only on key events
    updateDecision(keyEvent){
        let decision = this.getDecision(keyEvent);

        // filter out useless information
        if(decision === 0 || decision === 1 || decision === 2 || decision === 3){
            // make it so u cannot instantly kill self by going backwards
            if(!((decision > 1 && decision-2 === this.previousDir) || (decision < 2 && decision+2 === this.previousDir))) {
                this.myDirection = decision;
            }
        }
    }
    // actually moves the snake on the board
    // returns false if dead, true otherwise
    makeMove(){
        this.updateDecision(null);

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
        if(newPos < 0 || newPos >= grid.length || grid[newPos] === -1 || grid[newPos] === 1){
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
        if(grid[newPos] === 2){
            this.myLength += this.appleVal;
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

        return true;
    }
    // draw
    draw(ctx){
        // width/height of one grid square
        let step = ctx.canvas.width/this.gridSize;

        // draw snake different color if ded
        if(!this.mySingleSnakeRunner.dead) {
            ctx.fillStyle = snakeColor;
        }
        else{
            ctx.fillStyle = snakeDedColor;
        }

        // full draw: assumed canvas is cleared, go through and draw all body segments
        if(!this.focused){
            this.drawAllBodySegs(ctx, step);
        }
        // partial draw, only erase the tail parts and draw the head parts
        else{
            // the very specific case of the snake just dying so only its front few segments are red
            if(this.mySingleSnakeRunner.dead){
                this.drawAllBodySegs(ctx, step);
            }
            else {
                // draw head
                while (this.bodySegsToDraw.size > 0) {
                    let currVal = this.bodySegsToDraw.poll();

                    if(this.mySingleSnakeRunner.grid[currVal] === 1) {
                        this.drawSquare(ctx, currVal, step);
                    }
                }
            }

            // erase tails
            while(this.bodySegsToErase.size > 0){
                let currVal = this.bodySegsToErase.poll();

                if(this.mySingleSnakeRunner.grid[currVal] !== 1) {
                    let [r, c] = deconstructRC(currVal, this.gridSize);

                    ctx.clearRect(c * step, r * step, step, step);
                }
            }
        }
    }
    drawAllBodySegs(ctx, step){
        // pseudo iterator
        let curr = this.myBodySegs.startNode;

        while(curr != null){
            let currVal = curr.myVal;

            this.drawSquare(ctx, currVal, step);

            curr = curr.myNext;
        }
    }

    // draws one segment
    drawSquare(ctx, val, step){
        let [r, c] = deconstructRC(val, this.gridSize);

        ctx.beginPath();
        ctx.rect(c*step, r*step, step, step);
        ctx.fill();
        ctx.closePath();
    }
    // returns a copy of this snake
    cloneMe(){
        let clone = new Snake(this.myInput.cloneMe(), this.myBrain.cloneMe(), this.startHeadPos, this.startLength, this.appleVal, this.gridSize);
        clone.uuid = this.uuid;
        clone.componentName = this.componentName;
        clone.componentDescription = this.componentDescription;
        clone.generationNumber = this.generationNumber;

        return clone;
    }
    // stringify a snake for storage
    stringify() {
        // temporarily save the problematic objects
        // queue's
        let tempDrawQ = this.bodySegsToDraw;
        let tempEraseQ = this.bodySegsToErase;
        let bodySegsQ = this.myBodySegs;
        // objects
        let tempInput = this.myInput;
        let tempBrain = this.myBrain;
        let tempRunner = this.mySingleSnakeRunner;

        // replace the problematic objects with working versions
        // queue's
        this.bodySegsToDraw = tempDrawQ.stringify();
        this.bodySegsToErase = tempEraseQ.stringify();
        this.myBodySegs = bodySegsQ.stringify();
        // objects
        this.myInput = tempInput.stringify();
        this.myBrain = tempBrain.stringify();
        this.mySingleSnakeRunner = null;

        let ans = JSON.stringify(this);

        // put the problematic objects back
        // queue's
        this.bodySegsToDraw = tempDrawQ;
        this.bodySegsToErase = tempEraseQ;
        this.myBodySegs = bodySegsQ;
        // objects
        this.myInput = tempInput;
        this.myBrain = tempBrain;
        this.mySingleSnakeRunner = tempRunner;

        return ans;
    }
    // pull a snake out of storage
    static parse(str){
        let ans = JSON.parse(str);
        Object.setPrototypeOf(ans, Snake.prototype);

        // un stringify the input
        // queue's
        ans.bodySegsToDraw = CustomQueue.parse(ans.bodySegsToDraw);
        ans.bodySegsToErase = CustomQueue.parse(ans.bodySegsToErase);
        ans.myBodySegs = CustomQueue.parse(ans.myBodySegs);
        // objects
        ans.myInput = Input.parse(ans.myInput);
        ans.myBrain = Brain.parse(ans.myBrain);

        return ans;
    }
}

class SnakeSpecies{
    constructor(snakes){
        if(Array.isArray(snakes)){
            this.snakes = snakes;
        }
        else{
            this.snakes = [snakes];
        }
    }
    getComponentName(){
        return this.snakes[0].getComponentName();
    }
    getComponentDescription(){
        return this.snakes[0].getComponentName();
    }
    cloneMe(generation = (this.snakes.length - 1)){
        return this.snakes[generation].cloneMe();
    }
    push(snake){
        this.snakes.push(snake);
    }
    getLength(){
        return this.snakes.length;
    }
    setNameClone(){
        this.snakes.map(((value, index) => value.setNameClone()));
    }
    cloneSpecies(){
        let sneks = this.snakes.map(((value, index) => value.cloneMe()));
        return new SnakeSpecies(sneks);
    }
    stringify(){
        let a = this.snakes.map((value, index) => {return value.stringify()});
        return JSON.stringify(a);
    }
    static parse(json){
        let a = JSON.parse(json);
        return new SnakeSpecies(a.map((val) => {return Snake.parse(val)}));
    }
}
