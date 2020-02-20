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
            new ButtonHTML(.6, .1, .3, .2, true, "Play", this.myGamePanel, this.myDocument, this.playButton),
            new ButtonHTML(.6, .35, .3, .2, true, "Load", this.myGamePanel, this.myDocument, this.loadButton),
            new ButtonHTMLToggle(.1, .85, .3, .1, true, "Pause/Play", this.myGamePanel, this.myDocument, [this.pauseButton, this.unpauseButton])
        ];

        // this.myCTX.rect(0, 0, this.myCTX.canvas.clientWidth, this.myCTX.canvas.clientWidth);

        // alert("End of MainMenu constructor");
        // TODO: event listeners
    }

    // basically the "main" method
    run(){
        // TODO loop for drawing
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
    }

    // TODO: delete
    TEST_FUNC(){
        alert("Test");
    }
}