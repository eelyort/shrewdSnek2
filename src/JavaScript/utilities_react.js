var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// REACT general purpose utilities

// takes multiple classnames and smooshes them together into a working format
function smooshClassNames() {
    var ans = "";
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i]) {
            ans += ans ? " " + arguments[i] : arguments[i];
        }
    }
    return ans;
}
// deep compares 2 components, returning true if they are completely equal
//   does not compare functions/non-react objects - otherwise does everything
function deepCompare(a, b) {
    var count = React.Children.count(a);

    if (count !== React.Children.count(b)) {
        return false;
    }

    // check if single item
    if (count === 1) {
        // if react element, continue recursion
        if (a.props && b.props) {
            // tag type and keys
            if (a.type === b.type && a.key === b.key) {
                var usedSet = new Set();
                for (var key in a.props) {
                    if (!(key in b.props) || !deepCompare(a.props[key], b.props[key])) {
                        return false;
                    }
                    usedSet.add(key);
                }
                for (var _key in b.props) {
                    if (!usedSet.has(_key)) {
                        if (!(_key in a.props) || !deepCompare(a.props[_key], b.props[_key])) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }
        // primitive data type
        else if (!a.props && !b.props) {
                return a === b;
            }
        return false;
    }
    // if multiple, compare all
    for (var i = 0; i < count; i++) {
        if (!deepCompare(a[i], b[i])) {
            return false;
        }
    }
    return true;
}

// parent class that has the window's width/height and updates on resize

var WindowSizes = function (_React$Component) {
    _inherits(WindowSizes, _React$Component);

    function WindowSizes(props) {
        _classCallCheck(this, WindowSizes);

        var _this = _possibleConstructorReturn(this, (WindowSizes.__proto__ || Object.getPrototypeOf(WindowSizes)).call(this, props));

        _this.state = { windowWidth: 0, windowHeight: 0 };
        _this.updateWindowDimensions = _this.updateWindowDimensions.bind(_this);
        return _this;
    }

    _createClass(WindowSizes, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.updateWindowDimensions();
            window.addEventListener('resize', this.updateWindowDimensions);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.updateWindowDimensions);
        }
    }, {
        key: "updateWindowDimensions",
        value: function updateWindowDimensions() {
            this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
        }
    }]);

    return WindowSizes;
}(React.Component);

// button (div)


var Button = function (_React$Component2) {
    _inherits(Button, _React$Component2);

    function Button() {
        _classCallCheck(this, Button);

        return _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
    }

    _createClass(Button, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "button",
                { className: "button" + (this.props.className ? " " + this.props.className : ""), onClick: this.props.onClick },
                this.props.children
            );
        }
    }]);

    return Button;
}(React.Component);
// button (div) which toggles between multiple buttons
//   put in multiple "Button" components into children to use (Button is the one above ^^^)


var ToggleButton = function (_React$Component3) {
    _inherits(ToggleButton, _React$Component3);

    function ToggleButton(props) {
        _classCallCheck(this, ToggleButton);

        var _this3 = _possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).call(this, props));

        _this3.state = {
            index: 0
        };

        // pull out all the functions and buttons
        _this3.funcs = React.Children.map(_this3.props.children, function (child, index) {
            return child.props.onClick;
        });
        _this3.buttons = React.Children.toArray(_this3.props.children);

        _this3.clicked = _this3.clicked.bind(_this3);
        return _this3;
    }

    _createClass(ToggleButton, [{
        key: "render",
        value: function render() {
            var curr = this.buttons[this.state.index];
            return React.cloneElement(curr, {
                className: smooshClassNames(this.props.className, curr.props.className),
                onClick: this.clicked
            });
        }
    }, {
        key: "clicked",
        value: function clicked() {
            var _this4 = this;

            this.funcs[this.state.index]();

            this.setState(function (state) {
                return { index: state.index >= _this4.funcs.length - 1 ? 0 : state.index + 1 };
            });
        }
    }]);

    return ToggleButton;
}(React.Component);

