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

// so you can return multiple elements

var Fragment = function (_React$Component) {
    _inherits(Fragment, _React$Component);

    function Fragment() {
        _classCallCheck(this, Fragment);

        return _possibleConstructorReturn(this, (Fragment.__proto__ || Object.getPrototypeOf(Fragment)).apply(this, arguments));
    }

    _createClass(Fragment, [{
        key: "render",
        value: function render() {
            return this.props.children;
        }
    }]);

    return Fragment;
}(React.Component);
// parent class that has the window's width/height and updates on resize


var WindowSizes = function (_React$Component2) {
    _inherits(WindowSizes, _React$Component2);

    function WindowSizes(props) {
        _classCallCheck(this, WindowSizes);

        var _this2 = _possibleConstructorReturn(this, (WindowSizes.__proto__ || Object.getPrototypeOf(WindowSizes)).call(this, props));

        _this2.state = { windowWidth: 0, windowHeight: 0 };
        _this2.updateWindowDimensions = _this2.updateWindowDimensions.bind(_this2);
        return _this2;
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


var Button = function (_React$Component3) {
    _inherits(Button, _React$Component3);

    function Button() {
        _classCallCheck(this, Button);

        return _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
    }

    _createClass(Button, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "button",
                { className: "button" + (this.props.className ? " " + this.props.className : ""), onClick: this.props.onClick,
                    onMouseDown: this.props.onMouseDown, onMouseUp: this.props.onMouseUp, onDragLeave: this.props.onMouseUp },
                this.props.children
            );
        }
    }]);

    return Button;
}(React.Component);
// button (div) which toggles between multiple buttons
//   put in multiple "Button" components into children to use (Button is the one above ^^^)


var ToggleButton = function (_React$Component4) {
    _inherits(ToggleButton, _React$Component4);

    function ToggleButton(props) {
        _classCallCheck(this, ToggleButton);

        var _this4 = _possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).call(this, props));

        _this4.state = {
            index: 0
        };

        // pull out all the functions and buttons
        _this4.funcs = React.Children.map(_this4.props.children, function (child, index) {
            return child.props.onClick;
        });
        _this4.buttons = React.Children.toArray(_this4.props.children);

        _this4.clicked = _this4.clicked.bind(_this4);
        return _this4;
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
            var _this5 = this;

            this.funcs[this.state.index]();

            this.setState(function (state) {
                return { index: state.index >= _this5.funcs.length - 1 ? 0 : state.index + 1 };
            });
        }
    }]);

    return ToggleButton;
}(React.Component);
// button (div) which calls its function for as long as it is held down - with increasing speed
//   prop "speed" (default 1), higher number makes it call the function faster
//   prop "growth" (default 1), higher number makes the rate at which hits the function accelerate (1 is flat)
//   "onClick": "(multi) => {...}" ; recommended for anything where (maxRate < 1000)


