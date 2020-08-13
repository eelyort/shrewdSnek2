// REACT

class SubCanvas extends React.Component{
    render() {
        return(
            <canvas width={subCanvasInnerSize} height={subCanvasInnerSize} ref={this.props.refIn} className={"subGameCanvas background"} />
        );
    }
}

class LoadScreen extends React.Component{
    render() {
        const {evolution: evolution} = this.props;

        const precision = Math.pow(10, scoreDisplayPrecision);

        const finished = evolution.runningProgress/evolution.parameters[0];
        const styleBar = {
            width: `${Math.floor(finished * 100)}%`
        };

        let lastStats = ((evolution.statistics && evolution.statistics.length >= 1) ? (evolution.statistics[evolution.statistics.length-1]) : ([0, 0, 0]));

        let lastLastStats = ((evolution.statistics && evolution.statistics.length >= 2) ? (evolution.statistics[evolution.statistics.length-2]) : (lastStats));
        let deltaStats = lastStats.map(((value, index) => value-lastLastStats[index]));

        lastStats = lastStats.map(((value, index) => Math.round(value * precision)/precision));
        deltaStats = deltaStats.map(((value, index) => Math.round(value * precision)/precision));

        const [best, mean, median] = lastStats;
        const [dBest, dMean, dMedian] = deltaStats;

        return(
            <div className={"popUp-card small loading_screen background"}>
                <div className={"container"}>
                    <div className={"background text_card"}>
                        <h3>Currently Running: Generation {evolution.generationNumber}</h3>
                        <h4>Progress:</h4>
                        <div className={"progress_container"}>
                            <div style={styleBar} className={"fill"} />
                        </div>
                        {((evolution.statistics && evolution.statistics.length >= 1) ? (
                            <Fragment>
                                <h3>{"\n"}Last Generation:</h3>
                                <p>
                                    <span className={"title"}>Best Score:</span>
                                    {((best) ? (best) : ("???"))}
                                    <span className={"delta_stats"}>({((dBest > 0) ? (`+${dBest}`) : (`${dBest}`))})</span>
                                </p>
                                <p>
                                    <span className={"title"}>Mean:</span>
                                    {((mean) ? (mean) : ("???"))}
                                    <span className={"delta_stats"}>({((dMean > 0) ? (`+${dMean}`) : (`${dMean}`))})</span>
                                </p>
                                <p>
                                    <span className={"title"}>Median:</span>
                                    {((median) ? (median) : ("???"))}
                                    <span className={"delta_stats"}>({((dMedian > 0) ? (`+${dMedian}`) : (`${dMedian}`))})</span>
                                </p>
                            </Fragment>
                        ) : (
                            <h3>No Past Generation To Show</h3>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.interval = setInterval(() => this.forceUpdate(), 100);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
}

class GameMenu extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            score: 0,
            tickRate: defaultTickRate,
            paused: false,
            playing: "???",
            selectedSnake: 0,
            selectedSnakeGen: 0,
            popupActive: 0,
            popupMetaInfo: null,
            infiniteEvolve: false,
            evolutionLoading: false
        };

        // bind functions
        this.startSnakeButton = this.startSnakeButton.bind(this);
        this.changeTickRate = this.changeTickRate.bind(this);
        this.pauseButton = this.pauseButton.bind(this);
        this.unpauseButton = this.unpauseButton.bind(this);

        this.openPopUp = this.openPopUp.bind(this);
        this.closePopUp = this.closePopUp.bind(this);
        this.changeLoadedSnakes = this.changeLoadedSnakes.bind(this);
        this.spliceLoadedSnakes = this.spliceLoadedSnakes.bind(this);
        this.changeEvolution = this.changeEvolution.bind(this);

        this.keyEventInDown = this.keyEventInDown.bind(this);
        this.keyEventInUp = this.keyEventInUp.bind(this);

        this.startDraw = this.startDraw.bind(this);
        this.draw = this.draw.bind(this);

        this.callbackEndCurrent = this.callbackEndCurrent.bind(this);
        this.getSelectedSnake = this.getSelectedSnake.bind(this);
        this.showcaseRandomEvolutionSnake = this.showcaseRandomEvolutionSnake.bind(this);
        this.startSnake = this.startSnake.bind(this);
        this.startRunner = this.startRunner.bind(this);

        this.evolutionReady = this.evolutionReady.bind(this);
        this.evolveButton = this.evolveButton.bind(this);
        this.infiniteButton = this.infiniteButton.bind(this);

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s)), changeEvolution(newEvolution)
        this.popUpFuncs = {
            close: this.closePopUp,
            changeSelected: (i) => this.setState(() => ({selectedSnake: i})),
            changeSelectedGen: (i) => this.setState(() => ({selectedSnakeGen: i})),
            changeLoaded: this.changeLoadedSnakes,
            spliceLoaded: this.spliceLoadedSnakes,
            changeEvolution: this.changeEvolution
        };

        // needed refs
        this.pausePlayButtonRef = React.createRef();
        this.subCanvasRef = React.createRef();

        // evolution
        // shell
        this.changeEvolution(defaultEvolution);

        // runner variables
        // the instance of singleSnakeRunner which is running
        this.runningInstance = null;
        this.runningInstanceOld = null;
        // tick rate bounds (actual tickRate is in state)
        this.tickRateLowerBound = 1;
        this.tickRateUpperBound = 99999;
        // fps
        this.then = 0;
        this.now = 0;
        this.fps = defaultFPS;
        this.drawing = false;

        this.showcase = true;

        // keyEvents: note that it is using keyDown instead of keyPress because keyPress doesn't register arrowKeys, shift, etc
        document.addEventListener("keydown", this.keyEventInDown, false);
        // set of keys down to prevent double presses for holding down, stores the keyEvent.key's
        this.keysDown = new Set();
        document.addEventListener("keyup", this.keyEventInUp, false);
    }
    render() {
        // popUps
        let popUp = null;
        if(this.state.popupActive) {
            // 1 = select snake
            if (this.state.popupActive === 1) {
                popUp = (
                    <SelectSnakePopUpREACT metaInfo={this.state.popupMetaInfo} selectedSnake={this.state.selectedSnake} selectedSnakeGen={this.state.selectedSnakeGen} popUpFuncs={this.popUpFuncs} loadedSnakesIn={loadedSnakes} />
                );
            }
            // 2 = create/edit snake
            else if(this.state.popupActive === 2){
                popUp = (
                    <CreateSnakePopUpREACT metaInfo={this.state.popupMetaInfo} popUpFuncs={this.popUpFuncs} loadedSnakesIn={loadedSnakes} />
                );
            }
            // 3 = create/edit generation
            else if(this.state.popupActive === 3){
                popUp = (
                    <EditEvolutionPopUp metaInfo={this.state.popupMetaInfo} popUpFuncs={this.popUpFuncs} evolutionIn={this.evolutionShell.evolution} />
                );
            }
        }

        return(
            <SquareFill parentRef={this.props.parentRef}>
                {((this.state.evolutionLoading) ? (
                    <LoadScreen evolution={this.evolutionShell.evolution} />
                ) : null)}
                {popUp}
                <SubCanvas refIn={this.subCanvasRef} />
                <div className={"ui_layer"}>
                    <div className={"inline_block_parent wrapper_div"}>
                        <FadeMenu>
                            <h3>Selected: {loadedSnakes[this.state.selectedSnake].getComponentName()}</h3>
                            <Button className={"gameButton"} onClick={this.startSnakeButton}>
                                Play
                            </Button>
                            <Button className={"gameButton"} onClick={() => this.openPopUp(1)}>
                                Load
                            </Button>
                            <Button className={"gameButton"} onClick={() => this.openPopUp(2)}>
                                New Snake
                            </Button>
                            <h3>Generation: {((this.evolutionShell.evolution) ? (this.evolutionShell.evolution.generationNumber) : (0))}</h3>
                            <Button className={"gameButton"} onClick={() => this.evolveButton()}>
                                Evolve
                            </Button>
                            <Button className={"gameButton"} onClick={() => this.openPopUp(3)}>
                                Edit Evolution
                            </Button>
                            <div className={"inline_block_parent"}>
                                <input type={"checkbox"} name={"infinite_evolve"} checked={this.state.infiniteEvolve} onChange={this.infiniteButton} />
                                <label htmlFor={"infinite_evolve"}>Evolve Infinitely</label>
                            </div>
                        </FadeMenu>
                        <TypewriterText className={"playing_text"}>
                            <h2>
                                Playing: {this.state.playing}
                            </h2>
                        </TypewriterText>
                        <div className={"score_text"}>
                            <h2>
                                {"Score: " + (`\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0${this.state.score}`).slice(-8)}
                            </h2>
                        </div>
                    </div>
                    <div className={"bottom_ui"}>
                        <FadeDiv shouldReset={true}>
                            <h3>Tick Rate: {JSON.stringify(this.state.tickRate)}</h3>
                        </FadeDiv>
                        <div className={"inline_block_parent"}>
                            <MouseFadeDiv padding={.3} speed={3.6}>
                                <HoldButton speed={1} growth={2} maxRate={this.tickRateUpperBound - this.tickRateLowerBound} onClick={(multi) => {this.changeTickRate(-1 * multi)}}>
                                    <ImgIcon className={"wrapper_div"} small={2} src={"src/Images/rewind-button-360x360.png"}/>
                                </HoldButton>
                                <ToggleButton ref={this.pausePlayButtonRef}>
                                    <Button onClick={this.pauseButton}>
                                        <ImgIcon className={"wrapper_div"} small={2} src={"src/Images/pause-button-200x200.png"}/>
                                    </Button>
                                    <Button onClick={this.unpauseButton}>
                                        <ImgIcon className={"wrapper_div"} small={2} src={"src/Images/play-button-200x200.png"}/>
                                    </Button>
                                </ToggleButton>
                                <HoldButton speed={1} growth={2} maxRate={this.tickRateUpperBound - this.tickRateLowerBound} onClick={(multi) => {this.changeTickRate(1 * multi)}}>
                                    <ImgIcon className={"wrapper_div"} small={2} src={"src/Images/fast-forward-button-360x360.png"}/>
                                </HoldButton>
                            </MouseFadeDiv>
                        </div>
                    </div>
                </div>
            </SquareFill>
        );
    }

