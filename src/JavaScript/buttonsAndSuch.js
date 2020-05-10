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

        this.myMainObject = null;
    }
    // set the dimensions according to left, top, width, height
    //  option to add flexbox - removes style info and adds flexGrow
    setDimensions(object, flexBox = false, flexGrow = 0){
        this.myMainObject = object;

        this.myMainObject.style.zIndex = (this.myZIndex).toString();
        this.myParent.appendChild(object);

        this.myMainObject.classList.add("absolute");
        this.myMainObject.style.left = (this.myLeft * 100.0).toString() + "%";
        this.myMainObject.style.top = (this.myTop * 100.0).toString() + "%";
        this.myMainObject.style.width = (this.myWidth * 100.0).toString() + "%";
        this.myMainObject.style.height = (this.myHeight * 100.0).toString() + "%";
    }
    // adds flexbox - removes style info and adds flexGrow
    addFlex(flexGrow){
        this.myFlexGrow = flexGrow;

        // add flex to parent
        if(!this.myParent.classList.contains("flexParent")){
            this.myParent.classList.add("flexParent");
        }

        this.myMainObject.style.left = "";
        this.myMainObject.style.top = "";
        this.myMainObject.style.width = "";
        this.myMainObject.style.height = "";

        this.myMainObject.classList.add("flexboxBasic");
        this.myMainObject.style.flexGrow = this.myFlexGrow.toString();
    }
}
// button which is made using HTML
class ButtonHTML extends BaseHTMLElement{
    // creates a button, from initialization to HTML creation
    constructor(left, top, widthButton, heightButton, zIndex, parentElement, documentButton, buttonText, buttonFunc){
        super(left, top, widthButton, heightButton, zIndex, parentElement, documentButton);
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
        this.changeText(this.buttonText);
        this.myButton.classList.add("gameButton");
        this.myButton.classList.add("button");

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
        this.blurClick();
    }
    // removes the focus on the button
    blurClick(){
        if(this.myDocument.activeElement != null){
            this.myDocument.activeElement.blur();
        }
    }
    changeText(txt){
        this.buttonText = txt;
        this.myButton.innerHTML = this.buttonText;
    }
}

