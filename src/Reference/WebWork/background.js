// Made to run in the background

self.addEventListener("message", function(e) {
    //code to run
    i = 0;
    while (i < 1000000000){
        // if(i % 1000000000){
        //     self.postMessage(e.data + ":   " + i/100000000);
        // }
        i++;
    }
    self.postMessage("I finished" + e.data);
    self.close();
}, false);

// self.addEventListener('message', function(e) {
//     self.postMessage(e.data + " Rreeeee");
// }, false);