    // button functions
    startSnakeButton(){
        this.showcase = false;

        this.startSnake(this.getSelectedSnake());
    }
    changeTickRate(val){
        this.setState((state) => ({tickRate: Math.max(this.tickRateLowerBound, Math.min(this.tickRateUpperBound, state.tickRate + val))}), () => {
            if(this.runningInstance){
                this.runningInstance.changeTickRate(this.state.tickRate);
            }
        });
    }
    pauseButton(){
        this.setState((state) => ({paused: true}), () => {
            if(this.runningInstance){
                this.runningInstance.pause();
            }
        });
    }
    unpauseButton(){
        this.setState((state) => ({paused: false}), () => {
            this.startDraw();
            if(this.runningInstance){
                this.runningInstance.unpause();
            }
            else{
                this.startSnake(this.getSelectedSnake());
            }
        });
    }

    // popup stuff
    // opens a popup
    openPopUp(i, info = null){
        this.showcase = false;

        this.setState(() => ({
            popupActive: i,
            popupMetaInfo: info
        }));
        if(!this.state.paused){
            this.pausePlayButtonRef.current.clicked();
        }
    }
    // pass as function to popups, optional parameter closes the current popup and immediately opens another
    closePopUp(toOpen = 0, info = null){
        this.setState(() => ({
            popupActive: toOpen,
            popupMetaInfo: info
        }), () => {
            // unpause the snake if it isn't player controlled
            if(this.state.popupActive === 0 && this.runningInstance && this.state.paused && this.runningInstance.mySnake.myBrain.componentID !== 1){
                this.pausePlayButtonRef.current.clicked();
            }
        });
    }
    changeLoadedSnakes(newVer){
        loadedSnakes = newVer;
    }
    spliceLoadedSnakes(start, deleteCount = 0, items = null){
        if(items && items instanceof SnakeSpecies){
            loadedSnakes.splice(start, deleteCount, items);
        }
        else if(items){
            loadedSnakes.splice(start, deleteCount, new SnakeSpecies(items));
        }
        else if(deleteCount){
            loadedSnakes.splice(start, deleteCount);
        }
        else{
            loadedSnakes.splice(start);
        }
    }
    changeEvolution(newEvolution){
        this.evolutionShell = new EvolutionShell(this.evolutionReady, this.popUpFuncs);
        this.evolutionShell.createEvolution(newEvolution);
    }