// button that toggles between functions
class ButtonHTMLToggle extends ButtonHTML{
    constructor(left, top, widthButton, heightButton, zIndex, parentElement, documentButton, buttonTexts, buttonFuncs){
        super(left, top, widthButton, heightButton, zIndex, parentElement, documentButton, buttonTexts[0], null);
        // what function the toggle is currently on
        this.funcIndex = 0;
        this.myButtonFunctions = buttonFuncs;
        this.buttonTexts = buttonTexts;
    }
    toggleButtonFunc(){
        this.myButtonFunctions[this.funcIndex]();
        this.gotoIndex((this.funcIndex === this.myButtonFunctions.length - 1) ? (0) : (this.funcIndex + 1));
    }
    gotoIndex(index){
        this.funcIndex = index;
        this.myButton.innerHTML = this.buttonTexts[this.funcIndex];
    }
    eventButtonClicked() {
        // alert("Child");
        this.toggleButtonFunc();
        this.blurClick();
    }
    changeText(txt) {
        // do nothing
        alert("trying to change text of toggle button, doesn't work");
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
        this.myButton.width = 1000;
        this.myButton.height = 1000;
        this.setDimensions(this.myButton);
        this.myButton.classList.add("imgButton");
        this.myButton.classList.add("button");
        this.myButton.addEventListener("click", this.eventButtonClicked.bind(this));

        this.methodGetWidthHeight = -1;

        this.onResize();
    }
    eventButtonClicked(){
        this.myFunc();
        this.blurClick();
    }
    // removes the focus on the button
    blurClick(){
        if(this.myDocument.activeElement != null){
            this.myDocument.activeElement.blur();
        }
    }
    onResize(){
        let totWidth;
        let totHeight;
        if(this.methodGetWidthHeight == 0) {
            totWidth = this.myParent.getBoundingClientRect().width;
            totHeight = this.myParent.getBoundingClientRect().height;
        }
        else if(this.methodGetWidthHeight == 1){
            totWidth = this.myParent.clientWidth;
            totHeight = this.myParent.clientHeight;
        }
        else if(this.methodGetWidthHeight == -1){
            if(this.myParent.getBoundingClientRect().width != 0){
                this.methodGetWidthHeight = 0;
            }
            else if(this.myParent.clientWidth != 0){
                this.methodGetWidthHeight = 1;
            }
            else{
                console.log("onResize() could not find method");
                return;
            }
            this.onResize();
            return;
        }
        let maxWidth = this.myWidth * totWidth;
        let maxHeight = this.myHeight * totHeight;

        let side = Math.min(maxHeight, maxWidth);
        this.myButton.style.left = (this.myLeft * totWidth + (maxWidth - side)/2).toString() + "px";
        this.myButton.style.top = (this.myTop * totHeight + (maxHeight - side)/2).toString() + "px";
        this.myButton.style.width = (side).toString() + "px";
        this.myButton.style.height = (side).toString() + "px";
    }
}
// button which goes on press and keeps going as long as hold rather than click
class PressHoldImgButton extends ImgButton{
    constructor(left, top, width, height, zIndex, parentElement, document, src, func, delay, releaseFunc = null){
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

        // release function
        if(releaseFunc == null){
            this.myReleaseFunc = function () {
                // nothing
            };
        }
        else{
            this.myReleaseFunc = releaseFunc;
        }
    }
    onPress(){
        // console.log("press");
        this.isPressed = true;
        this.causeEffect();
    }
    onRelease(){
        // console.log("release");
        this.isPressed = false;
        this.myReleaseFunc();
    }
    // runs the effect
    causeEffect(){
        if(this.isPressed) {
            this.myFunc();
            setTimeout(this.causeEffect.bind(this), this.myDelay);
        }
        this.blurClick()
    }
    eventButtonClicked() {
        // do nothing
    }
}
// button that toggles between functions
class ImgButtonHTMLToggle extends ImgButton{
    constructor(left, top, width, height, zIndex, parent, doc, srcs, funcs){
        super(left, top, width, height, zIndex, parent, doc, srcs[0], null);
        // what function the toggle is currently on
        this.funcIndex = 0;
        this.mySRCs = srcs;
        this.myToggleFuncs = funcs;
    }
    toggleFunc(){
        this.myToggleFuncs[this.funcIndex]();
        this.gotoIndex((this.funcIndex === this.myToggleFuncs.length - 1) ? (0) : (this.funcIndex + 1));
    }
    gotoIndex(index){
        this.funcIndex = index;
        this.myButton.src = this.mySRCs[this.funcIndex];
    }
    eventButtonClicked() {
        this.toggleFunc();
        this.blurClick();
    }
}

// handler that automatically sets up eventlisteners for hover/unhover
class HoverHandler{
    constructor(obj, onHover, unHover){
        this.obj = obj;
        this.onHover = onHover;
        this.unHover = unHover;

        // hover
        this.obj.addEventListener("dragenter", this.onHover);
        this.obj.addEventListener("mouseenter", this.onHover);

        // unhover
        this.obj.addEventListener("dragleave", this.unHover);
        this.obj.addEventListener("mouseleave", this.unHover);
    }
}

