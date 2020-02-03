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
