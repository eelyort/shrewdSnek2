// snakes and whatnot react components

// an input's details || props: input | speed: typewrite speed
class SnakeInput extends React.Component{
    render() {
        const {input: input, speed: speed} = this.props;

        // multiple inputs returns more inputs
        if(input.componentID === 0){
            return(
                <Fragment>
                    {input.myInputs.map((item, index) => {
                        return(
                            <SnakeInput input={item} speed={speed} className={this.props.className} />
                        );
                    })}
                </Fragment>
            );
        }

        // single input
        // extra details
        let extraDetails = null;
        if(input.componentID === 2){
            extraDetails = (
                <DetailsDirectional className={"category_text"} input={input} />
                );
        }
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
class DetailsDirectional extends React.Component{
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
                <SnakeInput input={snake.myInput} speed={speed} />
            </div>
        );
    }
}