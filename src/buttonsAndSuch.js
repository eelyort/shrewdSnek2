// the next layer class which is currently running and controlling visuals/inputs
class InteractableLayer{
    constructor(documentIn, gamePanelIn){
        // alert("Beginning of InteractableLayer constructor");
        this.isRunning = false;
        this.myDocument = documentIn;
        this.myGamePanel = gamePanelIn;
        this.myGamePanel.style.zIndex = "1";

        // setup onResize
        this.myDocument.getElementsByTagName("BODY")[0].onresize = (this.onResizeFunc).bind(this);
        // alert("End of InteractableLayer constructor");
    }
    run(){
        // left empty on purpose
    }
    // called when window is resized
    onResizeFunc(){

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
        this.size--;
        return valOut;
    }
    peek(){
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
    // creates a button, from initialization to HTML creation
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, buttonText, parentElement, documentButton, buttonFunc){
        // initialize variables
        this.buttonText = buttonText;
        this.myButtonFunc = buttonFunc;
        this.xTopLeft = xTopLeft;
        this.yTopLeft = yTopLeft;
        this.widthButton = widthButton;
        this.heightButton = heightButton;
        this.myParent = parentElement;

        // HTML stuff
        // create HTML button
        this.myButton = documentButton.createElement("button");
        this.myButton.innerHTML = this.buttonText;
        this.myButton.classList.add("gameButton");

        // append to document
        this.myParent.appendChild(this.myButton);

        // set properties
        // function
        this.myButton.addEventListener("click", this.eventButtonClicked.bind(this));

        // so its "above" the canvas
        this.myButton.style.position = "absolute";
        this.myButton.style.zIndex = (parseInt(this.myParent.style.zIndex) + 1).toString(10);

        // position
        // given percentage coords (0-1)
        // if(this.isPercentage) {
        this.myButton.style.left = (this.xTopLeft * 100.0).toString(10) + "%";
        this.myButton.style.top = (this.yTopLeft * 100.0).toString(10) + "%";
        this.myButton.style.width = (this.widthButton * 100.0).toString(10) + "%";
        this.myButton.style.height = (this.heightButton * 100.0).toString(10) + "%";
        // }
        // // given absolute coords
        // else{
        //     this.myButton.style.left = (this.xTopLeft).toString() + "px";
        //     this.myButton.style.top = (this.yTopLeft).toString() + "px";
        //     this.myButton.style.width = (this.widthButton).toString() + "px";
        //     this.myButton.style.height = (this.heightButton).toString() + "px";
        // }
    }
    eventButtonClicked(){
        // alert("Parent");
        this.myButtonFunc();
    }
}

