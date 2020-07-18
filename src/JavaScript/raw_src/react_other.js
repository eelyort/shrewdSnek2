// snakes and whatnot react components

// blank subcanvas
class BlankSubCanvas extends React.Component{
    render() {
        const{width: width, height: height, refIn: refIn} = this.props;

        return(
            <canvas className={"subCanvas" + ((this.props.className) ? (" " + this.props.className) : (""))} width={subCanvasInnerSize * ((width) ? (width) : (1))} height={subCanvasInnerSize * ((height) ? (height) : (1))} ref={refIn} />
        );
    }
}

// an input's details || props: input | speed: typewrite speed
class InputDetails extends React.Component{
    render() {
        const {input: input, speed: speed} = this.props;

        // multiple inputs returns more inputs
        // if(input.componentID === 0){
        if(input instanceof MultipleInput){
            return(
                <Fragment>
                    {input.myInputs.map((item, index) => {
                        return(
                            <InputDetails input={item} speed={speed} className={this.props.className} />
                        );
                    })}
                </Fragment>
            );
        }

        // single input
        // extra details
        let extraDetails = null;
        // if(input.componentID === 2){
        if(input instanceof DirectionalInput){
            extraDetails = (
                <InputDetailsDirectional className={"category_text"} input={input} />
                );
        }
        // input info
        return(
            <Fragment>
                <p className={"category_text_title small"}>{input.getComponentName()}</p>
                <TypewriterText speed={speed}>
                    <p className={"category_text"}>{input.getComponentDescription()}</p>
                </TypewriterText>
                {extraDetails}
            </Fragment>
        )
    }
}
// extra input details
// directional
class InputDetailsDirectional extends React.Component{
    render() {
        const {input: input, speed: speed} = this.props;

        // decode targets
        let targets = input.vals;
        if(targets){
            targets = targets.map((val, i) => {
                return decodeTargetVal(val);
            });
        }
        targets.push("Walls");

        return(
            <TypewriterText speed={speed}>
                <p className={this.props.className}>
                    Targets: {targets.join(", ")}{"\n"}
                    Directions: {input.originalAdjacents.join(", ")}{"\n"}
                </p>
            </TypewriterText>
        );
    }
}

// a brain's details
class BrainDetails extends React.Component{
    render() {
        const {brain: brain, speed: speed, gridSize: gridSize} = this.props;

        // extra details
        let extraDetails = null;
        if(brain instanceof PathBrain){
            extraDetails = (
                <BrainDetailsPath gridSize={gridSize} className={"category_text"} brain={brain} speed={speed} />
            );
        }
        // brain info
        return(
            <Fragment>
                <p className={"category_text_title small"}>{brain.getComponentName()}</p>
                <TypewriterText speed={speed}>
                    <p className={"category_text"}>{brain.getComponentDescription()}</p>
                </TypewriterText>
                {extraDetails}
            </Fragment>
        )
    }
}
// path brain
class BrainDetailsPath extends React.Component{
    // 400/sec
    constructor(props){
        super(props);

        this.subCanvasRef = React.createRef();

        this.interval = null;

        this.update = this.update.bind(this);
    }
    render() {
        const {brain: brain, speed: speed, gridSize: gridSize} = this.props;

        return(
            <BlankSubCanvas className={"black_background"} refIn={this.subCanvasRef} />
        );
    }
    update(){
        const rawPath = this.props.brain.myRawPath;
        for (let i = 0; i < 20; i++) {
            if(this.index === rawPath.length){
                clearInterval(this.interval);
                return;
            }
            // ignore directionals for now
            if(!Array.isArray(rawPath[this.index])){
                i--;
                this.index++;
                continue;
            }
            // update color
            let curr = this.stages[this.stage];
            [this.red, this.green, this.blue] = [this.red + curr[0], this.green + curr[1], this.blue + curr[2]];
            // check if should proceed to next stage
            let [num0, num255] = [0, 0];
            num0 += (this.red === 0);
            num0 += (this.green === 0);
            num0 += this.blue === 0;
            num255 += this.red === 255;
            num255 += this.green === 255;
            num255 += this.blue === 255;
            if(num255 === 2 || num0 === 2){
                this.stage++;
                if(this.stage >= this.stages.length){
                    this.stage = 0;
                }
            }

            // draw square
            let [r, c] = [rawPath[this.index][0], rawPath[this.index][1]];
            this.ctx.fillStyle = `rgba(${this.red}, ${this.green}, ${this.blue}, 1)`;
            this.ctx.beginPath();
            this.ctx.rect(c * this.step, r * this.step, this.step, this.step);
            this.ctx.fill();
            this.ctx.closePath();

            this.index++;
        }
    }
    componentDidMount() {
        const {brain: brain, speed: speed, gridSize: gridSize} = this.props;
        let rawPath = brain.myRawPath;

        this.ctx = this.subCanvasRef.current.getContext("2d");

        this.step = this.ctx.canvas.width/gridSize;

        // draws path with a gradient from green to blue to red to green
        this.red = 0;
        this.green = 255;
        this.blue = 0;

        this.index = 0;
        this.stage = 0;
        this.stages = [[0, 0, 1], [0, -1, 0], [1, 0, 0], [0, 0, -1], [0, 1, 0], [-1, 0, 0]];

        this.runsPerUpdate = 20 + ((rawPath.length > 5000) ? (rawPath.length / 50) : (((rawPath.length > 2000) ? (rawPath.length / 200) : (0))));

        this.interval = setInterval(this.update, 50);
    }
    componentWillUnmount() {
        if(this.interval){
            clearInterval(this.interval);
        }
    }
}

// snake details || props: snake = snake to display
class SnakeDetails extends React.Component{
    render(){
        const {snake: snake} = this.props;

        const speed = 3.5;

        return(
            <div className={"snake_details" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <p className={"category_text_title"}>Description</p>
                <TypewriterText speed={speed}>
                    <p className={"category_text"}>{snake.getComponentDescription()}</p>
                </TypewriterText>
                <p className={"category_text_title"}>Parameters</p>
                <TypewriterText speed={speed}>
                    <p className={"category_text"}>
                        Starting Head Position: {snake.startHeadPos}{"\n"}
                        Starting Length: {snake.myLength}{"\n"}
                        Apple Value: {snake.appleVal}{"\n"}
                        Grid Size: {snake.gridSize}{"\n"}
                    </p>
                </TypewriterText>
                <p className={"category_text_title"}>Input</p>
                <InputDetails input={snake.myInput} speed={speed} />
                <p className={"category_text_title"}>Brain</p>
                <BrainDetails brain={snake.myBrain} gridSize={snake.gridSize} speed={speed} />
            </div>
        );
    }
}