// REACT

class SubCanvas extends React.Component{
    render() {
        return(
            <canvas width={subCanvasInnerSize} height={subCanvasInnerSize} ref={this.props.refIn} className={"subGameCanvas background"} />
        );
    }
}

class GameMenu extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            score: 0,
            tickRate: 20,
            paused: false,
            playing: "???",
            selectedSnake: 0
        };

        // bind functions
        this.startSnakeButton = this.startSnakeButton.bind(this);
        this.loadSnakeButton = this.loadSnakeButton.bind(this);
        this.changeTickRate = this.changeTickRate.bind(this);
        this.pauseButton = this.pauseButton.bind(this);
        this.unpauseButton = this.unpauseButton.bind(this);
        this.keyEventInDown = this.keyEventInDown.bind(this);
        this.keyEventInUp = this.keyEventInUp.bind(this);
        this.startDraw = this.startDraw.bind(this);
        this.draw = this.draw.bind(this);
        this.callbackEndCurrent = this.callbackEndCurrent.bind(this);
        this.startSelectedSnake = this.startSelectedSnake.bind(this);
        this.startRunner = this.startRunner.bind(this);

        // needed refs
        this.pausePlayButtonRef = React.createRef();
        this.subCanvasRef = React.createRef();

        // evolution
        // shell
        this.evolutionShell = new EvolutionShell(); // TODO: it takes MainMenu as input atm for some reason

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

        // TODO: popups


        // keyEvents: note that it is using keyDown instead of keyPress because keyPress doesn't register arrowKeys, shift, etc
        document.addEventListener("keydown", this.keyEventInDown, false);
        // set of keys down to prevent double presses for holding down, stores the keyEvent.key's
        this.keysDown = new Set();
        document.addEventListener("keyup", this.keyEventInUp, false);
    }
    render() {
        return(
            <SquareFill parentRef={this.props.parentRef}>
                <SubCanvas refIn={this.subCanvasRef} />
                <div className={"ui_layer"}>
                    <div className={"inline_block_parent wrapper_div"}>
                        <FadeMenu>
                            <TypewriterText>
                                <h3>Selected: {loadedSnakes[this.state.selectedSnake].getComponentName()}</h3>
                            </TypewriterText>
                            <Button className={"gameButton"} onClick={this.startSnakeButton}>
                                Play
                            </Button>
                            <Button className={"gameButton"} onClick={this.loadSnakeButton}>
                                Load
                            </Button>
                            <Button className={"gameButton"} onClick={this.startSnakeButton}>
                                Dunno
                            </Button>
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
                        </div>
                    </div>
                </div>
            </SquareFill>
        );
    }

    // button functions
    startSnakeButton(){
        console.log("start snake button");
        this.startSelectedSnake();
    }
    loadSnakeButton(){
        console.log("TODO: loadSnakeButton()");
    }
    changeTickRate(val){
        this.setState((state) => ({tickRate: Math.max(this.tickRateLowerBound, Math.min(this.tickRateUpperBound, state.tickRate + val))}), () => {
            if(this.runningInstance){
                this.runningInstance.changeTickRate(this.state.tickRate);
            }
        });
    }
    pauseButton(){
        if(this.runningInstance){
            this.runningInstance.pause();
        }
        this.setState((state) => ({paused: true}));
    }
    unpauseButton(){
        if(this.runningInstance){
            this.runningInstance.unpause();
        }
        this.setState((state) => ({paused: false}));
    }

    // called on keyEvent press
    keyEventInDown(keyEvent){
        if(!this.keysDown.has(keyEvent.key)) {
            if (this.runningInstance) {
                this.runningInstance.keyEventIn(keyEvent);
            } else {
                console.log("Main menu keyEvent when not running: " + keyEvent + ", key: " + keyEvent.key);
            }

            // pause/unpause on space
            if(keyEvent.key == " " || keyEvent.key == "p" || keyEvent.key == "P"){
                if(this.runningInstance) {
                    this.pausePlayButtonRef.current.clicked();
                }
                else{
                    this.startSnakeButton();
                }
            }
            this.keysDown.add(keyEvent.key);
        }
    }
    keyEventInUp(keyEvent){
        if(this.keysDown.has(keyEvent.key)){
            this.keysDown.delete(keyEvent.key);
        }
    }

    // drawing
    // begins the draw loop
    startDraw(){
        this.then = Date.now();
        this.draw();
    }
    // draw loop
    draw(){
        if(this.runningInstance){
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
                this.setState((state) => ({score: this.runningInstance.mySnake.myLength}));
            }
        }
    }

    // runner interaction methods
    callbackEndCurrent(){
        // last draw call + score update
        this.runningInstance.draw(this.subCanvasCTX);
        this.setState((state) => ({score: this.runningInstance.mySnake.myLength}));
        this.runningInstanceOld = this.runningInstance;
        this.runningInstance = null;

        // setTimeout(function (){                  TODO
        //     this.evolutionShell.runQueue()
        // }.bind(this), 15);
    }
    startSelectedSnake(){
        let snake = loadedSnakes[this.state.selectedSnake].cloneMe();
        let runner;
        // special runners for special cases
        if(snake.uuid && snake.uuid === "Mother's Day!!!"){
            runner = new SingleSnakeRunner(snake, this.state.tickRate, this.callbackEndCurrent.bind(this), null, pathAppleSpawn);
        }
        else {
            runner = new SingleSnakeRunner(snake, this.state.tickRate, this.callbackEndCurrent.bind(this));
        }
        this.startRunner(runner);
    }
    startRunner(runner){
        // clear canvas
        if(this.runningInstance){
            this.runningInstance.kill();
            this.runningInstanceOld = this.runningInstance;

            this.subCanvasRef.current.width = subCanvasInnerSize;
            this.subCanvasRef.current.height = subCanvasInnerSize;
        }
        this.runningInstance = runner;
        // unpause
        if(this.state.paused){
            this.pausePlayButtonRef.current.clicked();
        }
        // reset display
        this.setState((state) => ({
            score: this.runningInstance.mySnake.myLength,
            playing: this.runningInstance.mySnake.getComponentName()
        }));
        this.runningInstance.focusMe();
        this.startDraw();
        this.runningInstance.startMe();
    }

    // REACT lifecycle
    componentDidMount() {
        // console.log(this.subCanvasRef.current);
        this.subCanvasCTX = this.subCanvasRef.current.getContext("2d");
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", () => this.keyEventInDown, false);
        document.removeEventListener("keyup", () => this.keyEventInUp, false);
    }
}