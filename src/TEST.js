
// let a = "hello world (1)";
// let tokens = a.split(" ");
// console.log(tokens);
// let lastToken = tokens[tokens.length-1];
// console.log(lastToken);
// let b = lastToken.substring(1, lastToken.length-1);
// console.log(b);
// console.log(isNaN(b));

// let a = [0, 1, 2, 3, 4, 5, 6, 7, 8];
// console.log(a);
// a.splice(1, 1, 11);
// console.log(a);

let testRect = [];
const gridSize = 11;
for (let i = 0; i < gridSize; i++) {
    testRect.push([i, 0]);
}
for (let i = 0; i < gridSize; i++) {
    testRect.push([gridSize, i]);
}
for (let i = 0; i < gridSize; i++) {
    testRect.push([gridSize-i, gridSize]);
}
for (let i = 0; i < gridSize; i++) {
    testRect.push([0, gridSize-i]);
}
console.log(testRect);

// let a = [1, 2, 3];
// a += [2, 3, 4];
// console.log(a);

// let [TEST, TEST2, TEST3] = [0, 0, 0];
// // [TEST, TEST2, TEST3] += [1, 0, -1];
// let curr = [1, 0, -1];
//
// [TEST, TEST2, TEST3] = [TEST + curr[0], TEST2 + curr[1], TEST3 + curr[2]];
//
// console.log(`1: ${TEST}, 2: ${TEST2}, 3: ${TEST3}`);
//
// console.log(1 + (1 === 1));

// if(-1){
//     console.log("hi");
// }
//
// console.log(-1 % 2 === -1);
//
// if(-1 % 2){
//     console.log("hi");
// }
//
// function testMultipleArgs(hi){
//     for (let i = 0; i < arguments.length; i++) {
//         console.log(arguments[i]);
//     }
// }
//
// testMultipleArgs(1, 2, "hi");
//
// if(1){
//     console.log("hi3");
// }
// else{
//     console.log("hi2")
// }
//
// console.log("\n");
//
// class hi{
//     constructor() {
//         this.a = "name";
//     }
//     hello(){
//         console.log("hello");
//     }
//     static staticM(){
//         console.log("Static");
//     }
// }
//
// class h2 extends hi{
//     constructor(){
//         super();
//     }
//     static staticM(){
//         console.log("Static2");
//     }
// }
//
// h2.staticM();
//
// let testHi = new hi();
// testHi.hello();
//
// console.log(`testHi.prototype: ${Object.getPrototypeOf(testHi)}`);
//
// let json = JSON.stringify(testHi);
//
// console.log(json);
//
// let testHi2 = JSON.parse(json);
//
// console.log(`2 proto: ${Object.getPrototypeOf(testHi2)}`);
//
// Object.setPrototypeOf(testHi2, hi.prototype);
//
// console.log(`two prototypes equal?: ${Object.getPrototypeOf(testHi) === Object.getPrototypeOf(testHi2)}`);

// let shapeParam = 0.8;
// let numParents = 100;
// let f = function (x) {
//     return Math.pow(shapeParam, x/Math.sqrt(numParents));
// };
// /*
// r = a^(i/sqrt(c))
//  */
// let fI = function (x) {
//     return (Math.log(x)/Math.log(shapeParam)) * Math.sqrt(numParents);
// };
// let min = Math.min(f(0), f(numParents));
// let max = Math.max(f(0), f(numParents));
// let pickRanParent = function () {
//     return Math.floor(fI((Math.random() * (max-min)) + min));
// };
//
// let a = "[";
// for (let j = 0; j < 5000; j++) {
//     a += pickRanParent().toString() + ",";
// }
// console.log(a.substring(0, a.length - 1) + "]");


