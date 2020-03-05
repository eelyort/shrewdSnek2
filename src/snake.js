// Modular snake, all logic should be elsewhere in input/brain/whatnot
//  There should be very little actual code here
class Snake{
    constructor(parentSingleSnakeRunner, ctxIn, inputIn, brainIn, headPosIn, startLengthIn) {
        this.mySingleSnakeRunner = parentSingleSnakeRunner;
        this.myCTX = ctxIn;
        this.myInput = inputIn;
        this.myBrain = brainIn;
        this.myHeadPos = headPosIn;
        this.myTailPos = this.myHeadPos;
        // queue of body segments so that can remove them when needed
        this.myBodySegs = new CustomQueue();
        this.myBodySegs.enqueue(this.myHeadPos);

        // N(0), E(1), S(2), W(3)
        this.myDirection = 0;
        this.myLength = startLengthIn;

        this.score = 0;
    }
    // for printing purposes
    getDecision(keyEvent){
        this.myBrain.getDecision(this.myInput.generateInput(keyEvent));
    }
    // actually moves the snake on the board
    // returns false if dead, true otherwise
    makeMove(direction){
        // TODO
    }
    // processes one tick
    makeTick(keyEvent){
        let decision = this.getDecision(keyEvent);

        // filter out useless information
        if(decision == 0 || decision == 1 || decision == 2 || decision == 3){
            this.myDirection = decision;
        }
    }
}
