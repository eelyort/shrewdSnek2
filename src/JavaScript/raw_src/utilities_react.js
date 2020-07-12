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
            <div style={style} className={"square_fill wrapper_div" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                {this.props.children}
            </div>
        );
    }
}

// div which can fade in/out using css transitions
//  default is fade-out, to get opposite use props.reverse
class FadeDiv extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isVisible: (!this.props.reverse)
        }
    }
    render(){
        const {isVisible: isVisible} = this.state;
        const {reverse: reverse, speed: speed} = this.props;

        // change
        if(isVisible !== reverse){
            this.setState(() => ({isVisible: reverse}));
        }

        let style = {
            transition: `opacity ${Math.round(2400/((speed) ? (speed) : (1)))}ms ease`,
            opacity: `${((isVisible) ? (100) : (0))}%`
        };

        return(
            <div style={style} className={"wrapper_div" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                {this.props.children}
            </div>
        );
    }
}

// text which is a typewriter
//   renders a single child text tag (h1, p, etc)
class TypewriterText extends React.Component{
    constructor(props){
        super(props);

        // bigger number is faster, 1 is normal speed, 2 is 2 times as fast, etc
        this.speed = ((this.props.speed) ? (this.props.speed) : (1));
        // pull text
        this.text = (React.Children.only(this.props.children)).props.children;

        this.state = {
            current: ""
        };

        this.interval = null;

        this.update = this.update.bind(this);
        this.finish = this.finish.bind(this);
    }
    componentDidMount() {
        this.interval = setInterval(() => this.update(), 32/this.speed);
    }

    update() {
        if(this.state.current.length >= this.text.length){
            this.finish();
            return null;
        }

        this.setState((state) => ({current: state.current + this.text.charAt(this.state.current.length)}));
    }
    finish() {
        if(this.interval){
            clearInterval(this.interval);
        }

        this.setState((state) => ({current: this.text}));
    }
    componentWillUnmount() {
        this.finish();
    }

    render() {
        // smoosh together the classnames of both classes
        let classNames = "";
        if(this.props.className){
            classNames = this.props.className;
        }
        const childClass = (React.Children.only(this.props.children)).props.className;
        if(childClass) {
            classNames += ((this.props.className) ? (" ") : ("")) + childClass;
        }

        return (
            React.cloneElement(this.props.children, {
                children: this.state.current,
                className: classNames
            })
        );
    }
}

// image icon
class ImgIcon extends React.Component{
    render() {
        return (
            <div className={"icon" + ((this.props.small) ? (" small" + (this.props.small + 0)) : ("")) + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <img className={"wrapper_div"} src={this.props.src} />
                {this.props.children}
            </div>
        );
    }
}

// hamburger drop down menu
class Menu extends React.Component{
    render() {
        return (
            <ImgIcon className={"menu"} small={2} src={"src/Images/hamburger-icon-550x550.png"}>
            </ImgIcon>
        );
    }
}