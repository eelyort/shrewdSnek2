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
        this.myLength = startLengthIn;

        // TODO: scores or have them be in singleSnakeRunner?
        this.score = 0;
    }
    getDecision(keyEvent){

    }
}