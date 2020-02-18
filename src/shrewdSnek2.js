// the next layer class which is currently running and controlling visuals/inputs
class InteractableLayer{
    constructor(documentIn, canvasIn, ctxIn){
        this.isRunning = true;
        this.myDocument = documentIn;
        this.myCanvas = canvasIn;
        this.myCTX = ctxIn;
        // this.myButtons = new Array();
        this.myCanvas.style.zIndex = "0";
    }
    run(){
        // left empty on purpose
    }
}

let currentlyRunning = null;
// grab references to canvas, document, context to pass around
// theoretically this is unnecessary but its useful for scaling and sub-windows
let trueDocument = document;
let trueCanvas = trueDocument.getElementById("myCanvas");
let trueCTX = trueCanvas.getContext("2d");
const trueOriginalTransform = trueCTX.getTransform();

// alert(trueOriginalTransform);

alert("Aboutta start game");
alert("hi" + MainMenu);
// TODO: start game
startNew("mainMenu");

function terminate(){
    currentlyRunning.isRunning = false;
    currentlyRunning = null;
}

function startNew(key){
    switch (key) {
        case 'mainMenu':
            // TODO
            alert("aboutta go new MainMenu");
            currentlyRunning = new MainMenu(trueDocument, trueCanvas, trueCTX);
            alert("finished new MainMenu");
            break;
        case "evolutionRunner":
            // TODO
            break;
        default:
            alert("Unknown Interact-able Layer in startNew(" + key + ")");
    }
}

// while(true){
//     if(currentlyRunning != null){
//         currentlyRunning.run();
//     }
// }