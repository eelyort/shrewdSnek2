class MainMenu extends InteractableLayer{
    constructor(documentIn, gamePanelIn){
        // alert("Beginning of MainMenu constructor");
        super(documentIn, gamePanelIn);
        // this.myGamePanel.style.backgroundColor = mainMenuBackColor;
        this.myGamePanel.classList.add("background");
        this.runningInstance = null;

        // index of currently selected snake in "loadedSnakes"
        this.selectedSnake = 0;

        // stuff
        // buttons and whatnot
        this.myInteractables = new Map();
        this.myInteractables.set("Play", new ButtonHTML(.6, .15, .3, .2, 1, this.myGamePanel, this.myDocument, "Play: " + loadedSnakes[this.selectedSnake].getComponentName(), (this.playButton).bind(this)));
        this.myInteractables.set("PausePlay", new ImgButtonHTMLToggle(.25, .86, .1, .1, 1, this.myGamePanel, this.myDocument, ["./src/Images/pause-button-200x200.png", "./src/Images/play-button-200x200.png"], [(this.pauseButton).bind(this), (this.unpauseButton).bind(this)]));
        this.myInteractables.set("SelectSnake", new ButtonHTML(.6, .4, .3, .2, 1, this.myGamePanel, this.myDocument, "Load Snake(s)", (this.selectButton).bind(this)));
        // popups
        this.myPopUps = new Map();
        this.myPopUps.set("SelectSnake", new SelectSnakePopUp(.05, .05, 3, this.myGamePanel, this.myDocument, loadedSnakes, this.updateSelectedSnake.bind(this)));
        // text fields, in map for easy access/changing
        this.myTextFields = new Map();
        // text boxes floating above canvas
        // distance from left/right
        this.subCanvasTextXOffset = 0.02;
        this.subCanvasTextHeight = 0.08;
        // how much total width name takes vs score
        this.subCanvasTextRatio = 0.7;
        this.myTextFields.set("SelectedSnakeName", new VertCenteredTextBox(0, 0, 0, this.subCanvasTextHeight, 5, this.myGamePanel, this.myDocument, "Playing: None", "left"));
        this.myTextFields.set("Score", new VertCenteredTextBox(0, 0, 0, this.subCanvasTextHeight, 5, this.myGamePanel, this.myDocument, "Score: " + (`\xa0\xa0\xa0\xa0\xa0\xa0${0}`).substring(-6), "right"));

        // store score and only update if necessary
        this.displayScore = 0;

        // setup sub canvas for drawing game
        this.subCanvas = this.myDocument.createElement("canvas");
        this.myGamePanel.appendChild(this.subCanvas);
        this.subCanvas.id = subCanvasID;
        this.subCanvas.classList.add("subGameCanvas");
        this.subCanvas.style.zIndex = "1";
        this.subCanvas.style.position = "absolute";
        // set height and width cuz 2 separate coord systems
        this.subCanvasInnerSize = 2400;
        this.subCanvas.width = this.subCanvasInnerSize;
        this.subCanvas.height = this.subCanvasInnerSize;
        this.subCanvasMaxWidth = 0.45;
        this.subCanvasMaxHeight = 0.70;
        this.subCanvasLeft = 0.075;
        this.subCanvasTop = 0.12;
        this.formatSubCanvas();
        this.subCanvas.classList.add("background");

        this.subCanvasCTX = this.subCanvas.getContext("2d");

        // fps throttler variables
        this.then = 0;
        this.now = 0;
        this.fps = defaultFPS;

        // keyEvents: note that it is using keyDown instead of keyPress because keyPress doesn't register arrowKeys, shift, etc
        this.myDocument.addEventListener("keydown", this.keyEventInDown.bind(this), false);
        // set of keys down to prevent double presses for holding down, stores the keyEvent.key's
        this.keysDown = new Set();
        this.myDocument.addEventListener("keyup", this.keyEventInUp.bind(this), false);

        // runner variables TODO: add buttons
        this.tickRate = 20;
    }

    // called on keyEvent press
    keyEventInDown(keyEvent){
        if(!this.keysDown.has(keyEvent.key)) {
            if (this.isRunning) {
                this.runningInstance.keyEventIn(keyEvent);
            } else {
                // alert("Main menu keyEvent when not running: " + keyEvent + ", key: " + keyEvent.key);
            }

            // pause/unpause on space
            if(keyEvent.key == " " || keyEvent.key == "p" || keyEvent.key == "P"){
                this.myInteractables.get("PausePlay").eventButtonClicked();
            }
            this.keysDown.add(keyEvent.key);
        }
    }
    keyEventInUp(keyEvent){
        if(this.keysDown.has(keyEvent.key)){
            this.keysDown.delete(keyEvent.key);
            // alert(keyEvent.key + ": up");
        }
    }

    // start run, sets up variables, analoguous to startAnimating
    startRun(){
        this.then = Date.now();
        this.run();

        // small timeout so that the previous runner is ensured dead, screen cleared, etc
        setTimeout(this.runningInstance.startMe(), 50);
    }

    // basically the "main" method
    run(){
        if(this.runningInstance != null && this.isRunning) {
            let fpsInterval = 1000 / this.fps;

            // request another frame
            requestAnimationFrame(this.run.bind(this));

            // calc time elapsed
            this.now = Date.now();
            let elapsed = this.now - this.then;

            // draw next frame when needed
            if (elapsed > fpsInterval) {
                // Get ready for next frame by setting then=now, but also adjust for your
                // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
                this.then = this.now - (elapsed % fpsInterval);

                this.runningInstance.focusMe();
                this.runningInstance.draw(this.subCanvasCTX);
                this.updateScore();
            }
        }
    }

    // updates the score
    updateScore(){
        if(this.runningInstance != null){
            if(this.displayScore != this.runningInstance.mySnake.myLength) {
                this.myTextFields.get("Score").changeText("Score: " + `\xa0\xa0\xa0\xa0\xa0\xa0${this.runningInstance.mySnake.myLength}`.slice(-6));
                this.displayScore = this.runningInstance.mySnake.myLength;
            }
        }
    }

    // updates current snake name
    updateSelectedName(){
        this.myTextFields.get("SelectedSnakeName").typewrite("Playing: " + loadedSnakes[this.selectedSnake].getComponentName(), 50);
    }

    // update selected snake
    updateSelectedSnake(index){
        // console.log("updateSelectedSnake(" + index + "), this: " + this);
        this.selectedSnake = index;
        this.myInteractables.get("Play").changeText("Play: " + loadedSnakes[this.selectedSnake].getComponentName());
    }

    // callback function which ends the currently running thing
    callbackEndCurrent(){
        this.run();
        this.isRunning = false;
        this.updateScore();
        this.runningInstance.draw(this.subCanvasCTX);
    }

    // draws ONLY the menu items
    displayMenu(){
        // TODO: myCTX.draw...
        // uh looks like because I switched to using html elements this is useless now :/
    }

    // begins running a singleSnakeRunner using an AI brain
    // can choose whether to have apples set or random
    loadAndPlay(){
        // TODO
    }

    testDrawRect(){
        this.subCanvasCTX.beginPath();
        this.subCanvasCTX.rect(0, 0, 50, 50);
        this.subCanvasCTX.fillStyle = "#ff00ff";
        this.subCanvasCTX.fill();
        this.subCanvasCTX.closePath();
    }

    // loads an evolution from memory then switches it to evolutionRunner
    loadEvolution(signature){
        // TODO
    }

    // creates a new evolution species then loads it
    createEvolution(){
        // TODO
        this.loadEvolution(/* TODO */);
    }

    pauseButton(){
        // TODO
        // alert("Pause");
        if(this.runningInstance != null){
            this.runningInstance.pause();
        }
    }

    unpauseButton(){
        // TODO
        if(this.runningInstance != null){
            this.runningInstance.unpause();
        }
    }

    // loadButton(id){
    //     // TODO
    //     alert("Load: " + id);
    //     // testing
    //     // this.testDrawRect();
    //     // let snake;
    // }

    playButton(){
        this.startSelectedSnake();
        this.updateSelectedName();
        this.myInteractables.get("PausePlay").gotoIndex(0);
    }

    // popup that shows the selection of all snakes and lets u choose and see details and whatnot
    selectButton(){
        if(this.runningInstance != null && !this.runningInstance.paused) {
            this.myInteractables.get("PausePlay").eventButtonClicked();
        }
        this.myPopUps.get("SelectSnake").showPopUp();
    }

    // TODO: delete
    TEST_FUNC(){
        alert("Test");
    }

    // formats the sub canvas's size and position
    formatSubCanvas(){
        let totWidth = this.myGamePanel.getBoundingClientRect().width;
        let totHeight = this.myGamePanel.getBoundingClientRect().height;
        let maxWidth = totWidth * this.subCanvasMaxWidth;
        let maxHeight = totHeight * this.subCanvasMaxHeight;

        // side length of square
        let sideLength = Math.min(maxWidth, maxHeight);

        // set properties
        let left = (totWidth * this.subCanvasLeft) + (maxWidth - sideLength) / 2;
        let top = (totHeight * this.subCanvasTop) + (maxHeight - sideLength) / 2;
        this.subCanvas.style.left = (left).toString() + "px";
        this.subCanvas.style.top = (top).toString() + "px";
        this.subCanvas.style.width = (sideLength).toString(10) + "px";
        this.subCanvas.style.height = (sideLength).toString(10) + "px";

        // Text boxes floating above the canvas
        let textWidth = sideLength - 2*totWidth*this.subCanvasTextXOffset;
        this.myTextFields.get("SelectedSnakeName").myTextWrapper.style.left = (left + this.subCanvasTextXOffset*totWidth).toString() + "px";
        this.myTextFields.get("SelectedSnakeName").myTextWrapper.style.top = (top - this.subCanvasTextHeight*totHeight).toString() + "px";
        let width = this.subCanvasTextRatio*textWidth;
        this.myTextFields.get("SelectedSnakeName").myTextWrapper.style.width = (width).toString() + "px";

        this.myTextFields.get("Score").myTextWrapper.style.left = (left + this.subCanvasTextXOffset*totWidth + width).toString() + "px";
        this.myTextFields.get("Score").myTextWrapper.style.top = (top - this.subCanvasTextHeight*totHeight).toString() + "px";
        this.myTextFields.get("Score").myTextWrapper.style.width = (textWidth*(1-this.subCanvasTextRatio)).toString() + "px";
    }

    // called when window is resized
    onResizeFunc() {
        this.formatSubCanvas();
        // call re-size for img buttons
        this.myInteractables.get("PausePlay").onResize();
        this.myPopUps.get("SelectSnake").onResize();
    }

    // starts the selected snake
    startSelectedSnake(){
        let snake = loadedSnakes[this.selectedSnake].cloneMe();
        let runner = new SingleSnakeRunner(snake, this.tickRate, this.callbackEndCurrent.bind(this));
        // clear canvas
        if(this.runningInstance != null){
            // kill current
            this.runningInstance.kill();

            // canvas has seperate coordinate system
            this.subCanvas.width = this.subCanvasInnerSize;
            this.subCanvas.height = this.subCanvasInnerSize;
        }
        this.runningInstance = runner;
        this.isRunning = true;
        this.updateScore();
        this.startRun();
    }
}