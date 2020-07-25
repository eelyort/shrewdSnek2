// snakes and whatnot react components

// functions for drawing input, brain, output on a canvas - returns array of arrays of centers
//   scale is the maxValue for fill color
function DrawInput(ctx, brain, width, height, xOffset = 0, yOffset = 0, outlineColor = "#000000", scale = 100) {
    // no input
    if(brain.myInputWidth <= 0){
        // draw a big X lol
        ctx.lineWidth = Math.max(weightLineWidth*5, Math.min(width, height)/8);
        ctx.strokeStyle = "#FF0000";

        ctx.beginPath();
        ctx.moveTo(width/10 + xOffset, height/10 + yOffset);
        ctx.lineTo(width/10 * 9 + xOffset, height/10 * 9 + yOffset);
        ctx.stroke();
        ctx.closePath();

        return;
    }
    // side length
    const sideLength = Math.floor(Math.min(width/3, height/((brain.myInputWidth * 2) + 1)));
    const leftPadding = Math.round((width - sideLength)/2);
    const borderWidth = Math.max(minOutlineWidth, Math.floor(sideLength * outlinePercent));

    // console.log(`width: ${width}, height: ${height}, myInputWidth: ${brain.myInputWidth}, sideLength: ${sideLength}, leftPadding: ${leftPadding}, borderWidth: ${borderWidth}, borderWidth2: ${Math.floor(sideLength * 0.18)}`);

    const halfSide = sideLength/2;

    let centers = [];

    for (let i = 0; i < brain.myInputWidth; i++) {
        const [x, y] = [leftPadding + xOffset, (((i*2) + 1) * sideLength) + yOffset];
        centers.push([x + halfSide, y + halfSide]);

        // draw outline - fill because stroke doesn't work well at small resolutions
        ctx.fillStyle = outlineColor;
        ctx.beginPath();
        ctx.rect(x, y, sideLength, sideLength);
        ctx.fill();
        ctx.closePath();
        ctx.clearRect(x + borderWidth, y + borderWidth, sideLength - (2*borderWidth), sideLength - (2*borderWidth));
    }
    return centers;
}
function DrawBrain(ctx, brain, width, height, xOffset = 0, yOffset = 0, outlineColor = "#000000", scale = 100){
    // side length
    const sideLength = Math.floor(Math.min(width/((brain.myDepth * 2) + 1), height/((brain.myWidth * 2) + 1)));
    const extraHorzSpace = (width - sideLength*(brain.myDepth*2 + 1))/(brain.myDepth + 1);
    const extraVertSpace = (height - sideLength*(brain.myWidth*2 + 1))/(brain.myWidth + 1);
    const borderWidth = Math.max(minOutlineWidth, Math.floor(sideLength * outlinePercent));

    // console.log(`width: ${width}, height: ${height}, myWidth: ${brain.myWidth}, sideLength: ${sideLength}, extraHorzSpace: ${extraHorzSpace}, extraVertSpace: ${extraVertSpace}, borderWidth: ${borderWidth}, borderWidth2: ${Math.floor(sideLength * 0.18)}`);

    const halfSide = sideLength/2;

    let centers = [];

    // layers
    for(let c = 0; c < brain.myDepth; c++){
        centers.push([]);
        // nodes
        for(let r = 0; r < brain.myWidth; r++){
            const [x, y] = [(((c*2) + 1) * sideLength) + (extraHorzSpace * (c+1)) + xOffset, (((r*2) + 1) * sideLength) + (extraVertSpace * (r+1)) + yOffset];
            centers[c].push([x + halfSide, y + halfSide]);

            // draw outline - fill because stroke doesn't work well at small resolutions
            ctx.fillStyle = outlineColor;
            ctx.beginPath();
            ctx.rect(x, y, sideLength, sideLength);
            ctx.fill();
            ctx.closePath();
            ctx.clearRect(x + borderWidth, y + borderWidth, sideLength - (2*borderWidth), sideLength - (2*borderWidth));

            // fill with red for negative numbers, blue for positive
            if(brain.hasValues){
                const curr = brain.myMat[c][2][r];
                let opacity = Math.round(Math.min(Math.abs(curr)/scale, 1) * 100)/100;
                if(curr > 0) {
                    ctx.fillStyle = `rgba(0, 0, 255, ${opacity})`;
                }
                else{
                    ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
                }
                // console.log(`curr: ${curr}, opacity: ${opacity}, fillStyle: ${ctx.fillStyle}`);
                ctx.beginPath();
                ctx.rect(x + borderWidth, y + borderWidth, sideLength - (2*borderWidth), sideLength - (2*borderWidth));
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    return centers;
}
function DrawOutput(ctx, brain, width, height, xOffset = 0, yOffset = 0, outlineColor = "#000000", scale = 100) {
    // side length
    const sideLength = Math.floor(Math.min(width/3, height/((4 * 2) + 1)));
    const leftPadding = Math.round((width - sideLength)/2);
    const borderWidth = Math.max(minOutlineWidth, Math.floor(sideLength * outlinePercent));

    // console.log(`width: ${width}, height: ${height}, 4: ${4}, sideLength: ${sideLength}, leftPadding: ${leftPadding}, borderWidth: ${borderWidth}, borderWidth2: ${Math.floor(sideLength * 0.18)}`);

    const halfSide = sideLength/2;

    let centers = [];

    for (let i = 0; i < 4; i++) {
        const [x, y] = [leftPadding + xOffset, (((i*2) + 1) * sideLength) + yOffset];
        centers.push([x + halfSide, y + halfSide]);

        // draw outline - fill because stroke doesn't work well at small resolutions
        ctx.fillStyle = outlineColor;
        ctx.beginPath();
        ctx.rect(x, y, sideLength, sideLength);
        ctx.fill();
        ctx.closePath();
        ctx.clearRect(x + borderWidth, y + borderWidth, sideLength - (2*borderWidth), sideLength - (2*borderWidth));

        // fill with red for negative numbers, blue for positive
        if(brain.hasValues){
            const curr = brain.myMat[brain.myDepth][2][i];
            let opacity = Math.round(Math.min(Math.abs(curr)/scale, 1) * 100)/100;
            if(curr > 0) {
                ctx.fillStyle = `rgba(0, 0, 255, ${opacity})`;
            }
            else{
                ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
            }
            // console.log(`curr: ${curr}, opacity: ${opacity}, fillStyle: ${ctx.fillStyle}`);
            ctx.beginPath();
            ctx.rect(x + borderWidth, y + borderWidth, sideLength - (2*borderWidth), sideLength - (2*borderWidth));
            ctx.fill();
            ctx.closePath();
        }
    }
    return centers;
}

// blank subcanvas
class BlankSubCanvas extends React.Component{
    render() {
        const{width: width, height: height, refIn: refIn} = this.props;

        return(
            <canvas className={"subCanvas" + ((this.props.className) ? (" " + this.props.className) : (""))} width={subCanvasInnerSize * ((width) ? (width) : (1))} height={subCanvasInnerSize * ((height) ? (height) : (1))} ref={refIn} />
        );
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

// extra brain details
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
    startRun(){
        const {brain: brain, speed: speed, gridSize: gridSize} = this.props;
        let rawPath = brain.myRawPath;

        this.ctx = this.subCanvasRef.current.getContext("2d");

        // clear old
        if(this.interval){
            clearInterval(this.interval);
        }
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

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
    componentDidMount() {
        this.startRun();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.startRun();
    }

    componentWillUnmount() {
        if(this.interval){
            clearInterval(this.interval);
        }
    }
}
// neural net
class BrainDetailsNet extends React.Component{
    constructor(props){
        super(props);

        this.subCanvasRef = React.createRef();

        this.draw = this.draw.bind(this);
    }
    render() {
        const {brain: brain, speed: speed, gridSize: gridSize} = this.props;

        return(
            <BlankSubCanvas width={2} className={""} refIn={this.subCanvasRef} />
        );
    }
    draw(){
        const {brain: brain, speed: speed, gridSize: gridSize} = this.props;
        let ctx = this.subCanvasRef.current.getContext("2d");
        const mat = brain.myMat;

        // clear
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // bias scale - basically find the max bias
        let biasScale = 0;
        if(brain.hasValues) {
            // layer
            for (let layer = 0; layer < mat.length; layer++) {
                // node
                for (let node = 0; node < mat[layer][2].length; node++) {
                    biasScale = Math.max(biasScale, Math.abs(mat[layer][2][node]));
                }
            }
        }
        // weight scale
        let weightScale = 0;
        if(brain.hasValues){
            // layer
            for (let layer = 0; layer < mat.length; layer++) {
                // destination node
                for (let node = 0; node < mat[layer][1].length; node++) {
                    // src node
                    for (let src = 0; src < mat[layer][1][node].length; src++) {
                        weightScale = Math.max(weightScale, Math.abs(mat[layer][1][node][src]));
                    }
                }
            }
        }
        // console.log(`biasScale: ${biasScale}, weightScale: ${weightScale}`);

        let widthUsed = Math.floor(ctx.canvas.width/4);

        // draw inputs
        let centers = [DrawInput(ctx, brain, widthUsed, ctx.canvas.height, 0, 0, "#000000")];
        // console.log("input:");
        // console.log(centers);

        // draw brain
        let curr = DrawBrain(ctx, brain, Math.floor(ctx.canvas.width/2), ctx.canvas.height, widthUsed, 0, "#000000", biasScale);
        centers = centers.concat(DrawBrain(ctx, brain, Math.floor(ctx.canvas.width/2), ctx.canvas.height, widthUsed, 0, "#000000", biasScale));
        widthUsed += Math.floor(ctx.canvas.width/2);
        // console.log("brain:");
        // console.log(centers);

        // draw outputs
        centers.push(DrawOutput(ctx, brain, Math.floor(ctx.canvas.width/4), ctx.canvas.height, widthUsed, 0, "#000000", biasScale));
        // console.log("output:");
        // console.log(centers);

        // weights
        if(brain.hasValues){
            // console.log(centers);
            ctx.lineWidth = weightLineWidth;

            // layer
            for (let layer = 0; layer < mat.length; layer++) {
                // destination node
                for (let targetNode = 0; targetNode < mat[layer][1].length; targetNode++) {
                    // src node
                    for (let srcNode = 0; srcNode < mat[layer][1][targetNode].length; srcNode++) {
                        const currVal = mat[layer][1][targetNode][srcNode];
                        const [srcX, srcY] = centers[layer][srcNode];
                        const [targetX, targetY] = centers[layer + 1][targetNode];

                        // console.log(`layer: ${layer}, target: ${targetNode}, src: ${srcNode}, currVal: ${currVal}, srcCoord: ${[srcX, srcY]}, targetCoord: ${[targetX, targetY]}`);

                        let opacity = Math.round(Math.min(Math.abs(currVal)/(weightScale/weightLineOpacityMultiplier), 1) * 100)/100;
                        opacity = Math.max(opacity, weightLineMinOpacity);
                        if(currVal > 0) {
                            ctx.strokeStyle = `rgba(0, 0, 255, ${opacity})`;
                        }
                        else{
                            ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
                        }
                        // console.log(`curr: ${curr}, opacity: ${opacity}, fillStyle: ${ctx.fillStyle}`);
                        ctx.beginPath();
                        ctx.moveTo(srcX, srcY);
                        ctx.lineTo(targetX, targetY);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }
    }
    componentDidMount() {
        this.draw();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.draw();
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
        else if(brain instanceof NeuralNetBrain){
            extraDetails = (
                <BrainDetailsNet gridSize={gridSize} className={"category_text"} brain={brain} speed={speed} />
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

// snake details || props: snake = snake to display
class SnakeDetails extends React.Component{
    render(){
        const {snake: snake} = this.props;

        const speed = 3.5;

        return(
            <div className={"snake_details" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <h1>{snake.getComponentName()}</h1>
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

// editable snake details || props: snake = snake to display/edit
class SnakeDetailsEdit extends React.Component{
    render(){
        console.log("SnakeDetailsEdit Render");

        const {snake: snake} = this.props;

        const speed = 3.5;

        return(
            <div className={"snake_details" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <TextArea onChange={(val) => {
                    snake.setName(val);
                    this.forceUpdate();
                }}>
                    <h1>{snake.getComponentName()}</h1>
                </TextArea>
                <p className={"category_text_title"}>Description</p>
                <TextArea onChange={(val) => {
                    snake.componentDescription = val;
                    this.forceUpdate();
                }}>
                    <p className={"category_text"}>{snake.getComponentDescription()}</p>
                </TextArea>
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