//
// // Parent skeleton brain class
// // Specifications
// //  -Takes in an "input" into method, gets decision (direction) out
// //  -Can mutate with many methods, variable parameters
// class SnakeBrain{
//     constructor(mutateMethod){
//         this.mutateMethod = mutateMethod;
//         this.brainID = -1;
//     }
//     // takes in input(compress into array)
//     // outputs a direction:
//     //   0 = North
//     //   1 = East
//     //   2 = South
//     //   3 = West
//     //   4 = None
//     getDecision(brainInput){
//         return 0;
//     }
//     mutateMe(mutateParameters){
//         this.mutateMethod.mutate(mutateParameters, this);
//     }
//     // returns a copy of this brain
//     cloneMe(){
//         let clone = new SnakeBrain(this.mutateMethod.cloneMe());
//         clone.getDecision = this.getDecision;
//         return clone;
//     }
//     // assumes the output array is a 4 length array
//     //  N(0), E(1), S(2), W(3)
//     getOutput(outputArr){
//         // search for max
//         let maxI = 0;
//         for (let i = 1; i < 4; i++) {
//             if(outputArr[i] > outputArr[maxI]){
//                 maxI = i;
//             }
//         }
//
//         // if max is 0, assume no decision
//         return ((outputArr[maxI] == 0) ? (4) : (maxI));
//     }
//     updateWithInput(input){
//         // do nothing
//     }
// }
//
// // Neural network brain
// class NeuralNetBrain extends SnakeBrain{
//     constructor(mutateMethod, normalizer, depth, width, startWeight, startBias){
//         super(mutateMethod);
//
//         this.componentName = "Basic Neural Network";
//         this.componentDescription = "This brain is a simple neural network, with a set depth and width. It can be used with most forms of machine learning. It makes all of its decisions via forward propagation.";
//
//         // sigmoid/htan func to normalize/activate nodes
//         this.myNormalizer = normalizer;
//
//         // number of hidden layers
//         this.myDepth = depth;
//         // number of nodes in every hidden layer
//         this.myWidth = width;
//         // number of nodes in input
//         this.myInputWidth = -1;
//         // initial values for weights and biases
//         this.startWeight = startWeight;
//         this.startBias = startBias;
//
//         // Create the matrix containing all the values
//         //
//         // First dimension: layers
//         //  this.myMat[i] returns the i-th layer
//         //  this.myDepth = outputs
//         //
//         // Second dimension: value type
//         //  For all this.myMat[layer], this.myMat[layer][0].length = this.myMat[layer][1].length = this.myMat[layer][2].length
//         //  General:
//         //   this.myMat[layer][0] = activated values
//         //   this.myMat[layer][1] = weights array
//         //   this.myMat[layer][2] = biases
//         //
//         // Third dimension
//         //  this.myMat[layer][type][i] = i-th node
//         //  weights:
//         //   this.myMat[layer][type][1][i] = array of weights for the i-th node
//         //   this.myMat[layer][type][1][i][j] = weight: (last layer's node j) -> (this layer's node i)
//         //
//         // First dimension
//         this.myMat = Array.apply(null, {length: (this.myDepth + 1)});
//         // Second dimension
//         for (let layer = 0; layer < this.myMat.length; layer++) {
//             this.myMat[layer] = Array.apply(null, {length: 3});
//         }
//         // Third dimension
//         // hidden layers
//         for (let layer = 0; layer < this.myMat.length - 1; layer++) {
//
//             // values
//             this.myMat[layer][0] = Array.apply(null, {length: this.myWidth});
//             for (let node = 0; node < this.myMat[layer][0].length; node++) {
//                 this.myMat[layer][0][node] = 0;
//             }
//
//             // weights
//             this.myMat[layer][1] = Array.apply(null, {length: this.myWidth});
//             for (let node = 0; node < this.myWidth; node++) {
//
//                 // from input
//                 if(layer === 0){
//                     break;
//                 }
//
//                 // from previous hidden layer
//                 else {
//                     this.myMat[layer][1][node] = Array.apply(null, {length: this.myWidth});
//                     for (let source = 0; source < this.myMat[layer][1][node].length; source++) {
//                         this.myMat[layer][1][node][source] = 0;
//                     }
//                 }
//             }
//
//             // biases
//             this.myMat[layer][2] = Array.apply(null, {length: this.myWidth});
//             for (let node = 0; node < this.myMat[layer][2].length; node++) {
//                 this.myMat[layer][2][node] = 0;
//             }
//         }
//         // output layer
//         // values
//         this.myMat[this.myMat.length - 1][0] = Array.apply(null, {length: 4});
//         for (let node = 0; node < this.myMat[this.myMat.length - 1][0].length; node++) {
//             this.myMat[this.myMat.length - 1][0][node] = 0;
//         }
//
//         // weights
//         this.myMat[this.myMat.length - 1][1] = Array.apply(null, {length: 4});
//         for (let node = 0; node < 4; node++) {
//             this.myMat[this.myMat.length - 1][1][node] = Array.apply(null, {length: this.myWidth});
//             for (let source = 0; source < this.myMat[this.myMat.length - 1][1][node].length; source++) {
//                 this.myMat[this.myMat.length - 1][1][node][source] = 0;
//             }
//         }
//
//         // biases
//         this.myMat[this.myMat.length - 1][2] = Array.apply(null, {length: 4});
//         for (let node = 0; node < this.myMat[this.myMat.length - 1][2].length; node++) {
//             this.myMat[this.myMat.length - 1][2][node] = 0;
//         }
//     }
//     // forward propagation
//     getDecision(brainInput) {
//         // input to first hidden layer
//         // pre-activation
//         for (let node = 0; node < this.myWidth; node++) {
//             this.myMat[0][0][node] = math.dot(brainInput, this.myMat[0][1][node]) + this.myMat[0][2][node];
//         }
//         // activation
//         this.myNormalizer.normalizeCol(this.myMat[0][0]);
//
//         // everything else
//         for (let layer = 1; layer < this.myMat.length; layer++) {
//             // pre-activation
//             for (let node = 0; node < this.myMat[layer][0].length; node++) {
//                 this.myMat[layer][0][node] = math.dot(this.myMat[layer - 1][0], this.myMat[layer][1][node]) + this.myMat[layer][2][node];
//             }
//             // activation
//             this.myNormalizer.normalizeCol(this.myMat[layer][0]);
//         }
//
//         // output
//         return this.getOutput(this.myMat[this.myMat.length - 1][0]);
//     }
//
//     // called in snake.js to update the brain with the length of the inputs
//     updateWithInput(input){
//         this.myInputWidth = input.inputLength;
//
//         // update network
//         for (let node = 0; node < this.myWidth; node++) {
//             this.myMat[0][1][node] = Array.apply(null, {length: this.myInputWidth});
//             for (let source = 0; source < this.myMat[0][1][node].length; source++) {
//                 this.myMat[0][1][node][source] = 0;
//             }
//         }
//     }
//     // override clone method
//     cloneMe() {
//         let clone = new NeuralNetBrain(this.mutateMethod.cloneMe(), this.myNormalizer.cloneMe(), this.myDepth, this.myWidth, this.startWeight, this.startBias);
//
//         // copy everything
//         for (let layer = 0; layer < this.myMat.length; layer++) {
//             // define layer if needed
//             if(clone.myMat[layer] === undefined){
//                 clone.myMat[layer] = Array.apply(null, {length: this.myMat[layer].length});
//             }
//
//             for (let type = 0; type < this.myMat[layer].length; type++) {
//                 // skip unneeded definitions
//                 if(this.myMat[layer][type] === undefined){
//                     continue;
//                 }
//
//                 // define type if needed
//                 if(clone.myMat[layer][type] === undefined){
//                     clone.myMat[layer][type] = Array.apply(null, {length: this.myMat[layer][type].length});
//                 }
//
//                 // weights
//                 if(type === 1){
//                     // loop through nodes
//                     for (let node = 0; node < this.myMat[layer][type].length; node++) {
//                         // define array if needed
//                         if(clone.myMat[layer][type][node] === undefined){
//                             clone.myMat[layer][type][node] = Array.apply(0, {length: this.myMat[layer][type][node].length});
//                         }
//
//                         // copy values
//                         for (let source = 0; source < this.myMat[layer][type][node].length; source++) {
//                             clone.myMat[layer][type][node][source] = this.myMat[layer][type][node][source];
//                         }
//                     }
//                 }
//                 // biases and values
//                 else {
//                     for (let node = 0; node < this.myMat[layer][type].length; node++) {
//                         clone.myMat[layer][type][node] = this.myMat[layer][type][node];
//                     }
//                 }
//             }
//         }
//         return clone;
//     }
//     // init all values with random numbers
//     initRandom(){
//         // TODO
//         for (let layer = 0; layer < this.myMat.length; layer++) {
//             for (let node = 0; node < this.myMat[layer][0].length; node++) {
//                 // weights
//                 for (let source = 0; source < this.myMat[layer][1][node].length; source++) {
//                     this.myMat[layer][1][node][source] = this.startWeight/Math.sqrt(this.myMat[layer][0].length);
//                 }
//
//                 // bias
//                 this.myMat[layer][2][node] = this.startBias;
//             }
//         }
//     }
// }
//
// class Input{
//     constructor(){
//         this.mySnake = null;
//         this.inputLength = 0;
//         this.inputID = -1;
//     }
//     generateInput(keyEvent){
//         return [];
//     }
//     // returns a copy of this input
//     cloneMe(){
//         let clone = new Input();
//         clone.generateInput = this.generateInput;
//         clone.inputLength = this.inputLength;
//         return clone;
//     }
//     // called by snake constructor
//     updateParentSnake(snake){
//         this.mySnake = snake;
//     }
// }
//
// let testInput = new Input();
// testInput.inputLength = 4;
//
// let test = new NeuralNetBrain(null, null, 2, 2, 1, 0.05);
// test.updateWithInput(testInput);
//
// console.log(test.myMat);
//
// console.log(test.myMat[0]);
//
// console.log("\nhello\n");
// test.initRandom();
//
// console.log(test.myMat);
//
// console.log(0);
// console.log(test.myMat[0]);
//
// console.log(1);
// console.log(test.myMat[1]);
//
// console.log(2);
// console.log(test.myMat[2]);
//
// // 1
//
// let input = [0, 1, 0, 0];
//
// console.log(`\nInput: `);
// console.log(input);
// console.log();
//
// console.log("Decision: ");
// console.log(test.getDecision([0, 0, 1, 0]));
//
// console.log("\nFull: ");
// console.log(test.myMat);
//
// for (let i = 0; i < test.myMat.length; i++) {
//     console.log(`\n${i}: `);
//     console.log(test.myMat[i]);
// }
//
// // let a = Array.apply(null, {length: 5});
// // console.log(a);
// // console.log(a.length);
// //
// // for (let i = 0; i < a.length; i++) {
// //     console.log(`${i}: ${a[i]}`);
// // }
// //
// // let b = Array.apply(Array.apply(null, {length: 3}), {length: (this.myDepth + 2)});
// //
// // console.log("\n");
// //
// // console.log(b);
// //
// // console.log("next:\n\n");
// //
// // // First dimension
// // let c = Array.apply(null, {length: (4 + 2)});
// // console.log(c);
// // // Second dimension
// // for (let i = 0; i < c.length; i++) {
// //     c[i] = Array.apply(null, {length: 3});
// // }
// //
// // console.log(c);
