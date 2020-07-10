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
    }
    render() {
        return(
            <SquareFill parentRef={this.props.parentRef}>
                <SubCanvas ref={this.subCanvasRef} />
                <h1>hi</h1>
            </SquareFill>
        );
    }
}