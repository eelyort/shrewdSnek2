// small class to handle the displaying and whatnot of evolutionRunner
class EvolutionShell{
    constructor(mainMenu) {
        this.viewQueue = new CustomQueue();
        this.runningGen = false;
        this.infiniteRun = false;
        this.evolution = null;
        this.mainMenu = mainMenu;
    }
    createEvolution(input){
        if(input instanceof Evolution){
            console.log("evolution from evolution");
            this.evolution = input;
        }
        else if(input instanceof Snake){
            console.log("evolution from snake");
            let snake = input.cloneMe();

            this.evolution = new Evolution(snake, this.callback.bind(this));
        }
        else{
            console.log("!!! Unknown input !!!");
        }
    }
    runGen(){
        if(!this.evolution){
            // TODO
            console.log("Running default gen cuz no input");

            this.createEvolution(testBasicNeuralNetSnake.cloneMe());
        }
        // run
        if(!this.runningGen){
            this.runningGen = true;
            this.evolution.createNextGeneration();
            this.evolution.runGeneration();
            if(!this.mainMenu.isRunning){
                this.mainMenu.startRunner(new EvolutionLoadScreen(this.evolution, this.mainMenu));
            }
        }
        else{
            console.log("Already running");
        }
    }
    runQueue(){
        if(!this.mainMenu.isRunning || this.mainMenu.runningInstance instanceof EvolutionLoadScreen) {
            this.mainMenu.isRunning = false;
            if (this.viewQueue.size > 0) {
                this.mainMenu.startSnake(this.viewQueue.poll());
                this.mainMenu.updateSelectedSnake(loadedSnakes.length - 1);
            } else if (this.runningGen) {
                this.mainMenu.startRunner(new EvolutionLoadScreen(this.evolution, this.mainMenu));
            }
        }
    }
    callback(best){
        this.save(best);
        this.viewQueue.enqueue(best);
        setTimeout(this.runQueue.bind(this), 15);
        this.runningGen = false;
        if(this.infiniteRun){
            this.runGen();
        }
    }
    save(snake){
        if (loadedSnakes[loadedSnakes.length - 1].componentName !== `G${this.evolution.generationNumber}`) {
            // save old
            snake = snake.cloneMe();
            snake.setName(`G${this.evolution.generationNumber}`);
            loadedSnakes.push(snake);

            this.mainMenu.myPopUps.get("SelectSnake").updateSnakes(loadedSnakes);
        }
    }
}