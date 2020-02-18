
let currentlyRunning = null;
// grab references to canvas, document, context to pass around
// theoretically this is unnecessary but its useful for scaling and sub-windows
let trueDocument = document;
let trueCanvas = trueDocument.getElementById("myCanvas");
let trueCTX = trueCanvas.getContext("2d");
const trueOriginalTransform = trueCTX.getTransform();

// alert(trueOriginalTransform);

// alert("Aboutta start game");
// alert("hi" + MainMenu);
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
            // alert("aboutta go new MainMenu");
            currentlyRunning = new MainMenu(trueDocument, trueCanvas, trueCTX);
            // alert("finished new MainMenu");
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