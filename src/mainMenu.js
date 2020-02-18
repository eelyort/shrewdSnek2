class MainMenu extends InteractableLayer{
    constructor(documentIn, canvasIn, ctxIn){
        alert("Beginning of MainMenu constructor");
        super(documentIn, canvasIn, ctxIn);
        this.runningInstance = null;
        this.myButtons = [
            // TODO
            new ButtonHTML(.5, .5, .1, .1, true, "Test", this.myCanvas, this.myDocument, this.TEST_FUNC)
        ];

        // TODO: delete test
        this.myCTX.beginPath();
        this.myCTX.rect(0, 0, this.myCTX.data.width, this.myCTX.data.height);
        this.myCTX.fillStyle = mainMenuBackColor;
        this.myCTX.fill();
        this.myCTX.closePath();

        alert("End of MainMenu constructor");
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

    // TODO: delete
    TEST_FUNC(){
        alert("Test");
    }
}