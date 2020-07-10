// REACT general purpose utilities

// parent class that has the window's width/height and updates on resize
class WindowSizes extends React.Component{
    constructor(props){
        super(props);
        this.state = { windowWidth: 0, windowHeight: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    }
}

// a div which fills as much of the parent div (parentRef) as possible while remaining a perfect square
//   Note: parent must be relatively/absolutely positioned
class SquareFill extends WindowSizes{
    render() {
        const {windowWidth: windowWidth, windowHeight: windowHeight} = this.state;
        const {parentRef: parentRef} = this.props;

        const boundingRect = parentRef.current.getBoundingClientRect();

        const [width, height] = [boundingRect.width, boundingRect.height];

        let side = Math.min(width, height);

        let style = {
            width: `${side}px`,
            height: `${side}px`
        };

        return(
            <div style={style} className={"square_fill" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                {this.props.children}
            </div>
        );
    }
}

// div which slowly fades away
//   prop 'sec' for seconds to fade, allows 2 decimal places
class FadeAwayDiv extends React.Component{
    constructor(props){
        super(props);

        this.myInterval = null;

        // milliseconds to disappear, default is 2 sec, round to the tens place
        this.msToFade = ((this.props.sec) ? (Math.round(this.props.sec * 100) * 10) : (2000));

        this.state = {msLeft: this.msToFade};

        this.update = this.update.bind(this);
        this.finish = this.finish.bind(this);
    }
    componentDidMount() {
        this.myInterval = setInterval(() => this.update, 10);
    }

    render() {
        let style = {
            opacity: (this.state.msLeft/this.msToFade)
        };

        return(
            <div style={style} className={this.props.className}>
                {this.props.children}
            </div>
        );
    }

    update(){
        if(this.state.msLeft <= 0){
            this.finish();
            return null;
        }

        this.setState((state) => ({msLeft: state.msLeft - 10}));
    }
    finish(){
        if(this.myInterval){
            clearInterval(this.myInterval);
        }

        this.setState(() => ({msLeft: 0}));
    }
    componentWillUnmount() {
        this.finish();
    }
}