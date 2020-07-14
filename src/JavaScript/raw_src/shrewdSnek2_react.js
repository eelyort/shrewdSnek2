// TODO: depreciated, delete me
class MainMenuShell extends React.Component{
    constructor(props){
        super(props);

        // TODO: fix main menu and remove this stuff
        this.runningMainMenu = null;
        this.gamePanelRef = React.createRef();
        // -----------------------------------------

        this.change = this.change.bind(this);
    }
    render() {
        setTimeout(() => {this.runningMainMenu = new MainMenu(document, this.gamePanelRef.current, (target) => this.change(target))}, 50);

        return(
            <div ref={this.gamePanelRef} id={"gamePanel-1"} className={"gamePanelContainer"}>
            </div>
        );
    }

    change(target){
        if(this.runningMainMenu){
            this.runningMainMenu.KILLME();
            this.runningMainMenu = null;
        }
        this.props.change(target);
    }
}

// top level shell which manages the game display
class ShrewdSnek2Shell extends React.Component{
    constructor(props){
        super(props);
        // 0 - nothing
        // 1 - main menu TODO: become REACT
        // 2 - evolution
        this.state = {currentlyRunning: 0};

        this.wrapperRef = React.createRef();

        this.change = this.change.bind(this);
    }
    componentDidMount() {
        this.change(1);
    }

    render() {
        // main menu
        if(this.state.currentlyRunning === 1) {
            return (
                <div ref={this.wrapperRef} className={"react_wrapper"}>
                    <MainMenuShell change={this.change} />
                </div>
            );
        }
        // evolution
        else if(this.state.currentlyRunning === 2){
            return (
                <div ref={this.wrapperRef} className={"react_wrapper"}>
                    <GameMenu parentRef={this.wrapperRef} change={this.change} />
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
}

ReactDOM.render(<ShrewdSnek2Shell />, $("#app_container")[0]);