// a div which fills as much of the parent div (parentRef) as possible while remaining a perfect square
//   Note: parent must be relatively/absolutely positioned


var SquareFill = function (_WindowSizes) {
    _inherits(SquareFill, _WindowSizes);

    function SquareFill() {
        _classCallCheck(this, SquareFill);

        return _possibleConstructorReturn(this, (SquareFill.__proto__ || Object.getPrototypeOf(SquareFill)).apply(this, arguments));
    }

    _createClass(SquareFill, [{
        key: "render",
        value: function render() {
            var _state = this.state,
                windowWidth = _state.windowWidth,
                windowHeight = _state.windowHeight;
            var parentRef = this.props.parentRef;


            var boundingRect = parentRef.current.getBoundingClientRect();

            var _ref = [boundingRect.width, boundingRect.height],
                width = _ref[0],
                height = _ref[1];


            var side = Math.min(width, height);

            var style = {
                width: side + "px",
                height: side + "px"
            };

            return React.createElement(
                "div",
                { style: style, className: "square_fill wrapper_div" + (this.props.className ? " " + this.props.className : "") },
                this.props.children
            );
        }
    }]);

    return SquareFill;
}(WindowSizes);

// div which can fade in/out using css transitions
//  default is fade-out, to get opposite use props.reverse
//  prop: "shouldReset" makes it return to default visibility on prop change - slows performance


var FadeDiv = function (_React$Component4) {
    _inherits(FadeDiv, _React$Component4);

    function FadeDiv(props) {
        _classCallCheck(this, FadeDiv);

        var _this6 = _possibleConstructorReturn(this, (FadeDiv.__proto__ || Object.getPrototypeOf(FadeDiv)).call(this, props));

        _this6.state = {
            isVisible: !_this6.props.reverse,
            oldChildren: _this6.props.children
        };
        return _this6;
    }

    _createClass(FadeDiv, [{
        key: "render",
        value: function render() {
            var isVisible = this.state.isVisible;
            var _props = this.props,
                reverse = _props.reverse,
                speed = _props.speed,
                shouldReset = _props.shouldReset;

            // reset on content changes if "shouldReset" is toggled

            if (shouldReset) {
                var curr = this.props.children;
                if (!deepCompare(curr, this.state.oldChildren)) {
                    this.setState(function () {
                        return {
                            isVisible: !reverse,
                            oldChildren: curr
                        };
                    });

                    var _style = {
                        opacity: (!reverse ? 100 : 0) + "%"
                    };

                    return React.createElement(
                        "div",
                        { style: _style, className: "wrapper_div" + (this.props.className ? " " + this.props.className : "") },
                        this.props.children
                    );
                }
            }

            var style = {
                transition: "opacity " + Math.round(1600 / (speed ? speed : 1)) + "ms ease-in",
                opacity: (isVisible ? 100 : 0) + "%"
            };

            // change
            if (isVisible !== reverse) {
                this.setState(function () {
                    return { isVisible: reverse };
                });
            }

            return React.createElement(
                "div",
                { style: style, className: "wrapper_div" + (this.props.className ? " " + this.props.className : "") },
                this.props.children
            );
        }
    }]);

    return FadeDiv;
}(React.Component);

// text which is a typewriter
//   renders a single child text tag (h1, p, etc)


