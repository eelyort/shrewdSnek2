// small class to handle the displaying and whatnot of evolutionRunner
class EvolutionShell{
    constructor(tellReady, popUpFuncs) {
        this.viewQueue = new CustomQueue();
        this.runningGen = false;
        this.infiniteRun = false;
        this.evolution = null;

        this.tellReady = tellReady;

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s)), changeEvolution(newEvolution)
        this.popUpFuncs = popUpFuncs;
    }
    createEvolution(input){
        if(input instanceof Evolution){
            this.evolution = input;
            this.evolution.myCallback2 = this.callback.bind(this);
        }
        else if(input instanceof Snake){
            let snake = input.cloneMe();

            this.evolution = new Evolution(snake, this.callback.bind(this));
        }
        else{
            console.log("!!! Unknown input !!!");
        }
    }
    runGen(){
        // run
        if(!this.runningGen){
            this.runningGen = true;
            this.evolution.createNextGeneration();
            this.evolution.runGeneration();
        }
        else{
            // nothing
        }
    }
    // called from mainMenu - runs next ready snake/loading screen
    runQueue(startSnake, startRunner){
        if(this.viewQueue.size > 0){
            startSnake(this.viewQueue.poll());
        }
        else if(this.runningGen){
            startRunner(new EvolutionLoadScreen(this.evolution));
        }
    }
    callback(best){
        this.save(best);
        this.viewQueue.enqueue(best);
        this.runningGen = false;
        if(this.infiniteRun){
            this.runGen();
        }
        this.tellReady();
    }
    save(snake){
        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s)), changeEvolution(newEvolution)

        // save old
        snake = snake.cloneMe();
        if(snake.getComponentName() === loadedSnakes[loadedSnakes.length - 1].getComponentName()){
            const lastSpecies = loadedSnakes[loadedSnakes.length - 1];
            if(lastSpecies.snakes[lastSpecies.getLength() - 1].generationNumber !== snake.generationNumber){
                lastSpecies.push(snake);
                this.popUpFuncs.changeSelectedGen(lastSpecies.getLength() - 1);
            }
        }
        else{
            this.popUpFuncs.spliceLoaded(loadedSnakes.length, 0, snake);
            this.popUpFuncs.changeSelected(loadedSnakes.length-1);
        }
    }
}