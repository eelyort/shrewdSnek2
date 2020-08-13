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
        const {input: input, speed: speed, edit: edit, editFuncs: editFuncs, multipleIndex: multipleIndex} = this.props;

        // decode targets
        let targets = ["Walls"];
        if(input.vals){
            targets = targets.concat(input.vals.map((val, i) => {
                return decodeTargetVal(val);
            }));
        }

        // static display
        if(!edit) {
            return (
                <TypewriterText speed={speed}>
                    <p className={"" + ((this.props.className) ? (this.props.className) : (""))}>
                        Targets: {targets.join(", ")}{"\n"}
                        Directions: {input.originalAdjacents.join(", ")}{"\n"}
                    </p>
                </TypewriterText>
            );
        }
        // editable
        else{
            const changeFunc = (index, e, isTarget) => {
                const newVal = ((isNaN(e.target.value)) ? (e.target.value) : (parseInt(e.target.value)));

                // handle both targets and directions
                let arr = ((isTarget) ? (input.vals) : (input.originalAdjacents));

                // newVal = -1? delete, otherwise add
                if(newVal === -1){
                    arr.splice(index, 1);
                }
                // modify
                else {
                    arr.splice(index, 1, newVal);
                }
                editFuncs.update();
            };
            return(
                <Fragment>
                    {/*Targets*/}
                    <div className={"inline_block_parent"}>
                        <p className={"" + ((this.props.className) ? (this.props.className) : (""))}>Targets: Walls, </p>
                        {input.vals.map((currTarget, currIndexSelect) => {
                            return(
                                <select value={currTarget} name={`directional_target_${currIndexSelect}`} onChange={(e) => changeFunc(currIndexSelect, e, true)}>
                                    <option value={-1}>----</option>
                                    {possibleTargets.filter((filterVal) => !(input.vals.includes(filterVal) && filterVal !== currTarget)).map(((optionVal, optionIndex) => {
                                        return(
                                            <option value={optionVal}>{decodeTargetVal(optionVal)}</option>
                                        );
                                    }))}
                                </select>
                            );
                        })}
                        <select value={-1} name={`directional_target_${input.vals.length}`} onChange={(e) => changeFunc(input.vals.length, e, true)}>
                            <option value={-1}>----</option>
                            {possibleTargets.filter((value1) => !(input.vals.includes(value1) && value1 !== -1)).map(((value1, index1) => {
                                return(
                                    <option value={value1}>{decodeTargetVal(value1)}</option>
                                );
                            }))}
                        </select>
                    </div>
                    {/*Directions*/}
                    <div className={"inline_block_parent"}>
                        <p className={"" + ((this.props.className) ? (this.props.className) : (""))}>Directions: </p>
                        {input.originalAdjacents.map((currDirection, currIndexSelect) => {
                            return(
                                <select value={currDirection} name={`directional_direction_${currIndexSelect}`} onChange={(e) => changeFunc(currIndexSelect, e, false)}>
                                    <option value={-1}>----</option>
                                    {possibleDirections.filter((filterVal) => !(input.originalAdjacents.includes(filterVal) && filterVal !== currDirection)).map(((optionVal, optionIndex) => {
                                        return(
                                            <option value={optionVal}>{optionVal}</option>
                                        );
                                    }))}
                                </select>
                            );
                        })}
                        <select value={-1} name={`directional_direction_${input.originalAdjacents.length}`} onChange={(e) => changeFunc(input.originalAdjacents.length, e, false)}>
                            <option value={-1}>----</option>
                            {possibleDirections.filter((filterVal) => !(input.originalAdjacents.includes(filterVal) && filterVal !== -1)).map(((optionVal, optionIndex) => {
                                return(
                                    <option value={optionVal}>{optionVal}</option>
                                );
                            }))}
                        </select>
                    </div>
                </Fragment>
            );
        }
    }
}
// an input's details || props: input | speed: typewrite speed
class InputDetails extends React.Component{
    render() {
        const {input: input, speed: speed, edit: edit, editFuncs: editFuncs, multipleIndex: multipleIndex, noDelete: noDelete} = this.props;

        // multiple inputs returns more inputs
        // if(input.componentID === 0){
        if(input instanceof MultipleInput){
            return(
                <Fragment>
                    {input.myInputs.map((item, index) => {
                        return(
                            <InputDetails multipleIndex={index} input={item} speed={speed} className={this.props.className} edit={edit} editFuncs={editFuncs} />
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
                <InputDetailsDirectional className={"category_text" + ((this.props.className) ? (" " + this.props.className) : (""))} input={input} edit={edit} editFuncs={editFuncs} multipleIndex={multipleIndex} />
                );
        }
        // input info
        let [canGoUp, canGoDown] = [false, false];
        if(edit) {
            const master = editFuncs.get();
            if(master instanceof MultipleInput) {
                [canGoUp, canGoDown] = [multipleIndex > 0, multipleIndex < master.myInputs.size-1];
            }
        }
        return(
            <div className={"component_block"}>
                <div className={"wrapper_div inline_block_parent inline_buttons"}>
                    <p className={"category_text_title small" + ((this.props.className) ? (" " + this.props.className) : (""))}>{input.getComponentName()}</p>
                    {((edit) ? (
                        <Fragment>
                            {/*delete*/}
                            {((noDelete) ? (
                                <Button className={"faded" + ((this.props.className) ? (" " + this.props.className) : (""))} onClick={() => null}>
                                    <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/delete-button-580x580.png"} />
                                </Button>
                            ) : (
                                <Button className={this.props.className} onClick={() => editFuncs.delete(multipleIndex)}>
                                    <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/delete-button-580x580.png"} />
                                </Button>
                            ))}
                            {/*clone*/}
                            <Button className={this.props.className} onClick={() => editFuncs.add(input.cloneMe())}>
                                <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/+-button-640x640.png"} />
                            </Button>
                            {/*move up*/}
                            {((canGoUp) ? (
                                <Button className={this.props.className} onClick={() => editFuncs.shift(multipleIndex, true)}>
                                    <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/up-arrow-800x800.png"} />
                                </Button>
                            ) : (
                                <Button className={"faded" + ((this.props.className) ? (" " + this.props.className) : (""))} onClick={() => null}>
                                    <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/up-arrow-800x800.png"} />
                                </Button>
                            ))}
                            {/*move down*/}
                            {((canGoDown) ? (
                                <Button className={this.props.className} onClick={() => editFuncs.shift(multipleIndex, false)}>
                                    <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/down-arrow-800x800.png"} />
                                </Button>
                            ) : (
                                <Button className={"faded" + ((this.props.className) ? (" " + this.props.className) : (""))} onClick={() => null}>
                                    <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/down-arrow-800x800.png"} />
                                </Button>
                            ))}
                        </Fragment>
                    ) : null)}
                </div>
                <TypewriterText speed={speed}>
                    <p className={"category_text" + ((this.props.className) ? (" " + this.props.className) : (""))}>{input.getComponentDescription()}</p>
                </TypewriterText>
                {extraDetails}
            </div>
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
            // update/clamp color
            let curr = this.stages[this.stage];
            this.colors = this.colors.map((value, index) => Math.max(0, Math.min(255, value + curr[index]*this.colorStep)));
            // check if should proceed to next stage
            let [num0, num255] = [this.colors.filter((val) => val === 0).length, this.colors.filter((val) => val === 255).length];
            if(num255 === 2 || num0 === 2){
                this.stage++;
                if(this.stage >= this.stages.length){
                    this.stage = 0;
                }
            }

            // draw square
            let [r, c] = [rawPath[this.index][0], rawPath[this.index][1]];
            this.ctx.fillStyle = `rgba(${this.colors[0]}, ${this.colors[1]}, ${this.colors[2]}, 1)`;
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
        this.colors = [0, 255, 0];

        this.index = 0;
        this.stage = 0;
        this.stages = [[0, 0, 1], [0, -1, 0], [1, 0, 0], [0, 0, -1], [0, 1, 0], [-1, 0, 0]];
        // how fast the color changes
        this.colorStep = Math.min(86, Math.max(1, Math.round((this.stages.length*255) / (rawPath.length))));

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
        const {brain: brain, speed: speed, gridSize: gridSize, edit: edit, editFuncs: editFuncs} = this.props;

        // static display
        if(!edit) {
            return (
                <Fragment>
                    <div className={"indent"}>
                        <p className={"category_text_title small"}>{brain.myNormalizer.getComponentName()}</p>
                        <TypewriterText speed={speed}>
                            <p className={"category_text"}>
                                {brain.myNormalizer.getComponentDescription()}
                            </p>
                        </TypewriterText>
                    </div>
                    <BlankSubCanvas width={2} className={""} refIn={this.subCanvasRef}/>
                </Fragment>
            );
        }
        // editable
        else{
            return (
                <Fragment>
                    <div className={"indent"}>
                        <p className={"category_text_title small"}>Parameters (will reset weights/biases)</p>
                        <div>
                            <label htmlFor={"net_depth"}>Network Depth (# of layers):</label>
                            <NumberForm name={"net_depth"} initVal={brain.myDepth} min={1} max={16} onChange={(val) => {
                                let newBrain = new NeuralNetBrain(brain.myNormalizer, val, brain.myWidth, brain.startWeight, brain.startBias);
                                editFuncs.change(newBrain);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor={"net_width"}>Network Width (# nodes/layer):</label>
                            <NumberForm name={"net_width"} initVal={brain.myWidth} min={2} max={36} onChange={(val) => {
                                let newBrain = new NeuralNetBrain(brain.myNormalizer, brain.myDepth, val, brain.startWeight, brain.startBias);
                                editFuncs.change(newBrain);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor={"net_start_weight"}>Start Weight:</label>
                            <NumberForm name={"net_start_weight"} initVal={brain.startWeight} min={0} max={1} step={0.01} onChange={(val) => {
                                let newBrain = new NeuralNetBrain(brain.myNormalizer, brain.myDepth, brain.myWidth, val, brain.startBias);
                                editFuncs.change(newBrain);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor={"net_start_bias"}>Start Bias:</label>
                            <NumberForm name={"net_start_bias"} initVal={brain.startBias} min={0} max={1} step={0.01} onChange={(val) => {
                                let newBrain = new NeuralNetBrain(brain.myNormalizer, brain.myDepth, brain.myWidth, brain.startWeight, val);
                                editFuncs.change(newBrain);
                            }}/>
                        </div>
                    </div>
                    <div className={"indent"}>
                        <div className={"wrapper_div inline_block_parent"}>
                            <label htmlFor={"normalizer_type"} className={"category_text_title small"}>Normalizer</label>
                            <Select initVal={brain.myNormalizer.componentID} name={"normalizer_type"} onSelect={(val) => {
                                val = parseInt(val);
                                brain.myNormalizer = blankNormalizers[val].cloneMe();
                                editFuncs.update();
                            }}>
                                {blankNormalizers.map(((value, index) => {
                                    return (
                                        <option value={index}>{value.getComponentName()}</option>
                                    );
                                }))}
                            </Select>
                        </div>
                        <TypewriterText speed={speed}>
                            <p className={"category_text"}>
                                {brain.myNormalizer.getComponentDescription()}
                            </p>
                        </TypewriterText>
                    </div>
                    <BlankSubCanvas width={2} className={""} refIn={this.subCanvasRef}/>
                </Fragment>
            );
        }
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

        let widthUsed = Math.floor(ctx.canvas.width/4);

        // draw inputs
        let centers = [DrawInput(ctx, brain, widthUsed, ctx.canvas.height, 0, 0, "#000000")];

        // draw brain
        centers = centers.concat(DrawBrain(ctx, brain, Math.floor(ctx.canvas.width/2), ctx.canvas.height, widthUsed, 0, "#000000", biasScale));
        widthUsed += Math.floor(ctx.canvas.width/2);

        // draw outputs
        centers.push(DrawOutput(ctx, brain, Math.floor(ctx.canvas.width/4), ctx.canvas.height, widthUsed, 0, "#000000", biasScale));

        // weights
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

                    // values: red/blue
                    if(brain.hasValues) {
                        let opacity = Math.round(Math.min(Math.abs(currVal) / (weightScale / weightLineOpacityMultiplier), 1) * 100) / 100;
                        opacity = Math.max(opacity, weightLineMinOpacity);
                        if (currVal > 0) {
                            ctx.strokeStyle = `rgba(0, 0, 255, ${opacity})`;
                        } else {
                            ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
                        }
                    }
                    // no values, gray lines
                    else{
                        ctx.strokeStyle = `rgba(0, 0, 0, 0.5)`;
                    }

                    // draw
                    ctx.beginPath();
                    ctx.moveTo(srcX, srcY);
                    ctx.lineTo(targetX, targetY);
                    ctx.stroke();
                    ctx.closePath();
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
        const {brain: brain, speed: speed, gridSize: gridSize, edit: edit, editFuncs: editFuncs} = this.props;

        // extra details
        let extraDetails = null;
        if(brain instanceof PathBrain){
            extraDetails = (
                <BrainDetailsPath gridSize={gridSize} className={"category_text"} brain={brain} speed={speed} />
            );
        }
        else if(brain instanceof NeuralNetBrain){
            extraDetails = (
                <Fragment>
                    <BrainDetailsNet gridSize={gridSize} className={"category_text"} brain={brain} speed={speed} edit={edit} editFuncs={editFuncs} />
                </Fragment>
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

        const speed = typeWriteSpeed;

        const [currR, currC] = [snake.startHeadPos / (snake.gridSize + 2), snake.startHeadPos % (snake.gridSize + 2) - 1].map(((value, index) => Math.floor(value)));

        return(
            <div className={"details snake_details" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <h1>{snake.getComponentName()}</h1>
                <CollapsibleDiv startOpen={collapsePrefSnek[0]} changePref={(val) => (collapsePrefSnek[0] = val)}>
                    <p className={"category_text_title"}>Description</p>
                    <TypewriterText speed={speed}>
                        <p className={"category_text"}>{snake.getComponentDescription()}</p>
                    </TypewriterText>
                </CollapsibleDiv>
                <CollapsibleDiv startOpen={collapsePrefSnek[1]} changePref={(val) => (collapsePrefSnek[1] = val)}>
                    <p className={"category_text_title"}>Parameters</p>
                    <TypewriterText speed={speed}>
                        <p className={"category_text"}>
                            Starting Head Position (Row/Column): [{currR}, {currC}]{"\n"}
                            Starting Length: {snake.startLength}{"\n"}
                            Apple Value: {snake.appleVal}{"\n"}
                            Grid Size: {snake.gridSize}{"\n"}
                        </p>
                    </TypewriterText>
                </CollapsibleDiv>
                <CollapsibleDiv startOpen={collapsePrefSnek[2]} changePref={(val) => (collapsePrefSnek[2] = val)}>
                    <p className={"category_text_title"}>Input</p>
                    <InputDetails input={snake.myInput} speed={speed} />
                </CollapsibleDiv>
                <CollapsibleDiv startOpen={collapsePrefSnek[3]} changePref={(val) => (collapsePrefSnek[3] = val)}>
                    <p className={"category_text_title"}>Brain</p>
                    <BrainDetails brain={snake.myBrain} gridSize={snake.gridSize} speed={speed} />
                </CollapsibleDiv>
            </div>
        );
    }
}

// editable snake details || props: snake = snake to display/edit | tellChange: a function which should b called on snake change
class SnakeDetailsEdit extends React.Component{
    render(){
        const {snake: snake, tellChange: tellChange} = this.props;

        const speed = typeWriteSpeed;

        const [currR, currC] = [snake.startHeadPos / (snake.gridSize + 2), snake.startHeadPos % (snake.gridSize + 2) - 1].map(((value, index) => Math.floor(value)));

        // inputs
        if(!this.inputs){
            this.inputs = blankInputs.map(((value, index) => value.cloneMe()));
            // start at 1 cuz multiple input is 0
            this.inputActive = 0;
        }
        const editFuncsInput = {
            get: () => {return snake.myInput},
            change: (inputNew) => {
                snake.changeInput(inputNew);
                this.forceUpdate();
            },
            add: (inputNew) => {
                // no inputs
                if(!snake.myInput){
                    snake.changeInput(inputNew);
                }
                // multiple inputs
                else if(snake.myInput instanceof MultipleInput){
                    snake.myInput.addInput(inputNew);
                    snake.changeInput(snake.myInput);
                }
                // one input b4 add
                else{
                    const newVal = new MultipleInput(snake.myInput, inputNew);
                    snake.changeInput(newVal);
                }
                this.forceUpdate();
            },
            delete: (index) => {
                // delete last input (total now at 0)
                if(!(snake.myInput instanceof MultipleInput)){
                    snake.changeInput(null);
                }
                // deleting from multiple
                else{
                    // extract previous inputs from queue
                    const inputs = snake.myInput.myInputs.map((val, i) => val);

                    // delete 2nd input (total now at 1)
                    if(snake.myInput.myInputs.length === 2){
                        const indexToKeep = ((index === 0) ? (1) : (0));
                        snake.changeInput(inputs[indexToKeep].cloneMe());
                    }
                    // delete a random input from MultipleInput
                    else{
                        let ans = new MultipleInput();
                        inputs.map((val, i) => {
                            if(i !== index){
                                ans.addInput(val);
                            }
                        });
                        snake.changeInput(ans);
                    }
                }
                this.forceUpdate();
            },
            shift: (origin, goUp) => {
                // assume validation is done already
                let oldInputs = snake.myInput.myInputs.map((val, i) => val);
                let newMultiple = new MultipleInput();
                oldInputs.map(((value, index) => {
                    // shift up (decrease index)
                    if(goUp){
                        if(index === origin-1){
                            newMultiple.addInput(oldInputs[origin]);
                            return;
                        }
                        if(index === origin){
                            newMultiple.addInput(oldInputs[origin-1]);
                            return;
                        }
                        newMultiple.addInput(value);
                    }
                    // shift down (increase index)
                    else{
                        if(index === origin){
                            newMultiple.addInput(oldInputs[origin+1]);
                            return;
                        }
                        if(index === origin+1){
                            newMultiple.addInput(oldInputs[origin]);
                            return;
                        }
                        newMultiple.addInput(value);
                    }
                }));
                snake.changeInput(newMultiple);
                this.forceUpdate();
            },
            update: () => {
                if(snake.myInput instanceof MultipleInput){
                    let ans = new MultipleInput();
                    snake.myInput.myInputs.map((val, i) => ans.addInput(val));
                    snake.changeInput(ans);
                }
                else {
                    snake.changeInput(snake.myInput);
                }
                this.forceUpdate();
            }
        };

        // brains
        // keep a log of brains so you can toggle between multiple while preserving info
        if(!this.brains){
            this.brains = Array(blankBrains.length).fill(null);
        }
        this.brains[snake.myBrain.componentID] = snake.myBrain;
        const editFuncsBrain = {
            change: (val) => {
                snake.changeBrain(val);
                this.forceUpdate();
            },
            update: () => {
                this.forceUpdate();
            }
        };

        return(
            <div className={"details snake_details" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <TextArea onChange={(val) => {
                    snake.setName(val);
                    this.forceUpdate();
                }}>
                    <h1>{snake.getComponentName()}</h1>
                </TextArea>
                <CollapsibleDiv startOpen={collapsePrefSnek[0]} changePref={(val) => (collapsePrefSnek[0] = val)}>
                    <p className={"category_text_title"}>Description</p>
                    <TextArea onChange={(val) => {
                        snake.componentDescription = val;
                        this.forceUpdate();
                    }}>
                        <p className={"category_text"}>{snake.getComponentDescription()}</p>
                    </TextArea>
                </CollapsibleDiv>
                <CollapsibleDiv startOpen={collapsePrefSnek[1]} changePref={(val) => (collapsePrefSnek[1] = val)}>
                    <p className={"category_text_title"}>Parameters</p>
                    <div className={"category_text"}>
                        <div className={"start_head_pos"}>
                            <p className={"category_text"}>Starting Head Position:</p>
                            <label htmlFor={"head_pos_r"}>Row:</label>
                            <NumberForm name={"head_pos_r"} initVal={currR} min={0} max={snake.gridSize-1} onChange={(val) => {
                                snake.startHeadPos = (val * (snake.gridSize+2)) + 1 + currC;
                                this.forceUpdate();
                            }}/>
                            <label htmlFor={"head_pos_c"}>Column:</label>
                            <NumberForm name={"head_pos_c"} initVal={currC} min={0} max={snake.gridSize-1} onChange={(val) => {
                                snake.startHeadPos = (currR * (snake.gridSize+2)) + 1 + val;
                                this.forceUpdate();
                            }}/>
                        </div>
                        <div>
                            <label htmlFor={"start_length"}>Starting Length:</label>
                            <NumberForm name={"start_length"} initVal={snake.startLength} min={1} max={snake.gridSize*snake.gridSize} onChange={(val) => {
                                snake.startLength = val;
                                snake.myLength = snake.startLength;
                                this.forceUpdate();
                            }} />
                        </div>
                        <div>
                            <label htmlFor={"apple_val"}>Apple Value:</label>
                            <NumberForm name={"apple_val"} initVal={snake.appleVal} min={1} max={99999} onChange={(val) => {
                                snake.appleVal = val;
                                this.forceUpdate();
                            }} />
                        </div>
                        <div>
                            <label htmlFor={"grid_size"}>Grid Size:</label>
                            <NumberForm name={"grid_size"} initVal={snake.gridSize} min={1} max={250} onChange={(val) => {
                                snake.gridSize = val;
                                this.forceUpdate();
                            }} />
                        </div>
                    </div>
                </CollapsibleDiv>

                {/*Input*/}
                <CollapsibleDiv startOpen={collapsePrefSnek[2]} changePref={(val) => (collapsePrefSnek[2] = val)}>
                    <p className={"category_text_title"}>Input</p>
                    <InputDetails input={snake.myInput} speed={speed} edit={true} editFuncs={editFuncsInput} />
                    <div className={"edit_add_component"}>
                        <label className={"category_text_title small"} htmlFor={"input_add_type"}>New Input Type</label>
                        <Select initVal={this.inputs[this.inputActive].componentID} name={"input_add_type"} onSelect={(val) => {
                            this.inputActive = val;
                            this.forceUpdate();
                        }}>
                            {this.inputs.map(((value, index) => {
                                // not multiple
                                if(index > 0) {
                                    return (
                                        <option value={index}>{value.getComponentName()}</option>
                                    );
                                }
                                else{
                                    return (
                                        <option value={index}>None</option>
                                    );
                                }
                            }))}
                        </Select>
                        <InputDetails className={"temp_input"} input={this.inputs[this.inputActive]} speed={speed} edit={true} editFuncs={editFuncsInput} noDelete={true} />
                        {((this.inputActive > 0) ? (
                            <p className={"category_text"}>(red input does nothing unless you hit the "+" button)</p>
                        ) : null)}
                    </div>
                </CollapsibleDiv>

                {/*Brain*/}
                <CollapsibleDiv startOpen={collapsePrefSnek[3]} changePref={(val) => (collapsePrefSnek[3] = val)}>
                    <p className={"category_text_title"}>Brain</p>
                    <div className={"wrapper_div inline_block_parent"}>
                        <label htmlFor={"brain_type"}>Brain Type: </label>
                        <Select initVal={snake.myBrain.componentID} name={"brain_type"} onSelect={(val) => {
                            // target id
                            const id = val;

                            // ignore unnecessary switches
                            if(id !== snake.myBrain.componentID) {
                                // save old
                                this.brains[snake.myBrain.componentID] = snake.myBrain;

                                // change to new
                                // this type exists already
                                if (this.brains[id]) {
                                    snake.changeBrain(this.brains[id]);
                                }
                                // first time this type
                                else{
                                    snake.changeBrain(blankBrains[id].cloneMe());
                                }
                                this.forceUpdate();
                            }
                        }}>
                            {blankBrains.map((value, index) => {
                                return(
                                    <option value={index}>{value.getComponentName()}</option>
                                );
                            })}
                        </Select>
                    </div>
                    <BrainDetails brain={snake.myBrain} gridSize={snake.gridSize} speed={speed} edit={true} editFuncs={editFuncsBrain} />
                </CollapsibleDiv>
            </div>
        );
    }
    forceUpdate(callback) {
        const {snake: snake, tellChange: tellChange} = this.props;

        console.log("snake edit forceUpdate");

        if(tellChange){
            tellChange();
        }

        super.forceUpdate(callback);
    }
}