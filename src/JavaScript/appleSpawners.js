// default apple spawner
function defaultAppleSpawn() {
    let r, c, index;
    while(!this.appleSpawned) {
        r = Math.floor(Math.random() * this.gridSize);
        c = Math.floor(Math.random() * this.gridSize);
        index = (r * (this.gridSize + 2)) + c + 1;

        if(this.grid[index] === 0){
            this.appleSpawned = true;
            this.grid[index] = 2;
            this.applePosition = index;
        }
    }
}

// path spawner - spawns apples only along a given path, made for mothers day
//  assumes the input is a path input
function pathAppleSpawn() {
    if(this.mySnake.myLength + this.mySnake.appleVal <= this.mySnake.myBrain.myDecompiledPath.length){
        while(!this.appleSpawned){
            let ran = Math.floor(Math.random() * this.mySnake.myBrain.myDecompiledPath.length);

            // random select a point on path
            let pos = this.mySnake.myBrain.myDecompiledPath[ran];

            // ignore negatives
            if(pos >= 0){
                // let r = Math.floor(pos / (this.gridSize + 2));
                // let c = Math.floor(pos % (this.gridSize + 2)) - 1;

                // if open spawn
                if(this.grid[pos] === 0){
                    this.appleSpawned = true;
                    this.grid[pos] = 2;
                    this.applePosition = pos;
                }
            }
        }
    }
    else{
        defaultAppleSpawn.bind(this)();
    }
}