// class which creates a pop up which is constantly loaded and hidden from view
// assuming coords in percentage (0-1) and the popUp fills the screen and is centered
class PopUp extends BaseHTMLElement{
    constructor(left, top, zIndex, gamePanel, documentPopUp){
        super(left, top, 1 - (2 * left), 1 - (2 * top), zIndex, gamePanel, documentPopUp);
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
        this.myCard.classList.add("background");
        // this.myParent.appendChild(this.myCard);

        // position
        this.setDimensions(this.myCard);
        this.myCard.style.zIndex = "6";

        // buttons, eventListeners MUST be removed on hide
        // this.myButtons = [
        //     // new ButtonHTML(.3, .875, .4, .075, 4, this.myCard, this.myDocument, "Done", (function () {
        //     //     this.intermediateFunction(this.hidePopUp.bind(this));
        //     // }).bind(this))
        //     // new ImgButton(.95, .05, .05, .05, 12, this.myCard, this.myDocument, "./src/Images/x-button-512x512.png", function () {
        //     //         this.intermediateFunction(this.hidePopUp.bind(this));
        //     //     }.bind(this))
        // ];

        // listen for clicks outside the popup
        this.myDocument.addEventListener("click", function (click) {
            // console.log("click: " + click);
            this.intermediateFunction(function (){this.clickedOutside(click)}.bind(this));
        }.bind(this));
        this.onCooldown = false;

        // hidden by default
        this.hidePopUp();
    }
    showPopUp(){
        this.myCard.style.display = "initial";
        this.onCooldown = true;
        setTimeout(function () {
            this.isShowing = true;
            this.onCooldown = false;
        }.bind(this), 5);
        this.onResize();
    }
    hidePopUp(){
        this.myCard.style.display = "none";
        this.isShowing = false;
        // alert("Hide pop up")
    }
    // hides the popup when clicked outside the popup
    clickedOutside(click){
        // console.log("Top of clickedOutside");
        if(!this.onCooldown && !this.myCard.contains(click.target)){
            this.hidePopUp();
        }
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
    onResize(){

    }
}

// drawing popup
class DrawPopUp extends PopUp{
    constructor(left, top, zIndex, gamePanel, documentPopUp, size){
        super(left, top, zIndex, gamePanel, documentPopUp);
        this.size = size;

        // canvas
        this.canvas = this.myDocument.createElement("canvas");
        this.canvas.classList.add("absolute");
        this.canvas.classList.add("subGameCanvas");
        this.canvas.classList.add("background");
        this.canvas.style.backgroundColor = "#000000";
        this.gridSize = 14;
        this.canvasInnerSize = this.size * this.gridSize;
        this.canvas.width = this.canvasInnerSize;
        this.canvas.height = this.canvasInnerSize;
        this.canvasMaxWidth = 1;
        this.canvasMaxHeight = 0.8;
        this.myCard.appendChild(this.canvas);
        this.formatCanvas();

        this.ctx = this.canvas.getContext("2d");

        this.path = mothersDayWrite;
        // for redo
        this.changes = [];

        this.xOffset = 0;
        this.yOffset = 0;

        // click
        this.myDocument.addEventListener("click", function (click) {
            this.intermediateFunction(function (){this.click(click)}.bind(this));
        }.bind(this));
        // undo and output buttons
        this.myDocument.addEventListener("keypress", function (event) {
            this.keyEvent(event);
        }.bind(this));

        this.clearRedraw();
    }
    // clears and redraws everything
    clearRedraw(){
        // console.log("clearRedraw");

        // clear
        this.canvas.width = this.canvasInnerSize;
        this.canvas.height = this.canvasInnerSize;

        // grid
        this.drawGrid();

        // draw pieces
        for (let i = 0; i < this.path.length; i++) {
            this.fillRC(this.path[i][0] - this.yOffset, this.path[i][1] - this.xOffset);
        }
    }
    keyEvent(event){
        // console.log(`keyEvent: ${event}, .key: ${event.key}`);
        // undo on z
        if(event.key === 'z' || event.key === 'Z'){
            this.undo();
        }
        // redo on x
        if(event.key === 'x' || event.key === 'X'){
            this.redo();
        }
        // output on p
        if(event.key === 'p' || event.key === 'P'){
            this.output();
        }
        // clear on q
        if(event.key === 'q' || event.key === 'Q'){
            this.clearRedraw();
        }
        // shift right on right arrow (d)
        if(event.key === "d"){
            this.xOffset++;
            this.clearRedraw();
        }
        if(event.key === "a"){
            if(this.xOffset > 0) {
                this.xOffset--;
                this.clearRedraw();
            }
        }
        if(event.key === "w"){
            if(this.yOffset > 0) {
                this.yOffset--;
                this.clearRedraw();
            }
        }
        if(event.key === "s"){
            this.yOffset++;
            this.clearRedraw();
        }
    }
    click(click){
        // console.log("click");

        const rect = this.canvas.getBoundingClientRect();
        let x = click.clientX - rect.left;
        let y = click.clientY - rect.top;

        let ratio = this.canvasInnerSize/rect.width;
        x = x * ratio;
        y = y * ratio;

        let r = Math.floor(y / this.gridSize) + this.yOffset;
        let c = Math.floor(x / this.gridSize) + this.xOffset;

        let len = this.path.length;
        if(this.path.length === 0 || (Math.abs(this.path[len - 1][0] - r) === 0 && Math.abs(this.path[len - 1][1] - c) === 1) || (Math.abs(this.path[len - 1][1] - c) === 0 && Math.abs(this.path[len - 1][0] - r) === 1)){
            this.fillRC(r - this.yOffset, c - this.xOffset);
            this.path.push([r, c]);
            this.changes = [];
        }
        // console.log(this.path);
        // console.log(`x: ${x}, y: ${y}, width: ${rect.width}, r: ${r}, c: ${c}`);
    }
    // outputs in array format
    output(){
        let str = "[";
        for (let i = 0; i < this.path.length; i++) {
            str += `[${this.path[i][0]}, ${this.path[i][1]}], `;
        }
        str = ((str.length === 1) ? ("[") : (str.substring(0, str.length - 2))) + "]";
        alert(str);
        console.log(str);
    }
    fillRC(r, c){
        if(r < 0 || r >= this.size || c < 0 || c >= this.size){
            // console.log("fillRC outside range, ignore");
            return;
        }
        this.ctx.fillStyle = "#faff29";
        this.ctx.beginPath();
        this.ctx.rect(c * this.gridSize, r * this.gridSize, this.gridSize, this.gridSize);
        this.ctx.fill();
        this.ctx.closePath();
    }
    unfillRC(r, c){
        if(r < 0 || r >= this.size || c < 0 || c >= this.size){
            // console.log("unfillRC outside range, ignore");
            return;
        }

        this.ctx.fillStyle = "#979899";
        this.ctx.beginPath();
        this.ctx.rect(c * this.gridSize, r * this.gridSize, this.gridSize, this.gridSize);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.fillStyle = "#000000";
        this.ctx.beginPath();
        this.ctx.rect(c * this.gridSize + 1, r * this.gridSize + 1, this.gridSize - 2, this.gridSize - 2);
        this.ctx.fill();
        this.ctx.closePath();
    }
    // undo's last
    undo(){
        if(this.path.length > 0) {
            let last = this.path.pop();

            // this.changes = [];

            this.changes.push(last);

            this.unfillRC(last[0] - this.yOffset, last[1] - this.xOffset);
        }
    }
    redo(){
        if(this.changes.length > 0){
            let last = this.changes.pop();

            this.path.push(last);

            this.fillRC(last[0] - this.yOffset, last[1] - this.xOffset);
        }
    }
    // draws grid on canvas
    drawGrid(){
        // horizontal lines
        for (let r = 0; r < this.size; r++) {
            this.ctx.fillStyle = "#979899";
            this.ctx.beginPath();
            this.ctx.rect(0, (r * this.gridSize) + (this.gridSize - 1), this.canvas.width, 2);
            this.ctx.fill();
            this.ctx.closePath();
        }

        // verticcal lines
        for (let c = 0; c < this.size; c++) {
            this.ctx.fillStyle = "#979899";
            this.ctx.beginPath();
            this.ctx.rect((c * this.gridSize) + (this.gridSize - 1), 0, 2, this.canvas.height);
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
    formatCanvas(){
        let totWidth = this.myParent.getBoundingClientRect().width;
        let totHeight = this.myParent.getBoundingClientRect().height;
        let maxWidth = totWidth * this.canvasMaxWidth;
        let maxHeight = totHeight * this.canvasMaxHeight;

        // side length of square
        let sideLength = Math.min(maxWidth, maxHeight);

        // set properties
        let left = (-.05 * totWidth) + (maxWidth - sideLength) / 2;
        let top = (0.05 * totHeight) + (maxHeight - sideLength) / 2;
        this.canvas.style.left = (left).toString() + "px";
        this.canvas.style.top = (top).toString() + "px";
        this.canvas.style.width = (sideLength).toString(10) + "px";
        this.canvas.style.height = (sideLength).toString(10) + "px";
    }
    onResize() {
        this.formatCanvas();
    }
}

// popup to select which snake to run
class SelectSnakePopUp extends PopUp{
    constructor(left, top, zIndex, gamePanel, documentPopUp, optionsArr, selectCallback){
        super(left, top, zIndex, gamePanel, documentPopUp);

        this.myCard.classList.add("selectPopUp-card");
        this.selectCallback = selectCallback;

        // console.log("SelectSnakePopUp, selectCallback: " + this.selectCallback);

        // option of the snakes to choose from
        this.optionsArr = optionsArr;

        // // percentage of the card the top(search) bar takes up
        // this.percentTop = percentTop;

        // create the select carousel on top
        // offset of carousel from left/right TODO: put this in constants or css?
        this.xOffset = 0.02;
        this.carouselHeight = 0.10;
        this.carouselTop = 0.05;
        this.mySelectCarousel = new SelectCarousel(this.myLeft + this.xOffset, this.carouselTop, this.myWidth - (2 * this.xOffset), this.carouselHeight, 3, this.myCard, this.myDocument, 4.1, 0.90, 0.80, this.optionsArr, function (idx){this.selectCallbackIntermediate(idx)}.bind(this));

        // box in center where text is displayed
        this.myTextBox = new BaseHTMLElement(this.myLeft + this.xOffset/3, this.carouselTop + this.carouselHeight, this.myWidth - (2 * this.xOffset/3), 1 - this.carouselHeight - (2 * this.carouselTop), 0, this.myCard, this.myDocument);
        this.textWrapper = this.myDocument.createElement("div");
        this.textWrapper.classList.add("textWrapper");
        this.textWrapper.classList.add("background");
        this.myTextBox.setDimensions(this.textWrapper);

        this.typeSpeed = 8;

        // text boxes
        this.textHeight = 0.88;
        this.textWidth = 0.28;
        this.numTextBox = 3;
        let remainPadding = 1 - (this.textWidth * this.numTextBox);
        this.textPadding = remainPadding/(this.numTextBox + 1);

        // left side text box - displays the start position, start length, apple value
        this.parameterBox = new TextBox(this.textPadding, (1-this.textHeight)/2, this.textWidth, this.textHeight, 1, this.textWrapper, this.myDocument, "");
        this.parameterBox.myTextWrapper.classList.add("background");
        this.parameterBox.myTextWrapper.style.minWidth = "10vw";
        // this.parameterBox.addFlex(2);
        // TODO img here
        this.editParameterButton = new ButtonHTML(0.12, 0.92, 0.76, 0.06, 2, this.parameterBox.myTextWrapper, this.myDocument, "Edit", this.editParam.bind(this));

        // TODO: this is all temporary, add visuals or something
        // inputs
        this.inputsBox = new TextBox((2*this.textPadding) + this.textWidth, (1-this.textHeight)/2, this.textWidth, this.textHeight, 1, this.textWrapper, this.myDocument, "");
        this.inputsBox.myTextWrapper.classList.add("background");
        // this.inputsBox.addFlex(4);

        // brain
        this.brainBox = new TextBox((3*this.textPadding) + (2*this.textWidth), (1-this.textHeight)/2, this.textWidth, this.textHeight, 1, this.textWrapper, this.myDocument, "");
        this.brainBox.myTextWrapper.classList.add("background");
        // this.brainBox.addFlex(4);

        // write all the text
        this.writeAll(this.mySelectCarousel.currentlySelected);

        this.onResize();
    }
    // edit parameter
    editParam(){
        console.log("editParam()");
    }

    // master text function, writes/draws everything
    writeAll(idx){
        this.writeParameters(idx);
        this.writeInputs(idx);
        this.writeBrains(idx);
    }
    writeParameters(idx){
        let snek = this.optionsArr[idx];
        let text = `Snake Selected:\n${snek.getComponentName()}`;
        text += `\n\nDescription:\n${snek.getComponentDescription()}`;
        text += `\n\nParameters:`;
        text += `\n Grid Size:\n  ${snek.gridSize}`;
        text += `\n\n Starting Length:\n  ${snek.startLength}`;
        text += `\n\n Apple Value:\n  ${snek.appleVal}`;

        this.parameterBox.typewrite(text, this.typeSpeed);
    }
    // TODO: temp - eventually best to replace this with images/graphs
    writeInputs(idx){
        let snek = this.optionsArr[idx];
        let text = "";
        let input = snek.myInput;
        if(input.getComponentName() == "Multiple Input") {
            text += `Inputs:`;
            let curr = input.myInputs.startNode;
            while(curr != null){
                let val = curr.myVal;
                text += `\n\n${val.getComponentName()}:\n${val.getComponentDescription()}`;
                curr = curr.myNext;
            }
        }
        else{
            text += `Input:\n\n`;
            text += `${input.getComponentName()}:\n${input.getComponentDescription()}`;
        }

        this.inputsBox.typewrite(text, this.typeSpeed);
    }
    writeBrains(idx){
        let snek = this.optionsArr[idx];
        let text = "";
        let brain = snek.myBrain;

        text += `Brain:\n\n`;
        text += `${brain.getComponentName()}:\n${brain.getComponentDescription()}`;

        this.brainBox.typewrite(text, this.typeSpeed);
    }

    onResize(){
        this.mySelectCarousel.onResize();
        // this.editParameterButton.onResize();
    }
    showPopUp() {
        super.showPopUp();
        this.writeAll(this.mySelectCarousel.currentlySelected);
    }
    selectCallbackIntermediate(index){
        // change text shown
        this.writeAll(index);

        // call previous callback
        this.selectCallback(index);
    }
}

// warning: first attempt below
// carousel to select
//  plan: options are little cards, show a set x at once, others hidden to sides, transitions
class SelectCarousel extends BaseHTMLElement{
    constructor(left, top, width, height, zIndex, parentElement, document, numMembersOnScreen, scaleGradient, opacityGradient, carouselMembers, selectCallback){
        super(left, top, width, height, zIndex, parentElement, document);
        this.mySnakes = carouselMembers;

        // create this HTML object (wrapper)
        this.myWrapper = this.myDocument.createElement("div");
        // this.myParent.appendChild(this.myWrapper);
        this.setDimensions(this.myWrapper);
        this.myWrapper.classList.add("selectCarouselWrapper");
        // make the wrapper disappear
        this.myWrapper.style.backgroundColor = "rgba(0, 0, 0, 0)";

        // index of the currently selected member in "myMembers"
        this.currentlyFocused = 0;
        this.percentageCenter = numMembersOnScreen;
        this.halfMaxMembers = this.percentageCenter/2;

        // select callback
        this.selectCallback = selectCallback;

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
        this.leftButton = new PressHoldImgButton(0.02, 0.08, .076, 0.92, this.myZIndex + this.myMembers.length + 1, this.myWrapper, this.myDocument, "./src/Images/left-arrow-800x800.png", function (){this.bufferMove(-1)}.bind(this), 130);
        this.leftButton.myButton.classList.add("selectImgButton");
        this.rightButton = new PressHoldImgButton(0.92, 0.08, .076, 0.92, this.myZIndex + this.myMembers.length + 1, this.myWrapper, this.myDocument, "./src/Images/right-arrow-800x800.png", function (){this.bufferMove(1)}.bind(this),130);
        this.rightButton.myButton.classList.add("selectImgButton");

        // set the selected one
        this.currentlySelected = 0;
        this.changeSelected(0, false);

        // hover TODO: fixme
        // this.hoverHandler = new HoverHandler(this.myWrapper, this.onHover.bind(this), this.unHover.bind(this));
    }
    onResize(){
        this.leftButton.onResize();
        this.rightButton.onResize();
    }
    // hover functions
    onHover(){
        // console.log("onHover, this: " + this);
        this.myMembers[this.currentlySelected].setDimensions(this.myMembers[this.currentlySelected].myCard);
        this.setFocus();
    }
    unHover(){
        // console.log("unHover, this: " + this);
        // make the selected one expand
        let card = this.myMembers[this.currentlySelected].myCard;
        card.style.transform = "none";
        card.style.left = "0";
        card.style.top = "0";
        card.style.width = "100%";
        card.style.height = "100%";
        card.style.opacity = "100%";
        card.style.zIndex = (this.myZIndex + this.myMembers.length + 1).toString();
    }
    // function which updates myMembers to account for newly loaded members and whatnot
    createMembers(){
        if(this.myMembers.length < this.mySnakes.length){
            for (let i = this.myMembers.length; i < this.mySnakes.length; i++) {
                let curr = this.mySnakes[i];
                this.myMembers.push(new SelectCarouselMember(this.startLeft, i, function () {
                    this.clicked(i);
                }.bind(this), curr.getComponentName(), this.centerWidth, this.myWrapper, this.myDocument));
            }
        }
    }
    // helper function to change the currently selected entry
    changeSelected(newSelect, doCallback = true){
        if(this.myMembers[this.currentlySelected].myCard.classList.contains("currentlySelected")){
            this.myMembers[this.currentlySelected].myCard.classList.remove("currentlySelected");
        }
        this.currentlySelected = newSelect;
        if(doCallback) {
            this.selectCallback(this.currentlySelected);
        }
        this.myMembers[this.currentlySelected].myCard.classList.add("currentlySelected");
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
        // console.log("top of move: " + this.moveQueue.logQueue());
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
            // console.log("dir: " + dir);
            // console.log(this.moveQueue.logQueue());
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
        // console.log("Select carousel index clicked: " + index);
        if(index != this.currentlyFocused) {
            this.bufferMove(index - this.currentlyFocused);
            // TODO: different selected than focused?
            this.changeSelected(index);
        }
        else{
            this.changeSelected(index);
        }
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
        this.myCard.classList.add("background");
        this.myCard.classList.add("selectCarouselMember");
        this.myCard.addEventListener("click", this.intermediateFunc.bind(this));
        // this.myP = this.myDocument.createElement("div");
        // this.myCard.appendChild(this.myP);
        // this.myP.innerText = this.myText;

        this.myCenteredTextBox = new CenteredTextBox(0, 0, 1, 1, this.myZIndex + 1, this.myCard, this.myDocument, this.myText);

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

// html text box
class TextBox extends BaseHTMLElement{
    constructor(left, top, width, height, zIndex, parent, document, text){
        super(left, top, width, height, zIndex, parent, document);

        this.myText = text;

        // wrapper
        this.myTextWrapper = this.myDocument.createElement("div");
        this.setDimensions(this.myTextWrapper);
        this.myTextWrapper.classList.add("textBoxWrapper");
        // this.myTextWrapper.classList.add("background");

        // text
        this.myTextBox = this.myDocument.createElement("div");
        this.myTextWrapper.appendChild(this.myTextBox);
        // this.myTextBox.style.whiteSpace = "pre";
        this.changeText(this.myText);

        // prevent threading issues
        this.currthreadID = 0;
        this.currentlyDisplayed = "";
    }
    changeText(text){
        // console.log(`changeText(${text}) called in TextBox changeText()`);
        this.myText = text;
        this.changeCurrDisplay(text);
    }
    changeCurrDisplay(text){
        this.currentlyDisplayed = text;
        this.myTextBox.innerText = this.currentlyDisplayed;
    }
    // typewriter
    typewrite(txt, speed, /*optionalFunc = null*/){
        this.myText = txt;
        // kill previous thread
        if(this.currthreadID >= 1000){
            this.currthreadID = 0;
        }
        else{
            this.currthreadID++;
        }
        this.myTextBox.innerText = "";
        this.currentlyDisplayed = "";

        // console.log("typewrite: currThreadID: " + this.currthreadID);

        this.typewritePRIVATE(0, speed, this.currthreadID, /*optionalFunc*/);
    }
    // internal private
    typewritePRIVATE(i, speed, threadID, /*optionalFunc*/){
        // console.log(`typewritePRIVATE(${i}, ${speed}) called\n this.myText: "${this.myText}"\n this.myTextBox.innerText: "${this.myTextBox.innerText}"`);
        // already finished
        if(i >= this.myText.length || threadID != this.currthreadID){
            return;
        }
        // output one char
        let char = this.myText.charAt(i);
        let prevChar = "";
        if(i > 0){
            prevChar = this.myText.charAt(i-1);
        }
        // check for whitespace cuz html doesn't like it lol
        if (char == " " && i > 0 && (prevChar == ":" || prevChar == "\n" || prevChar == " ")) {
            char = "\xa0";
        }
        if(char == "\n" || char == "\r"){
            char = String.fromCharCode(10) + " ";
        }
        this.changeCurrDisplay(this.currentlyDisplayed + char);
        i++;

        // // call optional func
        // if(optionalFunc != null){
        //     optionalFunc();
        // }
        setTimeout(function () {
            this.typewritePRIVATE(i, speed, threadID);
        }.bind(this), speed);
    }
}

// vertically centered text box which works on same system as the rest of the buttons and whatnot, can horizontally align text
class VertCenteredTextBox extends TextBox{
    constructor(left, top, width, height, zIndex, parent, document, text, alignment){
        super(left, top, width, height, zIndex, parent, document, text);

        // to get the vert centering
        this.myTextWrapper.classList.add("vertTextBoxWrapper");

        // to get horizontal alignment
        this.myTextWrapper.classList.add(alignment);
    }
}
// centered text box which works on same system as the rest of the buttons and whatnot
class CenteredTextBox extends VertCenteredTextBox {
    constructor(left, top, width, height, zIndex, parent, document, text){
        super(left, top, width, height, zIndex, parent, document, text, "center");
    }
}