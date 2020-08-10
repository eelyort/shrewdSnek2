// REACT general purpose utilities

// takes multiple classnames and smooshes them together into a working format
function smooshClassNames() {
    let ans = "";
    for (let i = 0; i < arguments.length; i++) {
        if(arguments[i]){
            ans += ((ans) ? (" " + arguments[i]) : (arguments[i]));
        }
    }
    return ans;
}
// deep compares 2 components, returning true if they are completely equal
//   does not compare functions/non-react objects - otherwise does everything
function deepCompare(a, b) {
    let count = React.Children.count(a);

    if(count !== React.Children.count(b)){
        return false;
    }

    // check if single item
    if(count === 1){
        // if react element, continue recursion
        if(a.props && b.props){
            // tag type and keys
            if((a.type === b.type) && (a.key === b.key)){
                let usedSet = new Set();
                for(let key in a.props){
                    if(!(key in b.props) || !deepCompare(a.props[key], b.props[key])){
                        return false;
                    }
                    usedSet.add(key);
                }
                for(let key in b.props){
                    if(!(usedSet.has(key))){
                        if(!(key in a.props) || !deepCompare(a.props[key], b.props[key])){
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }
        // primitive data type
        else if(!a.props && !b.props) {
            return a === b;
        }
        return false;
    }
    // if multiple, compare all
    for (let i = 0; i < count; i++) {
        if(!deepCompare(a[i], b[i])){
            return false;
        }
    }
    return true;
}

// so you can return multiple elements
class Fragment extends React.Component{
    render() {
        return this.props.children;
    }
}
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

// button (div)
class Button extends React.Component{
    render() {
        return(
            <button className={"button" + ((this.props.className) ? (" " + this.props.className) : (""))} onClick={this.props.onClick}
                    onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp} onDragLeave={this.props.onMouseUp}>
                {this.props.children}
            </button>
        );
    }
}
// button (div) which toggles between multiple buttons
//   put in multiple "Button" components into children to use (Button is the one above ^^^)
class ToggleButton extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            index: 0
        };

        // pull out all the functions and buttons
        this.funcs = React.Children.map(this.props.children, ((child, index) => {return child.props.onClick}));
        this.buttons = React.Children.toArray(this.props.children);

        this.clicked = this.clicked.bind(this);
    }
    render() {
        const curr = this.buttons[this.state.index];
        return(
            React.cloneElement(curr, {
                className: smooshClassNames(this.props.className, curr.props.className),
                onClick: this.clicked
            })
        );
    }
    clicked(){
        this.funcs[this.state.index]();

        this.setState((state) => ({index: ((state.index >= this.funcs.length - 1) ? (0) : (state.index + 1))}));
    }
}
// button (div) which calls its function for as long as it is held down - with increasing speed
//   prop "speed" (default 1), higher number makes it call the function faster
//   prop "growth" (default 1), higher number makes the rate at which hits the function accelerate (1 is flat)
//   "onClick": "(multi) => {...}" ; recommended for anything where (maxRate < 1000)
class HoldButton extends React.Component{
    constructor(props) {
        super(props);

        this.interval = null;
        this.ticksHeld = 0;

        this.update = this.update.bind(this);
        this.startHold = this.startHold.bind(this);
        this.releaseHold = this.releaseHold.bind(this);
    }
    update(){
        const {onClick: onClick, speed: speed, growth: growth, maxRate: maxRate} = this.props;

        this.ticksHeld++;

        let currCalls = Math.ceil(Math.pow(Math.max(((growth) ? (growth) : (1)), 1), Math.floor(this.ticksHeld/5)));
        if(currCalls > maxRate){
            currCalls = maxRate;
        }

        // if the function passed in allows multipliers
        if(onClick.length >= 1){
            onClick(currCalls);
        }
        else {
            for (let i = 0; i < currCalls; i++) {
                onClick();
            }
        }
    }
    render() {
        return(
            <Button className={this.props.className} onMouseDown={this.startHold} onMouseUp={this.releaseHold}>
                {this.props.children}
            </Button>
        );
    }
    startHold(){
        this.ticksHeld = 0;
        this.interval = setInterval(this.update, 80/((this.props.speed) ? (this.props.speed) : (1)));
    }
    releaseHold(){
        clearInterval(this.interval);
    }
}

