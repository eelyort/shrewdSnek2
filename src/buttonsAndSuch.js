// the next layer class which is currently running and controlling visuals/inputs
class InteractableLayer{
    constructor(documentIn, canvasIn, ctxIn){
        // alert("Beginning of InteractableLayer constructor");
        this.isRunning = true;
        this.myDocument = documentIn;
        this.myCanvas = canvasIn;
        this.myCTX = ctxIn;
        this.myCanvas.style.zIndex = "1";
        // alert("End of InteractableLayer constructor");
    }
    run(){
        // left empty on purpose
    }
}

// queue implementation
class QueueNode{
    constructor(valueIn, nextNode) {
        this.myVal = valueIn;
        this.myNext = nextNode;
    }
}
class CustomQueue{
    constructor(){
        this.startNode = null;
        this.endNode = null;
        this.size = 0;
    }
    enqueue(valueIn){
        let newNode = new QueueNode(valueIn, null);
        if(this.size > 0) {
            this.endNode.myNext = newNode;
            this.endNode = newNode;
        }
        // when adding first one
        else{
            this.startNode = newNode;
            this.endNode = newNode;
        }
        this.size++;
    }
    poll(){
        let valOut = this.startNode.myVal;
        this.startNode = this.startNode.myNext;
        return valOut;
    }
    peel(){
        return this.startNode.myVal;
    }
}

// default button class to make things easier
class ButtonPrimative{
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, buttonCTX, myButtonFunc){
        // given percentage coords (0-1)
        if(isPercentage) {
            this.xTopLeft = Math.floor(xTopLeft * buttonCTX.data.width);
            this.yTopLeft = Math.floor(yTopLeft * buttonCTX.data.height);
            this.widthButton = Math.floor(widthButton * buttonCTX.data.width);
            this.heightButton = Math.floor(heightButton * buttonCTX.data.height);
        }
        // given absolute coords
        else{
            this.xTopLeft = xTopLeft;
            this.yTopLeft = yTopLeft;
            this.widthButton = widthButton;
            this.heightButton = heightButton;
        }
        this.buttonText = buttonText;
        this.buttonCTX = buttonCTX;
        this.buttonTransform = this.buttonCTX.getTransform();
        this.myButtonFunc = myButtonFunc;
    }
    // draws this button, assumes that the fillstyle is set by the wrapper
    drawButton(){
        this.buttonCTX.beginPath();
        this.buttonCTX.rect(this.xTopLeft, this.yTopLeft, this.widthButton, this.heightButton);
        this.buttonCTX.fill();
        this.buttonCTX.closePath();
    }
    // returns boolean of whether mouse click is within button
    // coords given in absolute coords of the entire canvas
    withinButton(xPosIn, yPosIn){
        // scale to fit if transformed
        let localX = xPosIn * this.buttonTransform.a + this.buttonTransform.e;
        let localY = yPosIn * this.buttonTransform.d + this.buttonTransform.f;

        // check/return if in bounding box
        return (localX >= this.xTopLeft && localX <= this.xTopLeft + this.widthButton) && (localY >= this.yTopLeft && localY <= this.yTopLeft + this.heightButton);
    }

    // clicks the button, also checking if this is the right button to press
    clickButton(xPosIn, yPosIn, funcParameters){
        if(this.withinButton(xPosIn, yPosIn, funcParameters)){
            this.myButtonFunc(funcParameters);
        }
    }
}

