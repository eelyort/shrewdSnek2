class EvolutionLoadScreen extends SingleSnakeRunner{
    constructor(evolution){
        super(loadingSignSnake.cloneMe(), 8, function () {/*Do nothing*/}, null, pathAppleSpawn);
        this.myEvolution = evolution;

        // loading bar
        this.loadLeft = .12;
        this.loadTop = .12;
        this.loadHeight = .1;
        this.loadMargin = 0.01;

        // text TODO
        this.textDrawn = false;
    }
    draw(ctx) {
        super.draw(ctx);
    }
    changeTickRate(newVal) {
        super.changeTickRate(25);
    }
}