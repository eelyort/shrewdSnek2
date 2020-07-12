// REACT

class SubCanvas extends React.Component{
    render() {
        return(
            <canvas ref={this.props.ref} className={"subGameCanvas background"} />
        );
    }
}

class EvolutionMenu extends React.Component{
    constructor(props){
        super(props);

        this.subCanvasRef = React.createRef();

        // TODO:
        this.state = {
            score: 0
        }
    }
    render() {
        return(
            <SquareFill parentRef={this.props.parentRef}>
                <SubCanvas ref={this.subCanvasRef} />
                <div className={"ui_layer"}>
                    <div className={"inline_block_parent wrapper_div"}>
                        <Menu />
                        <TypewriterText className={"playing_text"}>
                            <h2>
                                Playing: ???
                            </h2>
                        </TypewriterText>
                        <FadeDiv className={"score_text"} reverse={true}>
                            <h2>
                                {"Score: " + (`\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0${this.state.score}`).slice(-8)}
                            </h2>
                        </FadeDiv>
                    </div>
                </div>
            </SquareFill>
        );
    }
}