    // called on keyEvent press
    keyEventInDown(keyEvent){
        if(this.state.popupActive === 0) {
            if (!this.keysDown.has(keyEvent.key)) {
                if (this.runningInstance) {
                    this.runningInstance.keyEventIn(keyEvent);
                } else {
                    console.log("Main menu keyEvent when not running: " + keyEvent + ", key: " + keyEvent.key);
                }

                // pause/unpause on space
                if (keyEvent.key === " " || keyEvent.key === "p" || keyEvent.key === "P") {
                    this.pausePlayButtonRef.current.clicked();
                }
                this.keysDown.add(keyEvent.key);
            }
        }
    }
    keyEventInUp(keyEvent){
        if(this.state.popupActive === 0) {
            if (this.keysDown.has(keyEvent.key)) {
                this.keysDown.delete(keyEvent.key);
            }
        }
    }

    // drawing
    // begins the draw loop
    startDraw(){
        if(!this.drawing) {
            this.drawing = true;
            this.then = Date.now();
            this.draw();
        }
    }
    // draw loop
    draw(){
        if(this.runningInstance){
            // when paused stop draw loop, draw one last time
            if(this.state.paused){
                this.runningInstance.draw(this.subCanvasCTX);
                if(this.runningInstance.mySnake.myLength !== this.state.score) {
                    this.setState((state) => ({score: this.runningInstance.mySnake.myLength}));
                }
                this.drawing = false;
                return;
            }

            // regular draw
            let fpsInterval = 1000 / this.fps;

            // request another frame
            requestAnimationFrame(() => {this.draw()});

            // calc time elapsed
            this.now = Date.now();
            let elapsed = this.now - this.then;

            // draw next frame when needed
            if (elapsed > fpsInterval) {
                // Get ready for next frame by setting then=now, but also adjust for your
                // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
                this.then = this.now - (elapsed % fpsInterval);

                this.runningInstance.draw(this.subCanvasCTX);
                if(this.runningInstance.mySnake.myLength !== this.state.score) {
                    this.setState((state) => ({score: this.runningInstance.mySnake.myLength}));
                }
            }
        }
        else{
            this.drawing = false;
        }
    }

