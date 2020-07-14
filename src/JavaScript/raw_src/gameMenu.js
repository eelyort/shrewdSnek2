// REACT

class SubCanvas extends React.Component{
    render() {
        return(
            <canvas ref={this.props.ref} className={"subGameCanvas background"} />
        );
    }
}

class GameMenu extends React.Component{
    constructor(props){
        super(props);

        this.subCanvasRef = React.createRef();

        this.state = {
            score: 0,
            tickRate: 20,
            paused: false,
            playing: "???"
        };

        // bind functions
        this.changeTickRate = this.changeTickRate.bind(this);
        this.startSnakeButton = this.startSnakeButton.bind(this);
        this.keyEventInUp = this.keyEventInUp.bind(this);
        this.keyEventInDown = this.keyEventInDown.bind(this);
        this.pauseButton = this.pauseButton.bind(this);
        this.unpauseButton = this.unpauseButton.bind(this);

        // evolution
        // shell
        this.evolutionShell = new EvolutionShell(); // TODO: it takes MainMenu as input atm for some reason

        // runner variables
        // the instance of singleSnakeRunner which is running
        this.runningInstance = null;
        // tick rate bounds (actual tickRate is in state)
        this.tickRateLowerBound = 1;
        this.tickRateUpperBound = 99999;
        // fps
        this.then = 0;
        this.now = 0;
        this.fps = defaultFPS;

        // TODO: popups


        // keyEvents: note that it is using keyDown instead of keyPress because keyPress doesn't register arrowKeys, shift, etc
        document.addEventListener("keydown", () => this.keyEventInDown, false);
        // set of keys down to prevent double presses for holding down, stores the keyEvent.key's
        this.keysDown = new Set();
        document.addEventListener("keyup", () => this.keyEventInUp, false);
    }
    render() {
        return(
            <SquareFill parentRef={this.props.parentRef}>
                <SubCanvas ref={this.subCanvasRef} />
                <div className={"ui_layer"}>
                    <div className={"inline_block_parent wrapper_div"}>
                        <FadeMenu>
                            <Button className={"gameButton"} onClick={this.startSnakeButton}>
                                Play
                            </Button>
                            <Button className={"gameButton"} onClick={this.startSnakeButton}>
                                Load
                            </Button>
                            <Button className={"gameButton"} onClick={this.startSnakeButton}>
                                Play
                            </Button>
                        </FadeMenu>
                        <TypewriterText className={"playing_text"}>
                            <h2>
                                Playing: {this.state.playing}
                            </h2>
                        </TypewriterText>
                        <div className={"score_text"} reverse={true}>
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
                            <HoldButton speed={1.8} growth={1.6} maxRate={this.tickRateUpperBound - this.tickRateLowerBound} onClick={(multi) => {this.changeTickRate(-1 * multi)}}>
                                <ImgIcon className={"wrapper_div"} small={2} src={"src/Images/rewind-button-360x360.png"}/>
                            </HoldButton>
                            <ToggleButton>
                                <Button onClick={this.pauseButton}>
                                    <ImgIcon className={"wrapper_div"} small={2} src={"src/Images/pause-button-200x200.png"}/>
                                </Button>
                                <Button onClick={this.unpauseButton}>
                                    <ImgIcon className={"wrapper_div"} small={2} src={"src/Images/play-button-200x200.png"}/>
                                </Button>
                            </ToggleButton>
                            <HoldButton speed={1.8} growth={1.6} maxRate={this.tickRateUpperBound - this.tickRateLowerBound} onClick={(multi) => {this.changeTickRate(1 * multi)}}>
                                <ImgIcon className={"wrapper_div"} small={2} src={"src/Images/fast-forward-button-360x360.png"}/>
                            </HoldButton>
                        </div>
                    </div>
                </div>
            </SquareFill>
        );
    }
    changeTickRate(val){
        this.setState((state) => ({tickRate: Math.max(this.tickRateLowerBound, Math.min(this.tickRateUpperBound, state.tickRate + val))}));
    }
    startSnakeButton(){
        console.log("start snake button");
        // TODO
    }
    pauseButton(){
        // console.log("pause button");
        // console.log(this.state);
        this.setState((state) => ({paused: true}));
    }
    unpauseButton(){
        // console.log("unpause button");
        // console.log(this.state);
        this.setState((state) => ({paused: false, tickRate: state.tickRate+1}));
    }

    // called on keyEvent press
    keyEventInDown(keyEvent){
        if(!this.keysDown.has(keyEvent.key)) {
            if (this.isRunning) {
                this.runningInstance.keyEventIn(keyEvent);
            } else {
                // alert("Main menu keyEvent when not running: " + keyEvent + ", key: " + keyEvent.key);
            }

            // pause/unpause on space
            if(keyEvent.key == " " || keyEvent.key == "p" || keyEvent.key == "P"){
                // TODO
            }
            this.keysDown.add(keyEvent.key);
        }
    }
    keyEventInUp(keyEvent){
        if(this.keysDown.has(keyEvent.key)){
            this.keysDown.delete(keyEvent.key);
            // alert(keyEvent.key + ": up");
        }
    }
}