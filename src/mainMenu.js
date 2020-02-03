class MainMenu extends InteractableLayer{

    constructor(documentIn, canvasIn, ctxIn){
        super(documentIn, canvasIn, ctxIn);
        this.runningInstance = null;
        // TODO: event listeners
    }

    // basically the "main" method
    run(){
        // TODO
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
}