var TypewriterText = function (_React$Component5) {
    _inherits(TypewriterText, _React$Component5);

    function TypewriterText(props) {
        _classCallCheck(this, TypewriterText);

        // bigger number is faster, 1 is normal speed, 2 is 2 times as fast, etc
        var _this7 = _possibleConstructorReturn(this, (TypewriterText.__proto__ || Object.getPrototypeOf(TypewriterText)).call(this, props));

        _this7.speed = _this7.props.speed ? _this7.props.speed : 1;
        // pull text
        _this7.text = React.Children.only(_this7.props.children).props.children;
        if (Array.isArray(_this7.text)) {
            _this7.text = _this7.text.join("");
        }

        _this7.state = {
            current: "",
            intervalReady: true
        };

        _this7.interval = null;

        _this7.update = _this7.update.bind(_this7);
        _this7.finish = _this7.finish.bind(_this7);
        return _this7;
    }

    _createClass(TypewriterText, [{
        key: "update",
        value: function update() {
            var _this8 = this;

            if (this.state.current.length >= this.text.length) {
                this.finish();
                return;
            }

            this.setState(function (state) {
                return { current: state.current + _this8.text.charAt(_this8.state.current.length) };
            });
        }
    }, {
        key: "finish",
        value: function finish() {
            var _this9 = this;

            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }

            this.setState(function (state) {
                return { current: _this9.text };
            });
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.finish();
        }
    }, {
        key: "render",
        value: function render() {
            var _this10 = this;

            // start typewriting when the interval is ready
            if (this.state.intervalReady) {
                this.setState(function () {
                    return { intervalReady: false };
                });
                this.interval = setInterval(function () {
                    return _this10.update();
                }, 32 / this.speed);
            }
            // restart typewrite if the content changes
            if (!this.interval) {
                var currContent = React.Children.only(this.props.children).props.children;
                if (Array.isArray(currContent)) {
                    currContent = currContent.join("");
                }

                if (currContent !== this.text) {
                    this.text = currContent;
                    this.setState(function () {
                        return {
                            current: "",
                            intervalReady: true
                        };
                    });
                }
            }

            // smoosh together the classnames of both classes
            var classNames = smooshClassNames(this.props.className, React.Children.only(this.props.children).props.className);

            return React.cloneElement(this.props.children, {
                children: this.state.current,
                className: classNames
            });
        }
    }]);

    return TypewriterText;
}(React.Component);

// image icon


var ImgIcon = function (_React$Component6) {
    _inherits(ImgIcon, _React$Component6);

    function ImgIcon() {
        _classCallCheck(this, ImgIcon);

        return _possibleConstructorReturn(this, (ImgIcon.__proto__ || Object.getPrototypeOf(ImgIcon)).apply(this, arguments));
    }

    _createClass(ImgIcon, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "icon" + (this.props.small ? " small" + (this.props.small + 0) : "") + (this.props.className ? " " + this.props.className : "") },
                React.createElement("img", { className: "wrapper_div", src: this.props.src }),
                this.props.children
            );
        }
    }]);

    return ImgIcon;
}(React.Component);

// hamburger drop down menu


var Menu = function (_React$Component7) {
    _inherits(Menu, _React$Component7);

    function Menu() {
        _classCallCheck(this, Menu);

        return _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).apply(this, arguments));
    }

    _createClass(Menu, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "menu_position" + (this.props.className ? " " + this.props.className : "") },
                React.createElement(
                    MenuInsides,
                    null,
                    this.props.children
                )
            );
        }
    }]);

    return Menu;
}(React.Component);
// hamburger drop down menu - fades away when far


var FadeMenu = function (_React$Component8) {
    _inherits(FadeMenu, _React$Component8);

    function FadeMenu(props) {
        _classCallCheck(this, FadeMenu);

        var _this13 = _possibleConstructorReturn(this, (FadeMenu.__proto__ || Object.getPrototypeOf(FadeMenu)).call(this, props));

        _this13.state = { iconHidden: true };

        _this13.mouseEnter = _this13.mouseEnter.bind(_this13);
        _this13.mouseLeave = _this13.mouseLeave.bind(_this13);
        return _this13;
    }

    _createClass(FadeMenu, [{
        key: "render",
        value: function render() {
            // return (
            //     <div className={"menu_position" + ((this.props.className) ? (" " + this.props.className) : (""))}>
            //         <FadeDiv className={"menu"} reverse={!this.state.iconHidden} speed={4}>
            //             <MouseEnterExitDiv padding={1.6} mouseEnter={this.mouseEnter} mouseLeave={this.mouseLeave}>
            //             <div onClick={() => {console.log("leave")}} className={"wrapper_div"}>
            //                 <ImgIcon className={"wrapper_div"} small={2} src={"src/Images/hamburger-icon-550x550.png"}>
            //                 </ImgIcon>
            //             </div>
            //             </MouseEnterExitDiv>
            //         </FadeDiv>
            //     </div>
            // );

            return React.createElement(
                "div",
                { className: "menu_position" + (this.props.className ? " " + this.props.className : "") },
                React.createElement(
                    MouseEnterExitDiv,
                    { padding: 2.1, mouseEnter: this.mouseEnter, mouseLeave: this.mouseLeave },
                    React.createElement(
                        FadeDiv,
                        { reverse: !this.state.iconHidden, speed: 4 },
                        React.createElement(
                            MenuInsides,
                            null,
                            this.props.children
                        )
                    )
                )
            );
        }
    }, {
        key: "mouseEnter",
        value: function mouseEnter(e) {
            this.setState(function () {
                return { iconHidden: false };
            });
        }
    }, {
        key: "mouseLeave",
        value: function mouseLeave(e) {
            this.setState(function () {
                return { iconHidden: true };
            });
        }
    }]);

    return FadeMenu;
}(React.Component);
// hamburger drop down menu insides - NEVER use this directly


