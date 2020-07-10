class MainMenu extends InteractableLayer{
    constructor(documentIn, gamePanelIn, change){
        // alert("Beginning of MainMenu constructor");
        super(documentIn, gamePanelIn);

        this.masterChangeFunc = change;

        // this.myGamePanel.style.backgroundColor = mainMenuBackColor;
        this.myGamePanel.classList.add("background");
        this.runningInstance = null;

        // index of currently selected snake in "loadedSnakes"
        this.selectedSnake = 0;

        // runner variables
        this.tickRate = 20;
        // buttons
        // holding the buttons increases the speed at which it changes
        this.tickHoldTime = 0;
        this.tickHoldDelay = 120;
        this.tickBottomLimit = 1;
        this.tickUpperLimit = 99999;

        // evolution shell
        this.evolutionShell = new EvolutionShell(this);

        // stuff
        // buttons and whatnot
        this.buttonWidth = .225;
        this.buttonHeight = .2;
        this.buttonZIndex = 1;
        this.myInteractables = new Map();
        this.myInteractables.set("Play", new ButtonHTML(.5, .1, this.buttonWidth, this.buttonHeight, this.buttonZIndex, this.myGamePanel, this.myDocument, "Play: " + loadedSnakes[this.selectedSnake].getComponentName(), (this.playButton).bind(this)));;
        this.myInteractables.set("SelectSnake", new ButtonHTML(.75, .1, this.buttonWidth, this.buttonHeight, this.buttonZIndex, this.myGamePanel, this.myDocument, "Load Snake(s)", (this.selectButton).bind(this)));
        // this.myInteractables.set("Draw", new ButtonHTML(.5, .65, this.buttonWidth, this.buttonHeight, this.buttonZIndex, this.myGamePanel, this.myDocument, "Draw", function () {
        //     this.myPopUps.get("Draw").showPopUp();
        // }.bind(this)));
        this.myInteractables.set("RunGeneration", new ButtonHTML(.5, .35, this.buttonWidth, this.buttonHeight, this.buttonZIndex, this.myGamePanel, this.myDocument, "Run Generation", function () {
            this.evolutionShell.runGen();
        }.bind(this)));
        this.myInteractables.set("SelectGen", new ButtonHTML(.75, .35, this.buttonWidth, this.buttonHeight, this.buttonZIndex, this.myGamePanel, this.myDocument, "Select Generation", function () {
            // TODO
        }.bind(this)));
        this.myInteractables.set("ToggleInfinite", new ButtonHTML(.5, .6, this.buttonWidth, this.buttonHeight, this.buttonZIndex, this.myGamePanel, this.myDocument, "Toggle Infinite", function () {
            this.evolutionShell.infiniteRun = !this.evolutionShell.infiniteRun;
        }.bind(this)));
        this.myInteractables.set("Switch", new ButtonHTML(.75, .6, this.buttonWidth, this.buttonHeight, this.buttonZIndex, this.myGamePanel, this.myDocument, "Switch", function () {
            this.masterChangeFunc(2);
        }.bind(this)));
        this.myInteractables.set("TickUp", new PressHoldImgButton(.27, .86, .12, .1, this.buttonZIndex, this.myGamePanel, this.myDocument, "./src/Images/fast-forward-button-360x360.png", function () {
            this.changeTickRate(1);
        }.bind(this), this.tickHoldDelay, function () {this.releaseTickRate();}.bind(this)));
        this.myInteractables.set("PausePlay", new ImgButtonHTMLToggle(.2, .86, .1, .1, this.buttonZIndex, this.myGamePanel, this.myDocument, ["./src/Images/pause-button-200x200.png", "./src/Images/play-button-200x200.png"], [(this.pauseButton).bind(this), (this.unpauseButton).bind(this)]));
        this.myInteractables.set("TickDown", new PressHoldImgButton(.11, .86, .12, .1, this.buttonZIndex, this.myGamePanel, this.myDocument, "./src/Images/rewind-button-360x360.png", function () {
            this.changeTickRate(-1);
        }.bind(this), this.tickHoldDelay, function () {this.releaseTickRate();}.bind(this)));
        // this.myInteractables.set("TEST", new ButtonHTML(.6, .9, .1, .06, this.buttonZIndex, this.myGamePanel, this.myDocument, "TEST", this.TESTFUNC.bind(this)));
        // this.myInteractables.set("TEST2", new ButtonHTML(.8, .9, .1, .06, this.buttonZIndex, this.myGamePanel, this.myDocument, "TEST2", this.TESTFUNC2.bind(this)));
        // this.myInteractables.set("TEST3", new ButtonHTML(.7, .9, .1, .06, this.buttonZIndex, this.myGamePanel, this.myDocument, "TEST3", this.TESTFUNC3.bind(this)));
        // this.myInteractables.set("TEST4", new ButtonHTML(.6, 1, .1, .06, this.buttonZIndex, this.myGamePanel, this.myDocument, "TEST4", this.TESTFUNC4.bind(this)));
        // this.myInteractables.set("TEST5", new ButtonHTML(.7, 1, .1, .06, this.buttonZIndex, this.myGamePanel, this.myDocument, "TEST5", this.TESTFUNC5.bind(this)));
        // this.myInteractables.set("TEST6", new ButtonHTML(.8, 1, .1, .06, this.buttonZIndex, this.myGamePanel, this.myDocument, "TEST6", this.TESTFUNC6.bind(this)));
        // popups
        this.myPopUps = new Map();
        this.myPopUps.set("Draw", new DrawPopUp(.05, .05, 3, this.myGamePanel, this.myDocument, 40));
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
        this.myTextFields.set("TickRate", new CenteredTextBox(0, 0, 0, this.subCanvasTextHeight, 5, this.myGamePanel, this.myDocument, "Tick Rate"));
        this.displayTickRate();
        setTimeout(this.releaseTickRate.bind(this), 1);

        // store score and only update if necessary
        this.displayScore = 0;

        // setup sub canvas for drawing game
        this.subCanvas = this.myDocument.createElement("canvas");
        this.myGamePanel.appendChild(this.subCanvas);
        this.subCanvas.id = subCanvasID;
        this.subCanvas.classList.add("subGameCanvas");
        this.subCanvas.style.zIndex = "1";
        this.subCanvas.classList.add("absolute");
        // set height and width cuz 2 separate coord systems
        this.subCanvasInnerSize = 2400;
        this.subCanvas.width = this.subCanvasInnerSize;
        this.subCanvas.height = this.subCanvasInnerSize;
        this.subCanvasMaxWidth = 0.45;
        this.subCanvasMaxHeight = 0.70;
        this.subCanvasLeft = 0.025;
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
    }

    KILLME(){
        if(this.runningInstance != null){
            // kill current
            this.runningInstance.kill();

            // canvas has seperate coordinate system
            this.subCanvas.width = this.subCanvasInnerSize;
            this.subCanvas.height = this.subCanvasInnerSize;
        }
    }

    // tick rate changer: positive makes it faster, negative slower
    changeTickRate(val){
        // every 5 "ticks" held it starts increasing faster by a factor of 2 (ie: 1/per -> 2/per -> 4/per)
        this.tickRate = this.tickRate + (val * Math.pow(2, (Math.floor(this.tickHoldTime / (0.8 + this.tickHoldTime/11)))));

        // don't exceed bounds
        if(this.tickRate > this.tickUpperLimit){
            this.tickRate = this.tickUpperLimit;
        }
        if(this.tickRate < this.tickBottomLimit){
            this.tickRate = this.tickBottomLimit;
        }

        // update currently running
        if(this.runningInstance != null){
            this.runningInstance.changeTickRate(this.tickRate);
        }

        // display
        this.displayTickRate();

        this.tickHoldTime++;
    }
    // function to make the tick rate display nice
    displayTickRate(){
        let a = this.myTextFields.get("TickRate");

        // setup
        a.myTextWrapper.style.color = "#FFFFFF";
        if(!a.myTextWrapper.classList.contains("fadeOut")){
            a.myTextWrapper.classList.add("fadeOut");
        }

        // change the text
        a.changeText(`Tick Rate: ${this.tickRate}`);

        // make it appear
        if(a.myTextWrapper.classList.contains("fadeOut2")){
            a.myTextWrapper.classList.remove("fadeOut2");
        }

        // setTimeout(function () {
        //     // make it disappear
        //     a.myTextWrapper.classList.add("fadeOut2");
        // }, 0.01);
    }
    // when the tick rate buttons are released
    releaseTickRate(){
        this.tickHoldTime = 0;

        // make it disappear
        this.myTextFields.get("TickRate").myTextWrapper.classList.add("fadeOut2");
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
        this.displayTickRate();
        setTimeout(this.releaseTickRate.bind(this), 1);
        this.runningInstance.startMe();
    }

    // basically the "main" method
    run(){
        if(this.runningInstance && this.isRunning) {
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
        this.myPopUps.get("SelectSnake").mySelectCarousel.changeSelected(index, false);
        this.myPopUps.get("SelectSnake").mySelectCarousel.setFocus(index);
        this.myInteractables.get("Play").changeText("Play: " + loadedSnakes[this.selectedSnake].getComponentName());
    }

    // callback function which ends the currently running thing
    callbackEndCurrent(){
        this.isRunning = false;
        this.updateScore();
        this.runningInstance.draw(this.subCanvasCTX);
        setTimeout(function (){
            this.evolutionShell.runQueue()
        }.bind(this), 15);
    }

    testDrawRect(){
        this.subCanvasCTX.beginPath();
        this.subCanvasCTX.rect(0, 0, 50, 50);
        this.subCanvasCTX.fillStyle = "#ff00ff";
        this.subCanvasCTX.fill();
        this.subCanvasCTX.closePath();
    }

    // creates a new evolution species then loads it
    createEvolution(){
        // TODO
        this.evolutionShell.createEvolution(loadedSnakes[this.selectedSnake]);
    }

    pauseButton(){
        if(this.runningInstance != null){
            this.runningInstance.pause();
        }
    }

    unpauseButton(){
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
        this.myInteractables.get("PausePlay").gotoIndex(0);
    }

    // popup that shows the selection of all snakes and lets u choose and see details and whatnot
    selectButton(){
        if(this.runningInstance != null && !this.runningInstance.paused) {
            this.myInteractables.get("PausePlay").eventButtonClicked();
        }
        this.myPopUps.get("SelectSnake").showPopUp();
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
        // selected snake and score
        let textWidth = sideLength - 2*totWidth*this.subCanvasTextXOffset;
        this.myTextFields.get("SelectedSnakeName").myTextWrapper.style.left = (left + this.subCanvasTextXOffset*totWidth).toString() + "px";
        this.myTextFields.get("SelectedSnakeName").myTextWrapper.style.top = (top - this.subCanvasTextHeight*totHeight).toString() + "px";
        let width = this.subCanvasTextRatio*textWidth;
        this.myTextFields.get("SelectedSnakeName").myTextWrapper.style.width = (width).toString() + "px";

        this.myTextFields.get("Score").myTextWrapper.style.left = (left + this.subCanvasTextXOffset*totWidth + width).toString() + "px";
        this.myTextFields.get("Score").myTextWrapper.style.top = (top - this.subCanvasTextHeight*totHeight).toString() + "px";
        this.myTextFields.get("Score").myTextWrapper.style.width = (textWidth*(1-this.subCanvasTextRatio)).toString() + "px";

        // tick rate
        this.myTextFields.get("TickRate").myTextWrapper.style.width = sideLength.toString() + "px";
        this.myTextFields.get("TickRate").myTextWrapper.style.left = left.toString() + "px";
        this.myTextFields.get("TickRate").myTextWrapper.style.top = (top + 0.9 * sideLength).toString() + "px";
    }

    // called when window is resized
    onResizeFunc() {
        this.formatSubCanvas();
        // call re-size for img buttons
        this.myInteractables.get("PausePlay").onResize();
        this.myInteractables.get("TickUp").onResize();
        this.myInteractables.get("TickDown").onResize();

        this.myPopUps.forEach(function (val, key, map) {
            val.onResize();
        }.bind(this));
        // this.myPopUps.get("SelectSnake").onResize();
    }

    // starts the selected snake
    startSelectedSnake(){
        let snake = loadedSnakes[this.selectedSnake].cloneMe();
        this.startSnake(snake);
    }
    startSnake(snake){
        let runner;
        // special for mother's day
        if(snake.uuid && snake.uuid === "Mother's Day!!!"){
            console.log("Mother's Day!");
            runner = new SingleSnakeRunner(snake, this.tickRate, this.callbackEndCurrent.bind(this), null, pathAppleSpawn);
        }
        else {
            runner = new SingleSnakeRunner(snake, this.tickRate, this.callbackEndCurrent.bind(this));
        }
        this.startRunner(runner);
    }
    startRunner(runner){
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
        this.runningInstance.focusMe();
        this.startRun();
        this.updateSelectedName();
    }

    // TODO: delete
    // TESTFUNC(){
    //     console.log("Test:");
    //     // let siblingRunner = new SiblingRunner([loadedSnakes[this.selectedSnake].cloneMe(), loadedSnakes[this.selectedSnake].cloneMe()], 1, 8, this.TESTCALLBACK.bind(this), defaultScoreFunc, null, 1);
    //     // let other = new SiblingRunner([loadedSnakes[this.selectedSnake].cloneMe(), loadedSnakes[this.selectedSnake].cloneMe()], 1, 6, this.TESTCALLBACK.bind(this), defaultScoreFunc, null, 1);
    //     // siblingRunner.start();
    //     // other.start();
    //     // let speciesRunner = new SpeciesRunner(loadedSnakes[this.selectedSnake].cloneMe(), 6, this.TESTCALLBACK.bind(this), defaultScoreFunc, 0);
    //     // speciesRunner.runNext();
    //
    //     if(!this.TESTGENERATION) {
    //         let snake = testBasicNeuralNetSnake.cloneMe();
    //
    //         this.TESTGENERATION = new Evolution(snake);
    //         // gen.parameters[4][1] = 1;
    //         this.TESTGENERATION.createNextGeneration();
    //         this.TESTGENERATION.runGeneration();
    //     }
    //     else{
    //         if(this.TESTGENERATION.runningProgress === this.TESTGENERATION.parameters[0][1]) {
    //             if (loadedSnakes[loadedSnakes.length - 1].componentName !== `G${this.TESTGENERATION.generationNumber}`) {
    //                 // save old
    //                 let snake = this.TESTGENERATION.currentGeneration[0][0].cloneMe();
    //                 snake.setName(`G${this.TESTGENERATION.generationNumber}`);
    //                 loadedSnakes.push(snake);
    //
    //                 this.myPopUps.get("SelectSnake").updateSnakes(loadedSnakes);
    //             }
    //
    //             // console.log("Next Generation");
    //             this.TESTGENERATION.createNextGeneration();
    //             // console.log(this.TESTGENERATION.nextGeneration);
    //             setTimeout(function () {
    //                 this.TESTGENERATION.runGeneration();
    //             }.bind(this), 20);
    //         }
    //     }
    // }
    // TESTFUNC2(){
    //     console.log("Test2:");
    //
    //     if(loadedSnakes[loadedSnakes.length - 1].componentName !== `G${this.TESTGENERATION.generationNumber}` && this.TESTGENERATION.runningProgress === this.TESTGENERATION.parameters[0][1]) {
    //         // save old
    //         let snake = this.TESTGENERATION.currentGeneration[0][0].cloneMe();
    //         snake.setName(`G${this.TESTGENERATION.generationNumber}`);
    //         loadedSnakes.push(snake);
    //
    //         this.myPopUps.get("SelectSnake").updateSnakes(loadedSnakes);
    //     }
    //
    //     // let snake = loadedSnakes[2].cloneMe();
    //     //
    //     // let mutate = new PercentMutation();
    //     //
    //     // for (let i = 0; i < snake.myBrain.myWidth * snake.myBrain.myDepth * 50; i++) {
    //     //     mutate.mutateBrain(snake.myBrain);
    //     // }
    //
    //     // console.log(snake);
    //
    //     // this.selectedSnake = loadedSnakes.length - 1;
    //     this.updateSelectedSnake(loadedSnakes.length - 1);
    //
    //     this.startSelectedSnake();
    // }
    // TESTFUNC3(){
    //     console.log("test 3");
    //     this.testInterval = setInterval(function () {
    //         this.TESTFUNC();
    //     }.bind(this), 20000);
    // }
    // TESTFUNC4(){
    //     console.log("test 4");
    //     if(this.testInterval){
    //         clearInterval(this.testInterval);
    //     }
    // }
    // TESTFUNC5(){
    //     console.log("test 5");
    //     let snek = loadedSnakes[this.selectedSnake].cloneMe();
    //
    //     console.log(snek);
    //
    //     console.log(`brain: ${JSON.stringify(snek.myBrain)}`);
    //     console.log(`brain2: ${snek.myBrain.stringify()}`);
    //
    //     // console.log(`input: ${JSON.stringify(snek.myInput)}`);
    //     console.log(`input2: ${snek.myInput.stringify()}`);
    //
    //     console.log("Input: orig:");
    //     console.log(snek.myInput);
    //     console.log("saved and unsaved:");
    //     console.log(Input.parse(snek.myInput.stringify()));
    //
    //     console.log("Snakes: ");
    //     console.log(`snake2: ${snek.stringify()}`);
    //     console.log("orig:");
    //     console.log(snek);
    //     console.log("saved and unsaved:");
    //     console.log(Snake.parse(snek.stringify()));
    // }
    // TESTFUNC6(){
    //     console.log("test 6");
    //     console.log("Starting speed test for clone methods:");
    //     let numRuns = 10000;
    //
    //     console.log("Original .cloneMe():");
    //     let results = [0, 0, 0];
    //     let sum = 0;
    //     for (let i = 0; i < results.length; i++) {
    //         let then = Date.now();
    //         for (let j = 0; j < numRuns; j++) {
    //             let clone = loadedSnakes[this.selectedSnake].cloneMe();
    //         }
    //         results[i] = then - Date.now();
    //         sum += results[i];
    //     }
    //     console.log(`Results: ${results}, average: ${sum/results.length}`);
    //
    //     console.log("\nNew save/load:");
    //     results = [0, 0, 0];
    //     sum = 0;
    //     for (let i = 0; i < results.length; i++) {
    //         let then = Date.now();
    //         for (let j = 0; j < numRuns; j++) {
    //             let clone = Snake.parse(loadedSnakes[this.selectedSnake].stringify());
    //         }
    //         results[i] = then - Date.now();
    //         sum += results[i];
    //     }
    //     console.log(`Results: ${results}, average: ${sum/results.length}`);
    // }
    // TESTCALLBACK(a){
    //     console.log("Test Callback: " + a.toString());
    // }
}