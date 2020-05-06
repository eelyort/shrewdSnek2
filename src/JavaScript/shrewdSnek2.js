// let testInput = new Input();
// testInput.inputLength = 4;
//
// let test = new NeuralNetBrain(null, new TanhNormalizer(), 2, 2, 1, 0.05);
// test.updateWithInput(testInput);
// test.initRandom();
//
// // 1
// console.log("Test 1:");
//
// let input = [0, 1, 0, 0];
//
// console.log(`\nInput: `);
// console.log(input);
// console.log();
//
// console.log("Decision: ");
// console.log(test.getDecision(input));
//
// console.log("\nFull: ");
// console.log(test.myMat);
//
// // 2
// console.log("Test 2:");
//
// input = [0, 0, 99, 0];
//
// console.log(`\nInput: `);
// console.log(input);
// console.log();
//
// console.log("Decision: ");
// console.log(test.getDecision(input));
//
// console.log("\nFull: ");
// console.log(test.myMat);
//
// // 2
// console.log("Test 3:");
//
// input = [-100, -90, 99, 0];
//
// console.log(`\nInput: `);
// console.log(input);
// console.log();
//
// console.log("Decision: ");
// console.log(test.getDecision(input));
//
// console.log("\nFull: ");
// console.log(test.myMat);
//
// console.log("\n\nend testing\n\n"); // -------------------------------------------

let currentlyRunning = null;
// grab references to canvas, document, context to pass around
// theoretically this is unnecessary but its useful for scaling and sub-windows
let trueDocument = document;
let trueGamePanel = trueDocument.getElementById("gamePanel-1");

// alert(trueOriginalTransform);

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
            currentlyRunning = new MainMenu(trueDocument, trueGamePanel);
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