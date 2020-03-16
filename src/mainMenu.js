class MainMenu extends InteractableLayer{
    constructor(documentIn, canvasIn, ctxIn){
        // alert("Beginning of MainMenu constructor");
        super(documentIn, canvasIn, ctxIn);
        // TODO: decide whether to set this here or in css
        this.myCanvas.style.backgroundColor = mainMenuBackColor;
        this.runningInstance = null;
        this.myGamePanel = this.myDocument.getElementById(gamePanelID);
        this.myButtons = [
            // TODO
            // new ButtonHTML(.45, .45, .1, .1, true, "Test", this.myDocument.getElementById(gamePanelID), this.myDocument, this.TEST_FUNC)
            new ButtonHTML(.6, .15, .3, .2, true, "Play", this.myGamePanel, this.myDocument, (this.playButton).bind(this)),
            new ButtonHTML(.6, .4, .3, .2, true, "Load", this.myGamePanel, this.myDocument, (this.loadButton).bind(this)),
            new ButtonHTMLToggle(.15, .85, .3, .1, true, ["Pause", "Play"], this.myGamePanel, this.myDocument, [(this.pauseButton).bind(this), (this.unpauseButton).bind(this)])
        ];

        // setup sub canvas for drawing game
        this.subCanvas = this.myDocument.createElement("canvas");
        this.myGamePanel.appendChild(this.subCanvas);
        this.subCanvas.id = subCanvasID;
        this.subCanvas.classList.add("subGameCanvas");
        this.subCanvas.style.backgroundColor = gameBackColor;
        this.subCanvas.style.zIndex = "1";
        this.subCanvas.style.position = "absolute";
        this.formatSubCanvas();

        this.subCanvasCTX = this.subCanvas.getContext("2d");

        // fps throttler variables
        this.then = 0;
        this.now = 0;
        this.fps = defaultFPS;

        // alert("End of MainMenu constructor");
        this.myDocument.addEventListener("keypress", this.keyEventIn, false);
    }

    // called on keyEvent
    keyEventIn(keyEvent){
        alert(keyEvent);
        // TODO
    }

    // start run, sets up variables, analoguous to startAnimating
    startRun(){
        this.then = Date.now();
        this.run();
    }

    // basically the "main" method
    run(){
        if(this.runningInstance != null && this.isRunning) {
            let fpsInterval = 1000 / fps;

            // request another frame
            requestAnimationFrame(this.run);

            // calc time elapsed
            this.now = Date.now();
            let elapsed = this.now - this.then;

            // draw next frame when needed
            if (elapsed > fpsInterval) {
                // Get ready for next frame by setting then=now, but also adjust for your
                // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
                then = now - (elapsed % fpsInterval);

                // TODO: draw
                this.runningInstance.draw(this.subCanvasCTX);
            }
        }
    }

    // draws ONLY the menu items
    displayMenu(){
        // TODO: myCTX.draw...

    }

    // begins running a singleSnakeRunner using an AI brain
    // can choose whether to have apples set or random
    loadAndPlay(){
        // TODO
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
        alert("Pause");
    }

    unpauseButton(){
        // TODO
        alert("Play");
    }

    loadButton(){
        // TODO
        alert("Load");
    }

    playButton(){
        // TODO
        alert("Play");
        // this.subCanvasCTX.beginPath();
        // this.subCanvasCTX.rect(0, 0, 50, 50);
        // this.subCanvasCTX.fillStyle = "#ff55ff";
        // this.subCanvasCTX.fill();
        // this.subCanvasCTX.closePath();
    }

    // TODO: delete
    TEST_FUNC(){
        alert("Test");
    }

    // formats the sub canvas's size and position
    formatSubCanvas(){
        let totWidth = this.myCanvas.getBoundingClientRect().width;
        let totHeight = this.myCanvas.getBoundingClientRect().height;
        let maxWidth = totWidth * 0.45;
        let maxHeight = totHeight * 0.70;

        // side length of square
        let sideLength = Math.min(maxWidth, maxHeight);

        // set properties
        this.subCanvas.style.left = ((totWidth * 0.075) + (maxWidth - sideLength) / 2).toString(10) + "px";
        this.subCanvas.style.top = ((totHeight * 0.075) + (maxHeight - sideLength) / 2).toString(10) + "px";
        this.subCanvas.style.width = (sideLength).toString(10) + "px";
        this.subCanvas.style.height = (sideLength).toString(10) + "px";
    }

    // called when window is resized
    onResizeFunc() {
        this.formatSubCanvas();
    }
}