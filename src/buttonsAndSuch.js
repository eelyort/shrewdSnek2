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
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, parentElement, documentButton, myButtonFunc){
        // initialize variables
        // given percentage coords (0-1)
        if(isPercentage) {
            this.xTopLeft = Math.floor(xTopLeft * parentElement.offsetHeight);
            this.yTopLeft = Math.floor(yTopLeft * parentElement.offsetHeight);
            this.widthButton = Math.floor(widthButton * parentElement.offsetHeight);
            this.heightButton = Math.floor(heightButton * parentElement.offsetHeight);
        }
        // given absolute coords
        else{
            this.xTopLeft = xTopLeft;
            this.yTopLeft = yTopLeft;
            this.widthButton = widthButton;
            this.heightButton = heightButton;
        }
        this.buttonText = buttonText;
        this.myButtonFunc = myButtonFunc;

        // create HTML button
        this.myButton = documentButton.createElement("button");
        this.myButton.innerHTML = this.buttonText;

        // append to document
        parentElement.insertBefore(this.myButton);

        // set properties
        // function
        this.myButton.addEventListener("click", this.myButtonFunc);

        // position
        this.myButton.style.left = this.xTopLeft;
        this.myButton.style.top = this.yTopLeft;
        this.myButton.style.width = this.widthButton;
        this.myButton.style.height = this.heightButton;

        // so its "above" the canvas
        this.myButton.style.position = "absolute";
        this.myButton.style.zIndex = "2";

        // TODO: padding? No. do it in css file
    }
}