// button that toggles between functions
class ButtonHTMLToggle extends ButtonHTML{
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, buttonTexts, parentElement, documentButton, buttonFuncs){
        super(xTopLeft, yTopLeft, widthButton, heightButton, buttonTexts[0], parentElement, documentButton, null);
        // what function the toggle is currently on
        this.funcIndex = 0;
        this.myButtonFunctions = buttonFuncs;
        this.buttonTexts = buttonTexts;
    }
    toggleButtonFunc(){
        this.myButtonFunctions[this.funcIndex]();
        this.myButton.innerHTML = this.buttonTexts[((this.funcIndex === this.myButtonFunctions.length - 1) ? (0) : (this.funcIndex + 1))];
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

// a select box merged with a button
class SelectButton{
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, buttonText, parentElement, documentButton, buttonFunc, percentSelectvsButton, options){
        // initialize variables
        this.buttonText = buttonText;
        this.myButtonFunc = buttonFunc;
        this.xTopLeft = xTopLeft;
        this.yTopLeft = yTopLeft;
        this.widthButton = widthButton;
        this.heightButton = heightButton;
        this.percentSelectvsButton = percentSelectvsButton;
        this.myOptions = options;
        this.myDocument = documentButton;

        // HTML stuff
        // container
        this.mySelectContainer = this.myDocument.createElement("div");
        this.mySelectContainer.classList.add("selectContainer");
        parentElement.appendChild(this.mySelectContainer);
        // so its "above" the canvas
        this.mySelectContainer.style.position = "absolute";
        this.mySelectContainer.style.zIndex = "5";
        // position
        this.mySelectContainer.style.left = (this.xTopLeft * 100.0).toString(10) + "%";
        this.mySelectContainer.style.top = (this.yTopLeft * 100.0).toString(10) + "%";
        this.mySelectContainer.style.width = (this.widthButton * 100.0).toString(10) + "%";
        this.mySelectContainer.style.height = (this.heightButton * 100.0).toString(10) + "%";

        // select
        this.mySelect = this.myDocument.createElement("select");
        this.mySelect.classList.add("select");
        this.mySelectContainer.appendChild(this.mySelect);
        // position
        this.mySelect.style.width = (this.percentSelectvsButton * 100.0).toString(10) + "%";
        // this.mySelect.style.zIndex = "6";
        // positions
        for (let i = 0; i < options.length; i++) {
            let curr = this.myDocument.createElement("option");
            curr.value = i.toString(10);
            curr.innerHTML = this.myOptions[i];
            this.mySelect.appendChild(curr);
        }

        // button
        this.myButton = this.myDocument.createElement("button");
        this.myButton.classList.add("selectButton");
        this.mySelectContainer.appendChild(this.myButton);

        this.myButton.innerHTML = this.buttonText;
        this.myButton.style.width = (100.0 - (this.percentSelectvsButton * 100.0)).toString(10) + "%";
        // this.myButton.style.zIndex = "6";
        this.myButton.addEventListener("click", this.onPress.bind(this));
    }
    // adds another option, TODO: call on import snake from file
    addOption(option){
        let curr = this.myDocument.createElement("option");
        curr.value = (this.myOptions.length).toString(10);
        curr.innerHTML = option;
        this.mySelect.appendChild(curr);

        this.myOptions.append(option);
    }
    // calls callback with the id of the selection
    onPress(){
        this.myButtonFunc(parseInt(this.mySelect.value));
    }
}

// class which creates a pop up which is constantly loaded and hidden from view
// assuming coords in percentage (0-1) and the popUp fills the screen and is centered
class PopUp{
    constructor(left, top, gamePanel, documentPopUp){
        this.myLeft = left;
        this.myTop = top;
        this.myWidth = 1 - (2 * this.myLeft);
        this.myHeight = 1 - (2 * this.myTop);

        this.myGamePanel = gamePanel;
        this.myDocument = documentPopUp;
        this.isShowing = true;

        // create the card on which the popup sits
        this.myCard = this.myDocument.createElement("div");
        this.myCard.classList.add("popUp-card");
        this.myGamePanel.appendChild(this.myCard);

        // position
        this.myCard.style.position = "absolute";
        this.myCard.style.left = (this.myLeft * 100.0).toString(10) + "%";
        this.myCard.style.top = (this.myTop * 100.0).toString(10) + "%";
        this.myCard.style.width = (this.myWidth * 100.0).toString(10) + "%";
        this.myCard.style.height = (this.myHeight * 100.0).toString(10) + "%";
        this.myCard.style.zIndex = "6";

        // buttons, eventListeners MUST be removed on hide
        this.myButtons = [
            new ButtonHTML(.3, .875, .4, .075, "done", this.myCard, this.myDocument, (function () {
                this.intermediateFunction(this.hidePopUp.bind(this));
            }).bind(this))
        ];

        // hidden by default
        this.hidePopUp();
    }
    showPopUp(){
        this.myCard.style.display = "initial";
        this.isShowing = true;
    }
    hidePopUp(){
        this.myCard.style.display = "none";
        this.isShowing = false;
        // alert("Hide pop up")
    }
    // function which ALL event listeners should call
    // makes nothing happen if the display is hidden
    intermediateFunction(func){
        // alert("intermediateFunction():" + func);
        if(this.isShowing){
            func();
        }
        else{
            // do nothing
            // alert("doing nothing");
        }
    }
}

// popup to select which snake to run
class SelectSnakePopUp extends PopUp{
    constructor(left, top, optionsArr, percentTop, gamePanel, documentPopUp){
        super(left, top, gamePanel, documentPopUp);

        // option of the snakes to choose from
        this.optionsArr = optionsArr;

        // percentage of the card the top(search) bar takes up
        this.percentTop = percentTop;
    }
    // updates the display TODO: call on upload file
    update(){

    }
}