var MenuInsides = function (_React$Component9) {
    _inherits(MenuInsides, _React$Component9);

    function MenuInsides(props) {
        _classCallCheck(this, MenuInsides);

        var _this14 = _possibleConstructorReturn(this, (MenuInsides.__proto__ || Object.getPrototypeOf(MenuInsides)).call(this, props));

        _this14.state = { hidden: true };

        _this14.click = _this14.click.bind(_this14);
        _this14.open = _this14.open.bind(_this14);
        _this14.close = _this14.close.bind(_this14);
        return _this14;
    }

    _createClass(MenuInsides, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { onMouseLeave: this.close, onDragLeave: this.close, className: "wrapper_div" + (this.props.className ? " " + this.props.className : "") },
                React.createElement(
                    "div",
                    { className: "wrapper_div", onClick: this.click },
                    React.createElement(ImgIcon, { className: "wrapper_div menu", small: 2, src: "src/Images/hamburger-icon-550x550.png" })
                ),
                !this.state.hidden ? React.createElement(
                    "div",
                    { className: "menu_insides" },
                    this.props.children
                ) : ""
            );
        }
    }, {
        key: "click",
        value: function click(e) {
            if (this.state.hidden) {
                this.open();
            } else {
                this.close();
            }
        }
    }, {
        key: "open",
        value: function open() {
            this.setState(function () {
                return { hidden: false };
            });
        }
    }, {
        key: "close",
        value: function close() {
            this.setState(function () {
                return { hidden: true };
            });
        }
    }]);

    return MenuInsides;
}(React.Component);

// hover/unhover handler


var MouseEnterExitDiv = function (_React$Component10) {
    _inherits(MouseEnterExitDiv, _React$Component10);

    function MouseEnterExitDiv(props) {
        _classCallCheck(this, MouseEnterExitDiv);

        var _this15 = _possibleConstructorReturn(this, (MouseEnterExitDiv.__proto__ || Object.getPrototypeOf(MouseEnterExitDiv)).call(this, props));

        var _this15$props = _this15.props,
            mouseEnter = _this15$props.mouseEnter,
            mouseLeave = _this15$props.mouseLeave;

        _this15.mouseEnter = mouseEnter;
        _this15.mouseLeave = mouseLeave;
        return _this15;
    }

    _createClass(MouseEnterExitDiv, [{
        key: "render",
        value: function render() {
            // padding in percentage (0-1)
            var padding = this.props.padding;


            var style = {
                position: "relative",
                margin: padding ? "-" + padding * 100 + "%" : "0",
                padding: padding ? padding * 100 + "%" : "0"
            };

            return React.createElement(
                "div",
                { className: "mouse_div" + (this.props.className ? " " + this.props.className : ""), style: style, onMouseEnter: this.mouseEnter, onDragEnter: this.mouseEnter, onMouseLeave: this.mouseLeave, onDragLeave: this.mouseLeave },
                this.props.children
            );
        }
    }]);

    return MouseEnterExitDiv;
}(React.Component);