class EvolutionLoadScreen extends SingleSnakeRunner{
    constructor(evolution, mainMenu){
        super(loadingSignSnake.cloneMe(), 8, function () {/*Do nothing*/}, null, pathAppleSpawn);
        this.myEvolution = evolution;
        this.myMainMenu = mainMenu;

        // loading bar
        this.loadLeft = .1;
        this.loadTop = .1;
        this.loadHeight = .1;
        this.loadMargin = 0.01;

        // text TODO
        this.textDrawn = false;
    }
    draw(ctx) {
        super.draw(ctx);

        let size = ctx.canvas.width;

        // loading bar
        let left = this.loadLeft * size;
        let top = this.loadTop * size;
        let width = size - 2 * left;
        let height = this.loadHeight * size;
        ctx.fillStyle = "#3633df";
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.fill();
        ctx.closePath();
        // erase
        let margin = size * this.loadMargin;
        let finished = this.myEvolution.runningProgress/this.myEvolution.parameters[0][1];
        let finWidth = (width - margin * 2) * finished;
        ctx.clearRect(left + margin + finWidth, top + margin, width - margin * 2 - finWidth, height - 2 * margin);

        // text only needs to be drawn once
        if(!this.textDrawn){

        }
    }
    changeTickRate(newVal) {
        // do nothing
    }
}