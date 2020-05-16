// TODO: delete
//  was meant to be used for multithreading, since you can't really pass objects and since it seems I somehow already had multithreading built in accidentally, unused for now
// web worker for evolution runner

function callback(index, snakeScoresMatrix){
    self.postMessage(index, snakeScoresMatrix);
    self.close();
}

// the function called when data is passed to this worker - "start" function
// e = [snakes, numRuns, scoringFunction, timeout]
//  type: 0-speciesRunner, 1-siblingRunner
self.addEventListener("message", function (e) {
    let type = e.data[0];
    let runner = e.data[1];
    if(type === 0){
        runner.myCallback = callback.bind(self);
        runner.runNext();
    }
    else if(type === 1){
        runner.myCallback = callback.bind(self);
        runner.start();
    }
});