var HoldButton = function (_React$Component5) {
    _inherits(HoldButton, _React$Component5);

    function HoldButton(props) {
        _classCallCheck(this, HoldButton);

        var _this6 = _possibleConstructorReturn(this, (HoldButton.__proto__ || Object.getPrototypeOf(HoldButton)).call(this, props));

        _this6.interval = null;
        _this6.ticksHeld = 0;

        _this6.update = _this6.update.bind(_this6);
        _this6.startHold = _this6.startHold.bind(_this6);
        _this6.releaseHold = _this6.releaseHold.bind(_this6);
        return _this6;
    }

    _createClass(HoldButton, [{
        key: "update",
        value: function update() {
            var _props = this.props,
                onClick = _props.onClick,
                speed = _props.speed,
                growth = _props.growth,
                maxRate = _props.maxRate;


            this.ticksHeld++;

            var currCalls = Math.ceil(Math.pow(Math.max(growth ? growth : 1, 1), Math.floor(this.ticksHeld / 5)));
            if (currCalls > maxRate) {
                currCalls = maxRate;
            }

            // if the function passed in allows multipliers
            if (onClick.length >= 1) {
                onClick(currCalls);
            } else {
                for (var i = 0; i < currCalls; i++) {
                    onClick();
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                Button,
                { className: this.props.className, onMouseDown: this.startHold, onMouseUp: this.releaseHold },
                this.props.children
            );
        }
    }, {
        key: "startHold",
        value: function startHold() {
            this.ticksHeld = 0;
            this.interval = setInterval(this.update, 80 / (this.props.speed ? this.props.speed : 1));
        }
    }, {
        key: "releaseHold",
        value: function releaseHold() {
            clearInterval(this.interval);
        }
    }]);

    return HoldButton;
}(React.Component);
// select object | onSelect(value) = called function | name = name | initVal = init val (optional)


var Select = function (_React$Component6) {
    _inherits(Select, _React$Component6);

    function Select(props) {
        _classCallCheck(this, Select);

        var _this7 = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

        var _this7$props = _this7.props,
            onSelect = _this7$props.onSelect,
            name = _this7$props.name,
            initVal = _this7$props.initVal;

        // no initVal, get the value of the first component

        _this7.state = { value: initVal ? initVal : React.Children.toArray(_this7.props.children)[0].value };

        _this7.handleChange = _this7.handleChange.bind(_this7);
        return _this7;
    }

    _createClass(Select, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "select",
                { value: this.state.value, onChange: this.handleChange, className: this.props.className, name: this.props.name },
                this.props.children
            );
        }
    }, {
        key: "handleChange",
        value: function handleChange(event) {
            var _this8 = this;

            var ans = event.target.value;
            if (ans !== this.state.value) {
                this.setState(function (state) {
                    return {
                        value: ans
                    };
                }, function () {
                    return _this8.props.onSelect(ans);
                });
            }
        }
    }]);

    return Select;
}(React.Component);

// a div which fills as much of the parent div (parentRef) as possible while remaining a perfect square
//   Note: parent must be relatively/absolutely positioned