// forms
// select object (pass <option>'s as children) | onSelect(value) = called function | name = name | initVal = init val (optional)
class Select extends React.Component{
    constructor(props){
        super(props);

        const {onSelect: onSelect, name: name, initVal: initVal} = this.props;

        // no initVal, get the value of the first component
        this.state = {value: ((initVal) ? (initVal) : (React.Children.toArray(this.props.children)[0].value))};

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return(
            <select value={this.state.value} onChange={this.handleChange} className={this.props.className} name={this.props.name}>
                {this.props.children}
            </select>
        );
    }
    handleChange(event){
        let ans = event.target.value;
        if(ans !== this.state.value){
            this.setState((state) => ({
                value: ans
            }),
                () => this.props.onSelect(ans));
        }
    }
}
// textArea (pass initVal as children) || props: onChange(value) = called function
//  IMPORTANT: takes only a single text element as its child (<TextArea><p>I am a text element</p></TextArea>)
//  IMPORTANT: only updates the function onBlur(un focus) not on change
class TextArea extends React.Component{
    constructor(props){
        super(props);

        // initial value is children
        this.state = {
            value: React.Children.only(this.props.children).props.children
        };

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let elem = React.cloneElement(React.Children.only(this.props.children), {
            contentEditable: "true",
            onBlur: this.handleChange,
            children: ((this.state.value) ? (this.state.value) : (""))
        });
        elem.props.className = smooshClassNames("text_area", this.props.className, elem.props.className);

        return elem;
    }
    handleChange(event){
        const text = $(event.target).text();

        if (text !== this.state.value) {
            this.setState(() => ({value: text}), () => {
                this.props.onChange(this.state.value);
            });
        }
    }
}
// number form || props: name | onChange(val) | max(optional) | min(optional) | initVal(optional) | step(optional)
class NumberForm extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            value: ((this.props.initVal) ? (this.props.initVal) : ((this.props.min) ? (this.props.min) : (0)))
        };

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        const {name: name, min: min, max: max, step: step} = this.props;

        return (
            <input value={this.state.value} onChange={this.handleChange} type={"number"} className={"number_input" + ((this.props.className) ? (" " + this.props.className) : (""))} name={name} step={((step) ? (step) : (1))} />
        );
    }
    handleChange(event){
        const val = parseFloat(event.target.value);

        if(val !== this.state.value && val >= this.props.min && val <= this.props.max) {
            this.setState((state) => ({
                value: val
            }), () => {
                this.props.onChange(this.state.value);
            });
        }
    }
}

// a div which fills as much of the parent div (parentRef) as possible while remaining a perfect square
//   Note: parent must be relatively/absolutely positioned
class SquareFill extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            parentWidth: 0,
            parentHeight: 0
        };

        this.updateState = this.updateState.bind(this);
    }
    render() {
        const {parentWidth: parentWidth, parentHeight: parentHeight} = this.state;
        const {parentRef: parentRef} = this.props;

        const [width, height] = [parentWidth, parentHeight];

        let side = Math.min(width, height);

        let style = {
            width: `${side}px`,
            height: `${side}px`
        };

        return (
            <div style={style}
                 className={"square_fill wrapper_div" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                {this.props.children}
            </div>
        );
    }
    updateState(){
        let rect = this.props.parentRef.current.getBoundingClientRect();
        const [width, height] = [rect.width, rect.height];
        if(width !== this.state.parentWidth || height !== this.state.parentHeight){
            this.setState((state) => ({
                parentWidth: width,
                parentHeight: height
            }))
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateState();
    }
    componentDidMount() {
        // resize listener on parent ref
        window.addEventListener('resize', this.updateState);
        this.updateState();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateState);
    }
}