// button which is made using HTML
class ButtonHTML{
    // TODO: commented out so that can redo with only percentage coords
    // // creates a button, from initialization to HTML creation
    // constructor(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, parentElement, documentButton, buttonFunc){
    //     // alert("Beginning of ButtonHTML constructor");
    //     // initialize variables
    //     // given percentage coords (0-1)
    //     if(isPercentage) {
    //         this.xTopLeft = Math.floor(xTopLeft * parentElement.offsetWidth);
    //         this.yTopLeft = Math.floor(yTopLeft * parentElement.offsetHeight);
    //         this.widthButton = Math.floor(widthButton * parentElement.offsetWidth);
    //         this.heightButton = Math.floor(heightButton * parentElement.offsetHeight);
    //     }
    //     // given absolute coords
    //     else{
    //         this.xTopLeft = xTopLeft;
    //         this.yTopLeft = yTopLeft;
    //         this.widthButton = widthButton;
    //         this.heightButton = heightButton;
    //     }
    //     this.buttonText = buttonText;
    //     this.myButtonFunc = buttonFunc;
    //
    //     // alert("Checkpoint 1 for buttonHTML");
    //
    //     // create HTML button
    //     this.myButton = documentButton.createElement("button");
    //     this.myButton.innerHTML = this.buttonText;
    //
    //     // alert("Checkpoint 2 for buttonHTML");
    //
    //     // append to document
    //     parentElement.appendChild(this.myButton);
    //
    //     // alert("Checkpoint 3 for buttonHTML");
    //
    //     // set properties
    //     // function
    //     this.myButton.addEventListener("click", this.myButtonFunc);
    //
    //     // alert("Checkpoint 4 for buttonHTML");
    //
    //     // position
    //     this.myButton.style.left = (this.xTopLeft).toString(10) + "px";
    //     this.myButton.style.top = (this.yTopLeft).toString(10) + "px";
    //     this.myButton.style.width = (this.widthButton).toString(10) + "px";
    //     this.myButton.style.height = (this.heightButton).toString(10) + "px";
    //
    //     // alert("Checkpoint 5 for buttonHTML");
    //
    //     // so its "above" the canvas
    //     this.myButton.style.position = "absolute";
    //     this.myButton.style.zIndex = "2";
    //
    //     // TODO: padding? No. do it in css file
    //
    //     // alert("End of ButtonHTML constructor");
    // }

    // creates a button, from initialization to HTML creation
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, parentElement, documentButton, buttonFunc){
        // initialize variables
        this.buttonText = buttonText;
        this.myButtonFunc = buttonFunc;
        this.xTopLeft = xTopLeft;
        this.yTopLeft = yTopLeft;
        this.widthButton = widthButton;
        this.heightButton = heightButton;
        this.isPercentage = isPercentage;

        // HTML stuff
        // create HTML button
        this.myButton = documentButton.createElement("button");
        this.myButton.innerHTML = this.buttonText;
        this.myButton.classList.add("gameButton");

        // append to document
        parentElement.appendChild(this.myButton);

        // set properties
        // function
        this.myButton.addEventListener("click", this.eventButtonClicked.bind(this));

        // so its "above" the canvas
        this.myButton.style.position = "absolute";
        this.myButton.style.zIndex = "2";

        // position
        // given percentage coords (0-1)
        if(this.isPercentage) {
            this.myButton.style.left = (this.xTopLeft * 100.0).toString(10) + "%";
            this.myButton.style.top = (this.yTopLeft * 100.0).toString(10) + "%";
            this.myButton.style.width = (this.widthButton * 100.0).toString(10) + "%";
            this.myButton.style.height = (this.heightButton * 100.0).toString(10) + "%";
        }
        // given absolute coords
        else{
            this.myButton.style.left = (this.xTopLeft).toString() + "px";
            this.myButton.style.top = (this.yTopLeft).toString() + "px";
            this.myButton.style.width = (this.widthButton).toString() + "px";
            this.myButton.style.height = (this.heightButton).toString() + "px";
        }
    }
    eventButtonClicked(){
        // alert("Parent");
        this.myButtonFunc();
    }
}

// button that toggles between functions
class ButtonHTMLToggle extends ButtonHTML{
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, parentElement, documentButton, buttonFuncs){
        super(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, parentElement, documentButton, null);
        // what function the toggle is currently on
        this.funcIndex = 0;
        this.myButtonFunctions = buttonFuncs;
    }
    toggleButtonFunc(){
        this.myButtonFunctions[this.funcIndex]();
        this.funcIndex++;
        if(this.funcIndex === this.myButtonFunctions.length){
            this.funcIndex = 0;
        }
    }
    eventButtonClicked() {
        // alert("Child");
        this.toggleButtonFunc();
    }
}