var SquareFill = function (_React$Component7) {
    _inherits(SquareFill, _React$Component7);

    function SquareFill(props) {
        _classCallCheck(this, SquareFill);

        var _this9 = _possibleConstructorReturn(this, (SquareFill.__proto__ || Object.getPrototypeOf(SquareFill)).call(this, props));

        _this9.state = {
            parentWidth: 0,
            parentHeight: 0
        };
        return _this9;
    }

    _createClass(SquareFill, [{
        key: "render",
        value: function render() {
            var _state = this.state,
                parentWidth = _state.parentWidth,
                parentHeight = _state.parentHeight;
            var parentRef = this.props.parentRef;
            var width = parentWidth,
                height = parentHeight;


            var side = Math.min(width, height);

            var style = {
                width: side + "px",
                height: side + "px"
            };

            return React.createElement(
                "div",
                { style: style,
                    className: "square_fill wrapper_div" + (this.props.className ? " " + this.props.className : "") },
                this.props.children
            );
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
            var rect = this.props.parentRef.current.getBoundingClientRect();
            var _ref = [rect.width, rect.height],
                width = _ref[0],
                height = _ref[1];

            if (width !== this.state.parentWidth || height !== this.state.parentHeight) {
                this.setState(function (state) {
                    return {
                        parentWidth: width,
                        parentHeight: height
                    };
                });
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.forceUpdate();
        }
    }]);

    return SquareFill;
}(React.Component);

// div which can fade in/out using css transitions
//  default is fade-out, to get opposite use props.reverse
//  prop: "shouldReset" makes it return to default visibility on prop change - slows performance


var FadeDiv = function (_React$Component8) {
    _inherits(FadeDiv, _React$Component8);

    function FadeDiv(props) {
        _classCallCheck(this, FadeDiv);

        var _this10 = _possibleConstructorReturn(this, (FadeDiv.__proto__ || Object.getPrototypeOf(FadeDiv)).call(this, props));

        _this10.state = {
            isVisible: !_this10.props.reverse
        };
        return _this10;
    }

    _createClass(FadeDiv, [{
        key: "render",
        value: function render() {
            var isVisible = this.state.isVisible;
            var _props2 = this.props,
                reverse = _props2.reverse,
                speed = _props2.speed,
                shouldReset = _props2.shouldReset;


            var style = {
                opacity: (isVisible ? 100 : 0) + "%"
            };

            // the component should immediately (no transition) go back to its original opacity if it is being reset
            if (isVisible === reverse || !shouldReset) {
                style["transition"] = "opacity " + Math.round(1600 / (speed ? speed : 1)) + "ms ease-in";
            }

            return React.createElement(
                "div",
                { style: style, className: "wrapper_div" + (this.props.className ? " " + this.props.className : "") },
                this.props.children
            );
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
            var _this11 = this;

            if (this.props.shouldReset && !deepCompare(this.props.children, prevProps.children)) {
                requestAnimationFrame(function () {
                    _this11.setState(function () {
                        return {
                            isVisible: !_this11.props.reverse
                        };
                    });
                });
            }
            // change
            else if (this.state.isVisible !== this.props.reverse) {
                    requestAnimationFrame(function () {
                        _this11.setState(function () {
                            return { isVisible: _this11.props.reverse };
                        });
                    });
                }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.forceUpdate();
        }
    }]);

    return FadeDiv;
}(React.Component);

// text which is a typewriter
//   renders a single child text tag (h1, p, etc)


var TypewriterText = function (_React$Component9) {
    _inherits(TypewriterText, _React$Component9);

    function TypewriterText(props) {
        _classCallCheck(this, TypewriterText);

        // bigger number is faster, 1 is normal speed, 2 is 2 times as fast, etc
        var _this12 = _possibleConstructorReturn(this, (TypewriterText.__proto__ || Object.getPrototypeOf(TypewriterText)).call(this, props));

        _this12.speed = _this12.props.speed ? _this12.props.speed : 1;
        // pull text
        _this12.text = React.Children.only(_this12.props.children).props.children;
        if (Array.isArray(_this12.text)) {
            _this12.text = _this12.text.join("");
        }

        _this12.state = {
            current: "",
            intervalReady: true
        };

        _this12.interval = null;

        _this12.update = _this12.update.bind(_this12);
        _this12.finish = _this12.finish.bind(_this12);
        return _this12;
    }

    _createClass(TypewriterText, [{
        key: "update",
        value: function update() {
            var _this13 = this;

            if (this.state.current.length >= this.text.length) {
                this.finish();
                return;
            }

            this.setState(function (state) {
                return { current: state.current + _this13.text.charAt(_this13.state.current.length) };
            });
        }
    }, {
        key: "finish",
        value: function finish() {
            var _this14 = this;

            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }

            this.setState(function (state) {
                return { current: _this14.text };
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
            var _this15 = this;

            // start typewriting when the interval is ready
            if (this.state.intervalReady) {
                this.setState(function () {
                    return { intervalReady: false };
                });
                this.interval = setInterval(function () {
                    return _this15.update();
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


var ImgIcon = function (_React$Component10) {
    _inherits(ImgIcon, _React$Component10);

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


var Menu = function (_React$Component11) {
    _inherits(Menu, _React$Component11);

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


var FadeMenu = function (_React$Component12) {
    _inherits(FadeMenu, _React$Component12);

    function FadeMenu() {
        _classCallCheck(this, FadeMenu);

        return _possibleConstructorReturn(this, (FadeMenu.__proto__ || Object.getPrototypeOf(FadeMenu)).apply(this, arguments));
    }

    _createClass(FadeMenu, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "menu_position" + (this.props.className ? " " + this.props.className : "") },
                React.createElement(
                    MouseFadeDiv,
                    { padding: 2.6, speed: 4 },
                    React.createElement(
                        MenuInsides,
                        null,
                        this.props.children
                    )
                )
            );
        }
    }]);

    return FadeMenu;
}(React.Component);
// hamburger drop down menu insides - NEVER use this directly


var MenuInsides = function (_React$Component13) {
    _inherits(MenuInsides, _React$Component13);

    function MenuInsides(props) {
        _classCallCheck(this, MenuInsides);

        var _this19 = _possibleConstructorReturn(this, (MenuInsides.__proto__ || Object.getPrototypeOf(MenuInsides)).call(this, props));

        _this19.state = { hidden: true };

        _this19.click = _this19.click.bind(_this19);
        _this19.open = _this19.open.bind(_this19);
        _this19.close = _this19.close.bind(_this19);
        return _this19;
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


var MouseEnterExitDiv = function (_React$Component14) {
    _inherits(MouseEnterExitDiv, _React$Component14);

    function MouseEnterExitDiv(props) {
        _classCallCheck(this, MouseEnterExitDiv);

        var _this20 = _possibleConstructorReturn(this, (MouseEnterExitDiv.__proto__ || Object.getPrototypeOf(MouseEnterExitDiv)).call(this, props));

        var _this20$props = _this20.props,
            mouseEnter = _this20$props.mouseEnter,
            mouseLeave = _this20$props.mouseLeave;

        _this20.mouseEnter = mouseEnter;
        _this20.mouseLeave = mouseLeave;
        return _this20;
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
                { className: "mouse_div" + (this.props.className ? " " + this.props.className : ""), style: style, onClick: this.props.onClick, onMouseEnter: this.mouseEnter, onDragEnter: this.mouseEnter, onMouseLeave: this.mouseLeave, onDragLeave: this.mouseLeave },
                this.props.children
            );
        }
    }]);

    return MouseEnterExitDiv;
}(React.Component);
// a div which fades away when mouse is far/vice-versa


var MouseFadeDiv = function (_React$Component15) {
    _inherits(MouseFadeDiv, _React$Component15);

    function MouseFadeDiv(props) {
        _classCallCheck(this, MouseFadeDiv);

        var _this21 = _possibleConstructorReturn(this, (MouseFadeDiv.__proto__ || Object.getPrototypeOf(MouseFadeDiv)).call(this, props));

        _this21.state = { hidden: true };

        _this21.mouseEnter = _this21.mouseEnter.bind(_this21);
        _this21.mouseLeave = _this21.mouseLeave.bind(_this21);
        return _this21;
    }

    _createClass(MouseFadeDiv, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "relative wrapper_div" + (this.props.className ? " " + this.props.className : "") },
                React.createElement(
                    MouseEnterExitDiv,
                    { onClick: this.mouseEnter, padding: this.props.padding, mouseEnter: this.mouseEnter, mouseLeave: this.mouseLeave },
                    React.createElement(
                        FadeDiv,
                        { reverse: !this.state.hidden, speed: this.props.speed },
                        this.props.children
                    )
                )
            );
        }
    }, {
        key: "mouseEnter",
        value: function mouseEnter(e) {
            this.setState(function () {
                return { hidden: false };
            });
        }
    }, {
        key: "mouseLeave",
        value: function mouseLeave(e) {
            // console.log("leave");
            this.setState(function () {
                return { hidden: true };
            });
        }
    }]);

    return MouseFadeDiv;
}(React.Component);