// div which can fade in/out using css transitions
//  default is fade-out, to get opposite use props.reverse
//  prop: "shouldReset" makes it return to default visibility on prop change - slows performance
class FadeDiv extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isVisible: (!this.props.reverse)
        };
    }
    render(){
        const {isVisible: isVisible} = this.state;
        const {reverse: reverse, speed: speed, shouldReset: shouldReset} = this.props;

        let style = {
            opacity: `${((isVisible) ? (100) : (0))}%`
        };

        // the component should immediately (no transition) go back to its original opacity if it is being reset
        if(isVisible === reverse || !shouldReset){
            style["transition"] = `opacity ${Math.round(1600/((speed) ? (speed) : (1)))}ms ease-in`;
        }

        return(
            <div style={style} className={"wrapper_div" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                {this.props.children}
            </div>
        );
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.shouldReset && !deepCompare(this.props.children, prevProps.children)){
            requestAnimationFrame(() => {
                this.setState(() => ({
                    isVisible: !this.props.reverse
                }));
            });
        }
        // change
        else if(this.state.isVisible !== this.props.reverse){
            requestAnimationFrame(() => {
                this.setState(() => ({isVisible: this.props.reverse}));
            });
        }
    }
    componentDidMount() {
        this.forceUpdate();
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
        if(Array.isArray(this.text)){
            this.text = this.text.join("");
        }

        this.state = {
            current: "",
            intervalReady: true
        };

        this.interval = null;

        this.update = this.update.bind(this);
        this.finish = this.finish.bind(this);
    }
    update() {
        if(this.state.current.length >= this.text.length){
            this.finish();
            return;
        }

        this.setState((state) => ({current: state.current + this.text.charAt(this.state.current.length)}));
    }
    finish() {
        if(this.interval){
            clearInterval(this.interval);
            this.interval = null;
        }

        this.setState((state) => ({current: this.text}));
    }
    componentWillUnmount() {
        this.finish();
    }

    render() {
        // start typewriting when the interval is ready
        if(this.state.intervalReady){
            this.setState(() => ({intervalReady: false}));
            this.interval = setInterval(() => this.update(), 32/this.speed);
        }
        // restart typewrite if the content changes
        if(!this.interval){
            let currContent = (React.Children.only(this.props.children)).props.children;
            if(Array.isArray(currContent)){
                currContent = currContent.join("");
            }

            if(currContent !== this.text) {
                this.text = currContent;
                this.setState(() => ({
                    current: "",
                    intervalReady: true
                }))
            }
        }

        // smoosh together the classnames of both classes
        let classNames = smooshClassNames(this.props.className, (React.Children.only(this.props.children)).props.className);

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
        return(
            <div className={"menu_position" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <MenuInsides>
                    {this.props.children}
                </MenuInsides>
            </div>
        );
    }
}
// hamburger drop down menu - fades away when far
class FadeMenu extends React.Component{
    render() {
        return (
            <div className={"menu_position" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <MouseFadeDiv padding={2.6} speed={4}>
                    <MenuInsides>
                        {this.props.children}
                    </MenuInsides>
                </MouseFadeDiv>
            </div>
        );
    }
}
// hamburger drop down menu insides - NEVER use this directly
class MenuInsides extends React.Component{
    constructor(props){
        super(props);

        this.state = {hidden: true};

        this.click = this.click.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }
    render() {
        return (
            <div onMouseLeave={this.close} onDragLeave={this.close} className={"wrapper_div" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <div className={"wrapper_div"} onClick={this.click}>
                    <ImgIcon className={"wrapper_div menu"} small={2} src={"src/Images/hamburger-icon-550x550.png"}>
                    </ImgIcon>
                </div>
                {((!this.state.hidden) ? (
                    <div className={"menu_insides"}>
                        {this.props.children}
                    </div>
                ) : (""))}
            </div>
        );
    }
    click(e){
        if(this.state.hidden){
            this.open();
        }
        else{
            this.close();
        }
    }
    open(){
        this.setState(() => ({hidden: false}));
    }
    close(){
        this.setState(() => ({hidden: true}));
    }
}

// hover/unhover handler
class MouseEnterExitDiv extends React.Component{
    constructor(props){
        super(props);

        const {mouseEnter: mouseEnter, mouseLeave: mouseLeave} = this.props;
        this.mouseEnter = mouseEnter;
        this.mouseLeave = mouseLeave;
    }
    render(){
        // padding in percentage (0-1)
        const {padding: padding} = this.props;

        let style = {
            position: "relative",
            margin: ((padding) ? (`-${padding * 100}%`) : ("0")),
            padding: ((padding) ? (`${padding * 100}%`) : ("0"))
        };

        return(
            <div className={"mouse_div" + ((this.props.className) ? (" " + this.props.className) : (""))} style={style} onClick={this.props.onClick} onMouseEnter={this.mouseEnter} onDragEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onDragLeave={this.mouseLeave}>
                {this.props.children}
            </div>
        );
    }
}
// a div which fades away when mouse is far/vice-versa
class MouseFadeDiv extends React.Component{
    constructor(props){
        super(props);

        this.state = {hidden: true};

        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
    }
    render() {
        return (
            <div className={"relative wrapper_div" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <MouseEnterExitDiv onClick={this.mouseEnter} padding={this.props.padding} mouseEnter={this.mouseEnter} mouseLeave={this.mouseLeave}>
                    <FadeDiv reverse={!this.state.hidden} speed={this.props.speed}>
                        {this.props.children}
                    </FadeDiv>
                </MouseEnterExitDiv>
            </div>
        );
    }
    mouseEnter(e){
        this.setState(() => ({hidden: false}))
    }
    mouseLeave(e){
        this.setState(() => ({hidden: true}))
    }
}

// div which can be collapsed || changePref (optional): (newPref) => ...
class CollapsibleDiv extends React.Component{
    constructor(props){
        super(props);

        const {startOpen: startOpen, changePref: changePref} = this.props;

        this.state = {
            open: ((startOpen !== undefined) ? (startOpen) : true)
        };

        this.change = this.change.bind(this);
    }
    render() {
        let header = null;
        const openClose = ((this.state.open) ? ("open") : ("close"));
        let rest = React.Children.map(this.props.children, (val, index) => {
            if(index === 0){
                header = React.cloneElement(val, {
                    className: "collapse_header " + openClose + ((val.props.className) ? (" " + val.props.className) : (""))
                });
            }
            else{
                return val;
            }
        });

        if(this.state.open){
            return(
                <div className={"collapse_div " + openClose + ((this.props.className) ? (" " + this.props.className) : (""))}>
                    {header}
                    <Button className={"collapse_button"} onClick={this.change}>
                        <ImgIcon className={"wrapper_div"} small={4} src={"src/Images/--button-640x640.png"} />
                    </Button>
                    {rest}
                </div>
            );
        }
        else{
            return (
                <div className={"collapse_div " + openClose + ((this.props.className) ? (" " + this.props.className) : (""))}>
                    {header}
                    <Button className={"collapse_button"} onClick={this.change}>
                        <ImgIcon className={"wrapper_div"} small={4} src={"src/Images/+-button-640x640.png"} />
                    </Button>
                </div>
            );
        }
    }
    change(){
        const {startOpen: startOpen, changePref: changePref} = this.props;

        this.setState((state) => ({open: !state.open}), () => {
            if(changePref){
                changePref(this.state.open);
            }
        });
    }
}

// popup shell - props: "closeFunc" function to close the popup
class PopUp extends React.Component{
    render() {
        return(
            <div className={"popUp-card" + ((this.props.className) ? (" " + this.props.className) : (""))} onClick={this.props.onClick} onDragLeave={this.props.onDragLeave} onMouseLeave={this.props.onMouseLeave}>
                <Button onClick={this.props.closeFunc} className={"popUp_close_button"}>
                    <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/x-button-820x820.png"}/>
                </Button>
                {this.props.children}
            </div>
        );
    }
}

// vertically oriented carousel
class VerticalCarousel extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            scroll: 0
        };

