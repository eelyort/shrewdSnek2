// Made to run in the background

// self.addEventListener("message", function() {
//     //code to run
//     i = 0;
//     let arr = new Uint16Array(arguments[0]);
//     let idx = arguments[1];
//     while (i < 1000000000){
//         // if(i % 1000000000){
//         //     self.postMessage(e.data + ":   " + i/100000000);
//         // }
//         i++;
//     }
//     arr[idx] = idx;
//     self.postMessage("I finished " + arr);
//     self.close();
// }, false);

importScripts("../WebWork/*.js");
//
// self.addEventListener("message", function (e) {
//    let runner = e.data;
//
//     function callback(i1, i2){
//         self.postMessage(i1, i2);
//         self.close();
//     };
//
//     console.log(`runner: ${runner}`);
//    runner.callback = callback;
//    runner.run();
// });

self.addEventListener("message", function (e) {
    let func = e.data;

    console.log(func());

    self.close();
});