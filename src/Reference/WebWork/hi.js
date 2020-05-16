// alert(5);
function hello(){
    alert("Watsup guys");
}
function infiniteLoop(){
    x = 0;
    while(x < 1000000000){
        x++;
    }
    alert("Process Finsihed")
}

// alert(6);


//Multithreading here
var worker = new Worker('background.js');

worker.addEventListener('message', function(e) {
    alert('Worker said: ' + e.data);
}, false);

// worker.postMessage('Hello World'); // Send data to our worker.

// alert(7);

function startThread(){
    var worker = new Worker('background.js');

    worker.addEventListener('message', function(e) {
        alert('Worker said: ' + e.data);
    }, false);

    worker.postMessage('Hello World'); // Send data to our worker.
}

const len = 5;

let shared = new SharedArrayBuffer(Uint16Array.BYTES_PER_ELEMENT * len);

function testSharedBuffer() {
    shared = new Uint16Array(shared);

    shared = [0, 0, 1, 0, 0];

    let work = new Worker('background.js');
    work.addEventListener("message", function (e) {
        console.log(`Worker said: ${e.data}`);
    });
    work.postMessage(shared);

    console.log("end of testSharedBuffer, shared: " + shared);
}

class hi{
    constructor(){
        this.arr = [0, 0, 0, 0, 0];

        this.myVal = 1;

        console.log(`end hi construct: arr: ${this.arr}`);
    }
    callback(index, val){
        console.log(`callback(${index}, ${val})`);
        this.arr[index] = val;
        console.log(`callback: arr: ${this.arr}`);
    }
    beginWorks(){
        for (let i = 0; i < this.arr.length; i++) {
            let work = new Worker('background.js');
            work.addEventListener("message", function (e) {
                this.callback(e.data[0], e.data[1]);
            }.bind(this));
            work.postMessage(function () {
                return this.myVal;
            }.bind(this));
        }
    }
}

const a = new hi();