    // runner interaction methods
    callbackEndCurrent(){
        // last draw call + score update
        this.runningInstance.draw(this.subCanvasCTX);
        this.setState((state) => ({score: this.runningInstance.mySnake.myLength}));
        if(!this.state.paused){
            this.pausePlayButtonRef.current.clicked();
        }
        this.runningInstanceOld = this.runningInstance;
        this.runningInstance = null;

        if(this.showcase){
            setTimeout(() => this.showcaseRandomEvolutionSnake(), 1000);
        }
        else if(this.evolutionShell && (this.evolutionShell.runningGen || this.evolutionShell.viewQueue.size > 0)){
            setTimeout(() => this.evolutionShell.runQueue(this.startSnake, this.startRunner), 1000);
        }
    }
    getSelectedSnake(){
        return loadedSnakes[this.state.selectedSnake].snakes[this.state.selectedSnakeGen].cloneMe();
    }
    showcaseRandomEvolutionSnake(){
        console.log(loadedSnakes);

        let filtered = loadedSnakes.filter((value, index) => {
            const snekBrain = value.snakes[value.getLength()-1].myBrain;

            // only snakes which play by themselves
            if(evolutionBrains.includes(snekBrain.componentID)){
                // only previously evolved snakes
                if(snekBrain.hasValues && (snekBrain.myMat[0][2][0] !== snekBrain.startBias || snekBrain.myMat[0][1][0][0] !== snekBrain.startWeight/Math.sqrt(snekBrain.myMat[0][0].length))){
                    return true;
                }
            }
            return false;
        });

        const snek = filtered[Math.floor(Math.random() * filtered.length)].cloneMe();
        const timeOut = (length) => (snek.gridSize*timeoutInitMultiplier + snek.gridSize*length*timeoutInitMultiplier2);

        this.startRunner(new SingleSnakeRunner(snek, ((this.state.tickRate === defaultTickRate) ? (showcaseTickRate * snek.gridSize/showcaseGridSize) : (this.state.tickRate)), () => this.callbackEndCurrent(), timeOut));
    }
    startSnake(snake){
        let runner;
        // special runners for special cases
        if(snake.uuid && snake.uuid === "Mother's Day!!!"){
            runner = new SingleSnakeRunner(snake, this.state.tickRate, this.callbackEndCurrent.bind(this), null, pathAppleSpawn);
        }
        else if(evolutionBrains.includes(snake.myBrain.componentID)) {
            const timeOut = (length) => (snake.gridSize*timeoutInitMultiplier + snake.gridSize*length*timeoutInitMultiplier2);

            runner = new SingleSnakeRunner(snake, this.state.tickRate, this.callbackEndCurrent.bind(this), timeOut);
        }
        else{
            runner = new SingleSnakeRunner(snake, this.state.tickRate, () => this.callbackEndCurrent());
        }
        this.startRunner(runner);
    }
    startRunner(runner){
        if(runner instanceof EvolutionLoadScreen){
            this.setState((state) => ({evolutionLoading: true}));
        }

        // clear canvas
        if(this.runningInstance){
            if(this.runningInstance instanceof EvolutionLoadScreen){
                this.setState((state) => ({evolutionLoading: false}));
            }

            this.runningInstance.kill();
            this.runningInstanceOld = this.runningInstance;

            // clear canvas
            if(this.subCanvasCTX){
                this.subCanvasCTX.clearRect(0, 0, subCanvasInnerSize, subCanvasInnerSize);
            }
            else {
                this.subCanvasRef.current.width = subCanvasInnerSize;
                this.subCanvasRef.current.height = subCanvasInnerSize;
            }
        }
        this.runningInstance = runner;
        // reset display
        this.setState((state) => ({
            score: this.runningInstance.mySnake.myLength,
            playing: this.runningInstance.mySnake.getComponentName()
        }));

        this.runningInstance.focusMe();
        this.startDraw();
        this.runningInstance.startMe();
        if(this.state.paused){
            this.runningInstance.pause();
            this.pausePlayButtonRef.current.clicked();
        }
    }

    // evolution shell interaction methods
    // called by the shell when it has something new to show
    evolutionReady(){
        // console.log("Game Menu evolutionReady");
        if(!this.runningInstance || (this.runningInstance instanceof EvolutionLoadScreen)){
            this.evolutionShell.runQueue(this.startSnake, this.startRunner);
        }
    }
    evolveButton(){
        this.showcase = false;
        this.evolutionShell.runGen();
        this.evolutionShell.runQueue(this.startSnake, this.startRunner);
    }
    infiniteButton(){
        this.setState((state) => ({
            infiniteEvolve: !state.infiniteEvolve
        }), () => {
            if(this.evolutionShell){
                this.evolutionShell.infiniteRun = this.state.infiniteEvolve;
            }
        });
    }

    // REACT lifecycle
    componentDidMount() {
        this.subCanvasCTX = this.subCanvasRef.current.getContext("2d");

        this.showcaseRandomEvolutionSnake();
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", () => this.keyEventInDown, false);
        document.removeEventListener("keyup", () => this.keyEventInUp, false);
    }
}