// popup shell - props: "closePopUp" function that closes the popup


var PopUp = function (_React$Component16) {
    _inherits(PopUp, _React$Component16);

    function PopUp() {
        _classCallCheck(this, PopUp);

        return _possibleConstructorReturn(this, (PopUp.__proto__ || Object.getPrototypeOf(PopUp)).apply(this, arguments));
    }

    _createClass(PopUp, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "popUp-card" + (this.props.className ? " " + this.props.className : ""), onDragLeave: this.props.closePopUp, onMouseLeave: this.props.closePopUp },
                this.props.children
            );
        }
    }]);

    return PopUp;
}(React.Component);

// vertically oriented carousel


var VerticalCarousel = function (_React$Component17) {
    _inherits(VerticalCarousel, _React$Component17);

    function VerticalCarousel(props) {
        _classCallCheck(this, VerticalCarousel);

        var _this23 = _possibleConstructorReturn(this, (VerticalCarousel.__proto__ || Object.getPrototypeOf(VerticalCarousel)).call(this, props));

        _this23.state = {
            scroll: 0
        };

        _this23.focusedRef = React.createRef();
        _this23.wrapperRef = React.createRef();
        _this23.buttonRef = React.createRef();
        _this23.lastObjectRef = React.createRef();

        _this23.click = _this23.click.bind(_this23);
        _this23.scroll = _this23.scroll.bind(_this23);
        _this23.scrollToFocus = _this23.scrollToFocus.bind(_this23);
        return _this23;
    }

    _createClass(VerticalCarousel, [{
        key: "render",
        value: function render() {
            var _this24 = this;

            var _props3 = this.props,
                selected = _props3.selected,
                select = _props3.select;


            var numChildren = React.Children.count(this.props.children);
            var contents = React.Children.map(this.props.children, function (child, i) {
                // scroll
                var style = null;
                // first component is the one that scrolls
                if (i === 0) {
                    style = {
                        marginTop: -_this24.state.scroll + "px"
                    };
                }

                // focused
                if (i === selected) {
                    return React.createElement(
                        "div",
                        { className: "vertCarouselItem focused", style: style, ref: _this24.focusedRef, onClick: function onClick() {
                                return _this24.click(i);
                            } },
                        child
                    );
                } else if (i === numChildren - 1) {
                    return React.createElement(
                        "div",
                        { className: "vertCarouselItem", style: style, ref: _this24.lastObjectRef, onClick: function onClick() {
                                return _this24.click(i);
                            } },
                        child
                    );
                } else {
                    return React.createElement(
                        "div",
                        { className: "vertCarouselItem", style: style, onClick: function onClick() {
                                return _this24.click(i);
                            } },
                        child
                    );
                }
            });

            return React.createElement(
                "div",
                { ref: this.wrapperRef, className: "carousel_wrapper" + (this.props.className ? " " + this.props.className : "") },
                React.createElement(
                    "div",
                    { className: "wrapper_div", ref: this.buttonRef },
                    React.createElement(
                        MouseFadeDiv,
                        { className: "scroll_button top", padding: 0.1, speed: 5 },
                        React.createElement(
                            Button,
                            { onClick: function onClick() {
                                    _this24.scroll(-(_this24.wrapperRef.current.getBoundingClientRect().height - 2 * _this24.buttonRef.current.getBoundingClientRect().height));
                                } },
                            React.createElement(ImgIcon, { className: "wrapper_div", small: 0, src: "src/Images/up-arrow-800x800.png" })
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "carousel_wrapper_2" },
                    contents
                ),
                React.createElement(
                    MouseFadeDiv,
                    { className: "scroll_button bottom", padding: 0.1, speed: 5 },
                    React.createElement(
                        Button,
                        { onClick: function onClick() {
                                _this24.scroll(_this24.wrapperRef.current.getBoundingClientRect().height - 2 * _this24.buttonRef.current.getBoundingClientRect().height);
                            } },
                        React.createElement(ImgIcon, { className: "wrapper_div", small: 0, src: "src/Images/down-arrow-800x800.png" })
                    )
                )
            );
        }
    }, {
        key: "click",
        value: function click(i) {
            console.log("click(" + i + ")");
            if (i !== this.props.selected) {
                this.props.select(i);
            } else {
                this.scrollToFocus();
            }
        }
    }, {
        key: "scroll",
        value: function scroll(amount) {
            console.log("scroll(" + amount + ")");
            var minScroll = 0;
            var maxScroll = this.state.scroll + (this.lastObjectRef.current ? this.lastObjectRef.current.offsetTop : this.focusedRef.current.offsetTop);
            if (amount !== 0) {
                this.setState(function (state) {
                    return { scroll: Math.min(Math.max(state.scroll + amount, minScroll), maxScroll) };
                });
            }
        }
    }, {
        key: "scrollToFocus",
        value: function scrollToFocus() {
            console.log("scroll: " + this.state.scroll + ", this.focusedRef.current.offsetTop: " + this.focusedRef.current.offsetTop);
            this.scroll(this.focusedRef.current.offsetTop - this.state.scroll);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.scrollToFocus();
        }
    }]);

    return VerticalCarousel;
}(React.Component);