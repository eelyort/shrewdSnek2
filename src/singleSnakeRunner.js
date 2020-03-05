class SingleSnakeRunner{
    constructor(snakeIn, gridSize, appleVal, tickRateStart){
        this.mySnake = snakeIn;
        this.gridSize = gridSize;
        this.appleVal = appleVal;
        this.tickRate = tickRateStart;
        this.timeTicks = 0;

        // to force tickRate
        this.lastTime = null;
    }
}