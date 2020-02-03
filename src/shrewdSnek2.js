// the next layer class which is currently running and controlling visuals/inputs
class InteractableLayer{
    constructor(documentIn, canvasIn, ctxIn){
        this.isRunning = true;
        this.myDocument = documentIn;
        this.myCanvas = canvasIn;
        this.myCTX = ctxIn;
    }
    run(){
        ;
    }
}
let currentlyRunning = null;

// grab references to canvas, document, context to pass around
// theoretically this is unnecessary but its useful for scaling and sub-windows
let trueDocument = document;
let trueCanvas = trueDocument.getElementById("myCanvas");
let trueCTX = trueCanvas.getContext("2d");

function terminate(){
    currentlyRunning.isRunning = false;
    currentlyRunning = null;
}

function startNew(key){
    switch (key) {
        case 'mainMenu':
            // TODO
            break;
        case "evolutionRunner":
            // TODO
            break;
        default:
            alert("Unknown Interact-able Layer in startNew(" + key + ")");
    }
}

while(true){
    if(currentlyRunning != null){
        currentlyRunning.run();
    }
}