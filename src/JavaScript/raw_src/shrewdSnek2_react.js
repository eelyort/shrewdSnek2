// top level shell which manages the game display
class ShrewdSnek2Shell extends React.Component{
    constructor(props){
        super(props);
        // 0 - nothing
        // 1 - main menu TODO: become REACT
        // 2 - game menu
        // 3 - empty wrapper
        this.state = {currentlyRunning: 0};

        this.wrapperRef = React.createRef();

        this.change = this.change.bind(this);
    }
    componentDidMount() {
        this.change(3);
    }

    render() {
        // main menu - OLD
        if(this.state.currentlyRunning === 1) {
            return (
                <div ref={this.wrapperRef} className={"react_wrapper"}>
                </div>
            );
        }
        // Game Menu
        else if(this.state.currentlyRunning === 2){
            return (
                <div ref={this.wrapperRef} className={"react_wrapper"}>
                    <GameMenu parentRef={this.wrapperRef} change={this.change} />
                </div>
            );
        }
        // empty wrapper
        else if(this.state.currentlyRunning === 3){
            return (
                <div ref={this.wrapperRef} className={"react_wrapper"}>
                </div>
            );
        }
        // default
        return (
            <h1>NO CURRENTLY RUNNING</h1>
        );
    }
    change(target){
        this.setState((state) => ({currentlyRunning: target}));
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.currentlyRunning !== 2) {
            requestAnimationFrame(() => this.change(2));
        }
    }
}

ReactDOM.render(<ShrewdSnek2Shell />, $("#app_container")[0]);