        this.focusedRef = React.createRef();
        this.wrapperRef = React.createRef();
        this.buttonRef = React.createRef();
        this.lastObjectRef = React.createRef();

        this.click = this.click.bind(this);
        this.scroll = this.scroll.bind(this);
        this.scrollToFocus = this.scrollToFocus.bind(this);
    }
    render() {
        const {selected: selected, select: select, delayInitialScroll: delayInitialScroll} = this.props;

        const numChildren = React.Children.count(this.props.children);
        let contents = React.Children.map(this.props.children, (child, i) => {
            // scroll
            let style = null;
            // first component is the one that scrolls
            if(i === 0){
                style = {
                    marginTop: `${-this.state.scroll}px`
                };
            }

            // focused
            if(i === selected){
                return(
                    <div className={"vertCarouselItem focused"} style={style} ref={this.focusedRef} onClick={() => this.click(i)}>
                        {child}
                    </div>
                );
            }
            else if(i === numChildren - 1){
                return (
                    <div className={"vertCarouselItem"} style={style} ref={this.lastObjectRef} onClick={() => this.click(i)}>
                        {child}
                    </div>
                );
            }
            else{
                return (
                    <div className={"vertCarouselItem"} style={style} onClick={() => this.click(i)}>
                        {child}
                    </div>
                );
            }
        });

        // dynamically set max-height based off of scroll (so the arrow is always visible
        let buttonHeight = ((this.buttonRef.current) ? (this.buttonRef.current.getBoundingClientRect().height) : (80));
        let styleMaxHeight = {
            maxHeight: `calc(100% - ${Math.round((2 * buttonHeight) - this.state.scroll)}px)`
        };
        // let styleMaxHeight = {
        //     maxHeight: `calc(90% - 5px)`
        // };

        return(
            <div ref={this.wrapperRef} className={"carousel_wrapper" + ((this.props.className) ? (" " + this.props.className) : (""))}>
                <div className={"wrapper_div"} ref={this.buttonRef}>
                    <MouseFadeDiv className={"scroll_button top"} padding={0.1} speed={5}>
                        <Button onClick={() => {this.scroll(-(this.wrapperRef.current.getBoundingClientRect().height - (2 * this.buttonRef.current.getBoundingClientRect().height)))}}>
                            <ImgIcon className={"wrapper_div"} small={0} src={"src/Images/up-arrow-800x800.png"}/>
                        </Button>
                    </MouseFadeDiv>
                </div>
                <div className={"carousel_wrapper_2"} style={styleMaxHeight}>
                    {contents}
                </div>
                <MouseFadeDiv className={"scroll_button bottom"} padding={0.1} speed={5}>
                    <Button onClick={() => {this.scroll(this.wrapperRef.current.getBoundingClientRect().height - (2 * this.buttonRef.current.getBoundingClientRect().height))}}>
                        <ImgIcon className={"wrapper_div"} small={0} src={"src/Images/down-arrow-800x800.png"}/>
                    </Button>
                </MouseFadeDiv>
            </div>
        );
    }
    click(i){
        if(i !== this.props.selected){
            this.props.select(i);
        }
        else{
            this.scrollToFocus();
        }
    }
    scroll(amount){
        const minScroll = 0;
        // const maxScroll = 100;
        const maxScroll = ((this.lastObjectRef.current) ? (this.lastObjectRef.current.offsetTop) : (this.focusedRef.current.offsetTop));
        if(amount !== 0) {
            this.setState((state) => ({scroll: Math.min(Math.max(state.scroll + amount, minScroll), maxScroll)}),() => {
            });
        }
    }
    scrollToFocus(){
        this.scroll(this.focusedRef.current.offsetTop - this.state.scroll);
    }
    componentDidMount() {
        if(this.props.delayInitialScroll){
            setTimeout(() => this.scrollToFocus(), this.props.delayInitialScroll*50);
        }
        else {
            this.scrollToFocus();
        }
    }
}