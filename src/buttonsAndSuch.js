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
    pushFront(valueIn){
        let newNode = new QueueNode(valueIn, this.startNode);
        this.startNode = newNode;
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
    logQueue(){
        let str = "Custom Queue: ";
        let curr = this.startNode;
        while(curr != null){
            str += curr.myVal + ", ";
            curr = curr.myNext;
        }
        return str;
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
// base class which stores the html stuff
class BaseHTMLElement{
    constructor(left, top, width, height, zIndex, parentElement, document){
        this.myLeft = left;
        this.myTop = top;
        this.myWidth = width;
        this.myHeight = height;
        this.myParent = parentElement;
        this.myDocument = document;
        this.myZIndex = zIndex;
    }
    // set the dimensions according to left, top, width, height
    setDimensions(object){
        object.style.position = "absolute";
        object.style.left = (this.myLeft * 100.0).toString() + "%";
        object.style.top = (this.myTop * 100.0).toString() + "%";
        object.style.width = (this.myWidth * 100.0).toString() + "%";
        object.style.height = (this.myHeight * 100.0).toString() + "%";
        object.style.zIndex = (this.myZIndex).toString();
        this.myParent.appendChild(object);
    }
}
// button which is made using HTML
class ButtonHTML extends BaseHTMLElement{
    // creates a button, from initialization to HTML creation
    constructor(left, top, widthButton, heightButton, buttonText, parentElement, documentButton, buttonFunc){
        super(left, top, widthButton, heightButton, 3, parentElement, documentButton);
        // initialize variables
        this.buttonText = buttonText;
        this.myButtonFunc = buttonFunc;
        // this.xTopLeft = xTopLeft;
        // this.yTopLeft = yTopLeft;
        // this.widthButton = widthButton;
        // this.heightButton = heightButton;
        // this.myParent = parentElement;

        // HTML stuff
        // create HTML button
        this.myButton = this.myDocument.createElement("button");
        this.myButton.innerHTML = this.buttonText;
        this.myButton.classList.add("gameButton");

        // append to document
        // this.myParent.appendChild(this.myButton);

        // set properties
        // function
        this.myButton.addEventListener("click", this.eventButtonClicked.bind(this));

        // so its "above" the canvas
        // this.myButton.style.position = "absolute";
        this.myButton.style.zIndex = (parseInt(this.myParent.style.zIndex) + 1).toString();

        // position
        // given percentage coords (0-1)
        // if(this.isPercentage) {
        // this.myButton.style.left = (this.myLeft * 100.0).toString() + "%";
        // this.myButton.style.top = (this.myTop * 100.0).toString() + "%";
        // this.myButton.style.width = (this.myWidth * 100.0).toString() + "%";
        // this.myButton.style.height = (this.myHeight * 100.0).toString() + "%";
        this.setDimensions(this.myButton);
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
class SelectButton extends BaseHTMLElement{
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, buttonText, parentElement, documentButton, buttonFunc, percentSelectvsButton, options){
        super(xTopLeft, yTopLeft, widthButton, heightButton, 3, parentElement, documentButton);
        // initialize variables
        this.buttonText = buttonText;
        this.myButtonFunc = buttonFunc;
        // this.xTopLeft = xTopLeft;
        // this.yTopLeft = yTopLeft;
        // this.widthButton = widthButton;
        // this.heightButton = heightButton;
        this.percentSelectvsButton = percentSelectvsButton;
        this.myOptions = options;
        // this.myDocument = documentButton;

        // HTML stuff
        // container
        this.mySelectContainer = this.myDocument.createElement("div");
        this.mySelectContainer.classList.add("selectContainer");
        // this.myParent.appendChild(this.mySelectContainer);
        // so its "above" the canvas
        // this.mySelectContainer.style.position = "absolute";
        // this.mySelectContainer.style.zIndex = "5";
        // position
        this.setDimensions(this.mySelectContainer);
        // this.mySelectContainer.style.left = (this.myLeft * 100.0).toString() + "%";
        // this.mySelectContainer.style.top = (this.myTop * 100.0).toString() + "%";
        // this.mySelectContainer.style.width = (this.myWidth * 100.0).toString() + "%";
        // this.mySelectContainer.style.height = (this.myHeight * 100.0).toString() + "%";

        // select
        this.mySelect = this.myDocument.createElement("select");
        this.mySelect.classList.add("select");
        this.mySelectContainer.appendChild(this.mySelect);
        // position
        this.mySelect.style.width = (this.percentSelectvsButton * 100.0).toString() + "%";
        // this.mySelect.style.zIndex = "6";
        // positions
        for (let i = 0; i < options.length; i++) {
            let curr = this.myDocument.createElement("option");
            curr.value = i.toString();
            curr.innerHTML = this.myOptions[i];
            this.mySelect.appendChild(curr);
        }

        // button
        this.myButton = this.myDocument.createElement("button");
        this.myButton.classList.add("selectButton");
        this.mySelectContainer.appendChild(this.myButton);

        this.myButton.innerHTML = this.buttonText;
        this.myButton.style.width = (100.0 - (this.percentSelectvsButton * 100.0)).toString() + "%";
        // this.myButton.style.zIndex = "6";
        this.myButton.addEventListener("click", this.onPress.bind(this));
    }
    // adds another option, TODO: call on import snake from file
    addOption(option){
        let curr = this.myDocument.createElement("option");
        curr.value = (this.myOptions.length).toString();
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
class PopUp extends BaseHTMLElement{
    constructor(left, top, gamePanel, documentPopUp){
        super(left, top, 1 - (2 * left), 1 - (2 * top), 6, gamePanel, documentPopUp);
        // this.myLeft = left;
        // this.myTop = top;
        // this.myWidth = 1 - (2 * this.myLeft);
        // this.myHeight = 1 - (2 * this.myTop);

        // this.myGamePanel = gamePanel;
        // this.myDocument = documentPopUp;
        this.isShowing = true;

        // alert("PopUp, myDoc: " + this.myDocument);
        // create the card on which the popup sits
        this.myCard = this.myDocument.createElement("div");
        this.myCard.classList.add("popUp-card");
        // this.myParent.appendChild(this.myCard);

        // position
        this.setDimensions(this.myCard);
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
    constructor(left, top, gamePanel, documentPopUp, optionsArr){
        super(left, top, gamePanel, documentPopUp);

        this.myCard.classList.add("selectPopUp-card");

        // option of the snakes to choose from
        this.optionsArr = optionsArr;

        // // percentage of the card the top(search) bar takes up
        // this.percentTop = percentTop;

        // create the select carousel on top
        // offset of carousel from left/right TODO: put this in constants or css?
        this.xOffset = 0.02;
        this.carouselHeight = 0.15;
        this.mySelectCarousel = new SelectCarousel(this.myLeft + this.xOffset, this.myTop, this.myWidth - (2 * this.xOffset), this.carouselHeight, this.myCard, this.myDocument, 4.1, 0.90, 0.80, this.optionsArr);

        // alert("SelectSnakePopUp");
    }
    // updates the display TODO: call on upload file
    update(){

    }
}

// alternative button which uses an image instead of text
class ImgButton extends BaseHTMLElement{
    constructor(left, top, width, height, zIndex, parentElement, document, src, func){
        super(left, top, width, height, zIndex, parentElement, document);

        this.mySrc = src;
        this.myFunc = func;

        // console.log("ImgButton construct, document/this.myDocument: " + document + ", " + this.myDocument);

        // html stuff
        this.myButton = this.myDocument.createElement("img");
        this.myButton.src = this.mySrc;
        this.myButton.width = 100;
        this.myButton.height = 100;
        this.setDimensions(this.myButton);
        this.myButton.classList.add("imgButton");
        this.myButton.addEventListener("click", this.eventButtonClicked.bind(this));
    }
    eventButtonClicked(){
        this.myFunc();
    }
}
// button which goes on press and keeps going as long as hold rather than click
class pressHoldImgButton extends ImgButton{
    constructor(left, top, width, height, zIndex, parentElement, document, src, func, delay){
        super(left, top, width, height, zIndex, parentElement, document, src, func);

        // delay (ms) between activations
        this.myDelay = delay;
        // is it currently pressed
        this.isPressed = false;

        // press listener
        this.myButton.addEventListener("mousedown", this.onPress.bind(this));
        // unpress listener
        this.myButton.addEventListener("mouseup", this.onRelease.bind(this));
        // this.myButton.addEventListener("mouseleave", this.onRelease.bind(this));
        this.myButton.addEventListener("dragleave", this.onRelease.bind(this));
    }
    onPress(){
        console.log("press");
        this.isPressed = true;
        this.causeEffect();
    }
    onRelease(){
        console.log("release");
        this.isPressed = false;
    }
    // runs the effect
    causeEffect(){
        if(this.isPressed) {
            this.myFunc();
            setTimeout(this.causeEffect.bind(this), this.myDelay);
        }
    }
    eventButtonClicked() {
        // do nothing
    }
}

// warning: first attempt below
// carousel to select
//  plan: options are little cards, show a set x at once, others hidden to sides, transitions
class SelectCarousel extends BaseHTMLElement{
    constructor(left, top, width, height, parentElement, document, numMembersOnScreen, scaleGradient, opacityGradient, carouselMembers){
        super(left, top, width, height, 7, parentElement, document);
        this.mySnakes = carouselMembers;

        // create this HTML object (wrapper)
        this.myWrapper = this.myDocument.createElement("div");
        this.myParent.appendChild(this.myWrapper);
        this.setDimensions(this.myWrapper);
        this.myWrapper.classList.add("selectCarouselWrapper");

        // index of the currently selected member in "myMembers"
        this.currentlyFocused = 0;
        this.currentlySelected = 0;
        this.percentageCenter = numMembersOnScreen;
        this.halfMaxMembers = this.percentageCenter/2;

        // calculate parameters
        // Constants
        this.scaleGradient = scaleGradient;
        this.opacityGradient = opacityGradient;
        this.overlapMulti = 0.9;
        // style info for center piece
        this.centerWidth = 1.0/this.percentageCenter;
        this.startLeft = this.centerWidth * this.halfMaxMembers - this.centerWidth/2;

        // create members
        this.myMembers = [];
        this.createMembers();

        // alert("this.mySnakes = " + this.mySnakes);

        // set selected
        this.setFocus(0);

        // move queue
        this.moveQueue = new CustomQueue();

        // left and right buttons TODO: constant variables?
        this.leftButton = new pressHoldImgButton(0.02, 0.08, .076, 0.92, this.myZIndex + this.myMembers.length + 1, this.myWrapper, this.myDocument, "left-arrow.png", function (){this.bufferMove(-1)}.bind(this), 130);
        this.leftButton.myButton.classList.add("selectImgButton");
        this.rightButton = new pressHoldImgButton(0.92, 0.08, .076, 0.92, this.myZIndex + this.myMembers.length + 1, this.myWrapper, this.myDocument, "right-arrow.png", function (){this.bufferMove(1)}.bind(this),130);
        this.rightButton.myButton.classList.add("selectImgButton");
    }
    // function which updates myMembers to account for newly loaded members and whatnot
    createMembers(){
        if(this.myMembers.length < this.mySnakes.length){
            for (let i = this.myMembers.length; i < this.mySnakes.length; i++) {
                let curr = this.mySnakes[i];
                this.myMembers.push(new SelectCarouselMember(this.startLeft, i, function () {
                    this.clicked(i);
                }.bind(this), curr.name, this.centerWidth, this.myWrapper, this.myDocument));
            }
        }
    }
    // helper function which sets the style of all elements
    setFocus(){
        // alert("Top of getSelected (line 407), this.myMembers = " + this.myMembers);
        // alert(" ^^ centerWidth = " + this.centerWidth + ", this.maxMembers = " + this.maxMembers);
        for (let i = 0; i < this.myMembers.length; i++) {
            // distance from selected
            let dist = Math.abs(this.currentlyFocused - i);

            let curr = this.myMembers[i].myCard;

            // reset scale for thingies
            curr.style.transform = "";

            let currScale = Math.pow(this.scaleGradient, dist);
            let xTranslate;
            // set left
            // left of center
            if (i < this.currentlyFocused) {
                // curr.style.left = ((this.centerWidth * Math.max(-1, (Math.floor(this.maxMembers/2) - dist)) + ((1-currScale)/2) * this.centerWidth) * 100.0).toString() + "%";
                // tempTransform += "translate(" + (Math.max(-1, (Math.floor(this.maxMembers/2) - dist)) * 100).toString() + "%, 0)";
                xTranslate = (-dist) * this.overlapMulti;
            }
            // center element
            else if(i == this.currentlyFocused){
                // curr.style.left = ((this.centerWidth * Math.floor(this.maxMembers/2)) * 100.0).toString() + "%";
                // tempTransform += "translate(" + ((Math.floor(this.maxMembers/2)) * 100).toString() + "%, 0)";
                xTranslate = 0;
            }
            // right of center
            else {
                // alert("line 429, i = " + i + ", dist = " + dist + ", currScale = " + currScale + "\n bleh = " + Math.min(this.maxMembers, Math.floor(this.maxMembers/2) + dist) + ((1-currScale)/2));
                // curr.style.left = ((this.centerWidth * (Math.min(this.maxMembers, Math.floor(this.maxMembers/2) + dist) + ((1-currScale)/2))) * 100.0).toString() + "%";
                // tempTransform += "translate(" + (Math.min(this.maxMembers, (Math.floor(this.maxMembers/2) + dist)) * 100).toString() + "%, 0)";
                xTranslate = dist * this.overlapMulti;
            }

            // set top
            curr.style.top = ((currScale/2) * this.myHeight).toString() + "%";

            // set z-index
            curr.style.zIndex = (this.myZIndex + (this.myMembers.length - dist)).toString();

            // anything outside the select wrapper isn't shown
            let currWidth = currScale*this.centerWidth;
            let actualDisplacement = xTranslate * currWidth;
            // scaling causes a little gap between "left" and where it actually starts
            let currStartLeft = this.startLeft + (this.centerWidth-currWidth)/2;
            // console.log("i: " + i + ", temp: " + temp);
            if(actualDisplacement < -currStartLeft){
                xTranslate = -currStartLeft/(currWidth);
                // console.log("xTranslate: " + xTranslate);
                // console.log("currWidth: " + currWidth);
                // console.log("xTrans * currW: " + currWidth*xTranslate);
                // console.log("this.startLeft: " + this.startLeft);
                // console.log("this.width: " + curr.style.width);
                this.myMembers[i].unshow();
            }
            else if(actualDisplacement > 1 - currWidth - currStartLeft){
                xTranslate = (1 - currWidth - currStartLeft)/currWidth;
                this.myMembers[i].unshow();
            }
            else{
                curr.style.opacity = (Math.pow(this.opacityGradient, dist) * 100.0).toString() + "%";
                this.myMembers[i].show();
            }
            
            let yTranslate = (1-currScale)/2;

            // set transform
            // console.log("tempTransform: " + tempTransform);
            curr.style.transform = "scale(" + currScale + ") " +
                "translate(" + (xTranslate * 100).toString() + "%, " + (yTranslate*100).toString() + "%)";
        }
    }
    // move queue to try and stop the jerking
    bufferMove(dir){
        // console.log("bufferMove: " + dir);
        // console.log("moveQueue: " + this.moveQueue);
        this.moveQueue.enqueue(dir);
        // this.moveQueue.logQueue();
        // console.log("moveQueue.peek(): " + this.moveQueue.peek());
        if(this.moveQueue.size == 1){
            this.move();
        }
    }
    // move
    // right is +, left is -
    move(){
        console.log("top of move: " + this.moveQueue.logQueue());
        let dir = this.moveQueue.poll();
        // console.log("move: " + dir);
        // console.log("move(" + dir + ")");
        if(dir < 0 && this.currentlyFocused > 0){
            this.currentlyFocused--;
            dir++;
        }
        else if(dir > 0 && this.currentlyFocused < this.myMembers.length - 1){
            this.currentlyFocused++;
            dir--;
        }
        else{
            dir = 0;
        }
        this.setFocus();
        if(dir !== 0){
            this.moveQueue.pushFront(dir);
            console.log("dir: " + dir);
            console.log(this.moveQueue.logQueue());
        }
        if(this.moveQueue.size > 0) {
            // TODO: these are constants? move to variables?
            setTimeout(function () {
                this.move();
            }.bind(this), 83 + 9 / (Math.abs(this.moveQueue.size + dir)));
        }
    }
    // what the members call when clicked
    clicked(index){
        console.log("Select carousel index clicked: " + index);
        this.bufferMove(index - this.currentlyFocused);
    }
}
class SelectCarouselMember extends BaseHTMLElement{
    constructor(startLeft, myIndex, myFunction, myText, initWidth, parentElement, document){
        super(startLeft, 0, initWidth, 1, parentElement, document);

        this.myIndex = myIndex;
        this.myFunction = myFunction;
        this.myText = myText;
        this.myParent = parentElement;
        this.myDocument = document;

        this.shown = true;

        // setup html
        this.myCard = this.myDocument.createElement("div");
        this.myCard.classList.add("selectCarouselMember");
        this.myParent.appendChild(this.myCard);
        this.myCard.addEventListener("click", this.intermediateFunc.bind(this));
        this.myP = this.myDocument.createElement("div");
        this.myCard.appendChild(this.myP);
        this.myP.innerText = this.myText;

        // width
        this.setDimensions(this.myCard);
    }
    // intercepts event listener to not trigger if hidden
    intermediateFunc(){
        // console.log("intermediatefunc, shown: " + this.shown);
        if(this.shown){
            this.myFunction();
        }
    }
    unshow(){
        this.shown = false;
        this.myCard.style.opacity = "0";
    }
    show(){
        this.shown = true;
    }
}