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

// forms
// select object (pass <option>'s as children) | onSelect(value) = called function | name = name | initVal = init val (optional)


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
// textArea (pass initVal as children) || props: onChange(value) = called function
//  IMPORTANT: takes only a single text element as its child (<TextArea><p>I am a text element</p></TextArea>)
//  IMPORTANT: only updates the function onBlur(un focus) not on change


var TextArea = function (_React$Component7) {
    _inherits(TextArea, _React$Component7);

    function TextArea(props) {
        _classCallCheck(this, TextArea);

        // initial value is children
        var _this9 = _possibleConstructorReturn(this, (TextArea.__proto__ || Object.getPrototypeOf(TextArea)).call(this, props));

        _this9.state = {
            value: React.Children.only(_this9.props.children).props.children
        };

        _this9.handleChange = _this9.handleChange.bind(_this9);
        return _this9;
    }

    _createClass(TextArea, [{
        key: "render",
        value: function render() {
            var elem = React.cloneElement(React.Children.only(this.props.children), {
                contentEditable: "true",
                onBlur: this.handleChange,
                children: this.state.value ? this.state.value : ""
            });
            elem.props.className = smooshClassNames("text_area", this.props.className, elem.props.className);

            return elem;
        }
    }, {
        key: "handleChange",
        value: function handleChange(event) {
            var _this10 = this;

            var text = $(event.target).text();

            if (text !== this.state.value) {
                this.setState(function () {
                    return { value: text };
                }, function () {
                    _this10.props.onChange(_this10.state.value);
                });
            }
        }
    }]);

    return TextArea;
}(React.Component);
// number form || props: name | onChange(val) | max(optional) | min(optional) | initVal(optional) | step(optional)


var NumberForm = function (_React$Component8) {
    _inherits(NumberForm, _React$Component8);

    function NumberForm(props) {
        _classCallCheck(this, NumberForm);

        var _this11 = _possibleConstructorReturn(this, (NumberForm.__proto__ || Object.getPrototypeOf(NumberForm)).call(this, props));

        _this11.state = {
            value: _this11.props.initVal ? _this11.props.initVal : _this11.props.min ? _this11.props.min : 0
        };

        _this11.handleChange = _this11.handleChange.bind(_this11);
        return _this11;
    }

    _createClass(NumberForm, [{
        key: "render",
        value: function render() {
            var _props2 = this.props,
                name = _props2.name,
                min = _props2.min,
                max = _props2.max,
                step = _props2.step;


            return React.createElement("input", { value: this.state.value, onChange: this.handleChange, type: "number", className: "number_input" + (this.props.className ? " " + this.props.className : ""), name: name, step: step ? step : 1 });
        }
    }, {
        key: "handleChange",
        value: function handleChange(event) {
            var _this12 = this;

            var val = parseFloat(event.target.value);

            if (val !== this.state.value && val >= this.props.min && val <= this.props.max) {
                this.setState(function (state) {
                    return {
                        value: val
                    };
                }, function () {
                    _this12.props.onChange(_this12.state.value);
                });
            }
        }
    }]);

    return NumberForm;
}(React.Component);

// a div which fills as much of the parent div (parentRef) as possible while remaining a perfect square
//   Note: parent must be relatively/absolutely positioned


var SquareFill = function (_React$Component9) {
    _inherits(SquareFill, _React$Component9);

    function SquareFill(props) {
        _classCallCheck(this, SquareFill);

        var _this13 = _possibleConstructorReturn(this, (SquareFill.__proto__ || Object.getPrototypeOf(SquareFill)).call(this, props));

        _this13.state = {
            parentWidth: 0,
            parentHeight: 0
        };

        _this13.updateState = _this13.updateState.bind(_this13);
        return _this13;
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
        key: "updateState",
        value: function updateState() {
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
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
            this.updateState();
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            // resize listener on parent ref
            window.addEventListener('resize', this.updateState);
            this.updateState();
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.updateState);
        }
    }]);

    return SquareFill;
}(React.Component);

// div which can fade in/out using css transitions
//  default is fade-out, to get opposite use props.reverse
//  prop: "shouldReset" makes it return to default visibility on prop change - slows performance


var FadeDiv = function (_React$Component10) {
    _inherits(FadeDiv, _React$Component10);

    function FadeDiv(props) {
        _classCallCheck(this, FadeDiv);

        var _this14 = _possibleConstructorReturn(this, (FadeDiv.__proto__ || Object.getPrototypeOf(FadeDiv)).call(this, props));

        _this14.state = {
            isVisible: !_this14.props.reverse
        };
        return _this14;
    }

    _createClass(FadeDiv, [{
        key: "render",
        value: function render() {
            var isVisible = this.state.isVisible;
            var _props3 = this.props,
                reverse = _props3.reverse,
                speed = _props3.speed,
                shouldReset = _props3.shouldReset;


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
            var _this15 = this;

            if (this.props.shouldReset && !deepCompare(this.props.children, prevProps.children)) {
                requestAnimationFrame(function () {
                    _this15.setState(function () {
                        return {
                            isVisible: !_this15.props.reverse
                        };
                    });
                });
            }
            // change
            else if (this.state.isVisible !== this.props.reverse) {
                    requestAnimationFrame(function () {
                        _this15.setState(function () {
                            return { isVisible: _this15.props.reverse };
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


var TypewriterText = function (_React$Component11) {
    _inherits(TypewriterText, _React$Component11);

    function TypewriterText(props) {
        _classCallCheck(this, TypewriterText);

        // bigger number is faster, 1 is normal speed, 2 is 2 times as fast, etc
        var _this16 = _possibleConstructorReturn(this, (TypewriterText.__proto__ || Object.getPrototypeOf(TypewriterText)).call(this, props));

        _this16.speed = _this16.props.speed ? _this16.props.speed : 1;
        // pull text
        _this16.text = React.Children.only(_this16.props.children).props.children;
        if (Array.isArray(_this16.text)) {
            _this16.text = _this16.text.join("");
        }

        _this16.state = {
            current: "",
            intervalReady: true
        };

        _this16.interval = null;

        _this16.update = _this16.update.bind(_this16);
        _this16.finish = _this16.finish.bind(_this16);
        return _this16;
    }

    _createClass(TypewriterText, [{
        key: "update",
        value: function update() {
            var _this17 = this;

            if (this.state.current.length >= this.text.length) {
                this.finish();
                return;
            }

            this.setState(function (state) {
                return { current: state.current + _this17.text.charAt(_this17.state.current.length) };
            });
        }
    }, {
        key: "finish",
        value: function finish() {
            var _this18 = this;

            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }

            this.setState(function (state) {
                return { current: _this18.text };
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
            var _this19 = this;

            // start typewriting when the interval is ready
            if (this.state.intervalReady) {
                this.setState(function () {
                    return { intervalReady: false };
                });
                this.interval = setInterval(function () {
                    return _this19.update();
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


var ImgIcon = function (_React$Component12) {
    _inherits(ImgIcon, _React$Component12);

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


var Menu = function (_React$Component13) {
    _inherits(Menu, _React$Component13);

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


var FadeMenu = function (_React$Component14) {
    _inherits(FadeMenu, _React$Component14);

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


var MenuInsides = function (_React$Component15) {
    _inherits(MenuInsides, _React$Component15);

    function MenuInsides(props) {
        _classCallCheck(this, MenuInsides);

        var _this23 = _possibleConstructorReturn(this, (MenuInsides.__proto__ || Object.getPrototypeOf(MenuInsides)).call(this, props));

        _this23.state = { hidden: true };

        _this23.click = _this23.click.bind(_this23);
        _this23.open = _this23.open.bind(_this23);
        _this23.close = _this23.close.bind(_this23);
        return _this23;
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


var MouseEnterExitDiv = function (_React$Component16) {
    _inherits(MouseEnterExitDiv, _React$Component16);

    function MouseEnterExitDiv(props) {
        _classCallCheck(this, MouseEnterExitDiv);

        var _this24 = _possibleConstructorReturn(this, (MouseEnterExitDiv.__proto__ || Object.getPrototypeOf(MouseEnterExitDiv)).call(this, props));

        var _this24$props = _this24.props,
            mouseEnter = _this24$props.mouseEnter,
            mouseLeave = _this24$props.mouseLeave;

        _this24.mouseEnter = mouseEnter;
        _this24.mouseLeave = mouseLeave;
        return _this24;
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


var MouseFadeDiv = function (_React$Component17) {
    _inherits(MouseFadeDiv, _React$Component17);

    function MouseFadeDiv(props) {
        _classCallCheck(this, MouseFadeDiv);

        var _this25 = _possibleConstructorReturn(this, (MouseFadeDiv.__proto__ || Object.getPrototypeOf(MouseFadeDiv)).call(this, props));

        _this25.state = { hidden: true };

        _this25.mouseEnter = _this25.mouseEnter.bind(_this25);
        _this25.mouseLeave = _this25.mouseLeave.bind(_this25);
        return _this25;
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
            this.setState(function () {
                return { hidden: true };
            });
        }
    }]);

    return MouseFadeDiv;
}(React.Component);

// div which can be collapsed || changePref (optional): (newPref) => ...


var CollapsibleDiv = function (_React$Component18) {
    _inherits(CollapsibleDiv, _React$Component18);

    function CollapsibleDiv(props) {
        _classCallCheck(this, CollapsibleDiv);

        var _this26 = _possibleConstructorReturn(this, (CollapsibleDiv.__proto__ || Object.getPrototypeOf(CollapsibleDiv)).call(this, props));

        var _this26$props = _this26.props,
            startOpen = _this26$props.startOpen,
            changePref = _this26$props.changePref;


        _this26.state = {
            open: startOpen !== undefined ? startOpen : true
        };

        _this26.change = _this26.change.bind(_this26);
        return _this26;
    }

    _createClass(CollapsibleDiv, [{
        key: "render",
        value: function render() {
            var header = null;
            var openClose = this.state.open ? "open" : "close";
            var rest = React.Children.map(this.props.children, function (val, index) {
                if (index === 0) {
                    header = React.cloneElement(val, {
                        className: "collapse_header " + openClose + (val.props.className ? " " + val.props.className : "")
                    });
                } else {
                    return val;
                }
            });

            if (this.state.open) {
                return React.createElement(
                    "div",
                    { className: "collapse_div " + openClose + (this.props.className ? " " + this.props.className : "") },
                    header,
                    React.createElement(
                        Button,
                        { className: "collapse_button", onClick: this.change },
                        React.createElement(ImgIcon, { className: "wrapper_div", small: 4, src: "src/Images/--button-640x640.png" })
                    ),
                    rest
                );
            } else {
                return React.createElement(
                    "div",
                    { className: "collapse_div " + openClose + (this.props.className ? " " + this.props.className : "") },
                    header,
                    React.createElement(
                        Button,
                        { className: "collapse_button", onClick: this.change },
                        React.createElement(ImgIcon, { className: "wrapper_div", small: 4, src: "src/Images/+-button-640x640.png" })
                    )
                );
            }
        }
    }, {
        key: "change",
        value: function change() {
            var _this27 = this;

            var _props4 = this.props,
                startOpen = _props4.startOpen,
                changePref = _props4.changePref;


            this.setState(function (state) {
                return { open: !state.open };
            }, function () {
                if (changePref) {
                    changePref(_this27.state.open);
                }
            });
        }
    }]);

    return CollapsibleDiv;
}(React.Component);

// popup shell - props: "closeFunc" function to close the popup


var PopUp = function (_React$Component19) {
    _inherits(PopUp, _React$Component19);

    function PopUp() {
        _classCallCheck(this, PopUp);

        return _possibleConstructorReturn(this, (PopUp.__proto__ || Object.getPrototypeOf(PopUp)).apply(this, arguments));
    }

    _createClass(PopUp, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "popUp-card" + (this.props.className ? " " + this.props.className : ""), onClick: this.props.onClick, onDragLeave: this.props.onDragLeave, onMouseLeave: this.props.onMouseLeave },
                React.createElement(
                    Button,
                    { onClick: this.props.closeFunc, className: "popUp_close_button" },
                    React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/x-button-820x820.png" })
                ),
                this.props.children
            );
        }
    }]);

    return PopUp;
}(React.Component);

// vertically oriented carousel


var VerticalCarousel = function (_React$Component20) {
    _inherits(VerticalCarousel, _React$Component20);

    function VerticalCarousel(props) {
        _classCallCheck(this, VerticalCarousel);

        var _this29 = _possibleConstructorReturn(this, (VerticalCarousel.__proto__ || Object.getPrototypeOf(VerticalCarousel)).call(this, props));

        _this29.state = {
            scroll: 0
        };

        _this29.focusedRef = React.createRef();
        _this29.wrapperRef = React.createRef();
        _this29.buttonRef = React.createRef();
        _this29.lastObjectRef = React.createRef();

        _this29.click = _this29.click.bind(_this29);
        _this29.scroll = _this29.scroll.bind(_this29);
        _this29.scrollToFocus = _this29.scrollToFocus.bind(_this29);
        return _this29;
    }

    _createClass(VerticalCarousel, [{
        key: "render",
        value: function render() {
            var _this30 = this;

            var _props5 = this.props,
                selected = _props5.selected,
                select = _props5.select,
                delayInitialScroll = _props5.delayInitialScroll;


            var numChildren = React.Children.count(this.props.children);
            var contents = React.Children.map(this.props.children, function (child, i) {
                // scroll
                var style = null;
                // first component is the one that scrolls
                if (i === 0) {
                    style = {
                        marginTop: -_this30.state.scroll + "px"
                    };
                }

                // focused
                if (i === selected) {
                    return React.createElement(
                        "div",
                        { className: "vertCarouselItem focused", style: style, ref: _this30.focusedRef, onClick: function onClick() {
                                return _this30.click(i);
                            } },
                        child
                    );
                } else if (i === numChildren - 1) {
                    return React.createElement(
                        "div",
                        { className: "vertCarouselItem", style: style, ref: _this30.lastObjectRef, onClick: function onClick() {
                                return _this30.click(i);
                            } },
                        child
                    );
                } else {
                    return React.createElement(
                        "div",
                        { className: "vertCarouselItem", style: style, onClick: function onClick() {
                                return _this30.click(i);
                            } },
                        child
                    );
                }
            });

            // dynamically set max-height based off of scroll (so the arrow is always visible
            var buttonHeight = this.buttonRef.current ? this.buttonRef.current.getBoundingClientRect().height : 80;
            var styleMaxHeight = {
                maxHeight: "calc(100% - " + Math.round(2 * buttonHeight - this.state.scroll) + "px)"
            };
            // let styleMaxHeight = {
            //     maxHeight: `calc(90% - 5px)`
            // };

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
                                    _this30.scroll(-(_this30.wrapperRef.current.getBoundingClientRect().height - 2 * _this30.buttonRef.current.getBoundingClientRect().height));
                                } },
                            React.createElement(ImgIcon, { className: "wrapper_div", small: 0, src: "src/Images/up-arrow-800x800.png" })
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "carousel_wrapper_2", style: styleMaxHeight },
                    contents
                ),
                React.createElement(
                    MouseFadeDiv,
                    { className: "scroll_button bottom", padding: 0.1, speed: 5 },
                    React.createElement(
                        Button,
                        { onClick: function onClick() {
                                _this30.scroll(_this30.wrapperRef.current.getBoundingClientRect().height - 2 * _this30.buttonRef.current.getBoundingClientRect().height);
                            } },
                        React.createElement(ImgIcon, { className: "wrapper_div", small: 0, src: "src/Images/down-arrow-800x800.png" })
                    )
                )
            );
        }
    }, {
        key: "click",
        value: function click(i) {
            if (i !== this.props.selected) {
                this.props.select(i);
            } else {
                this.scrollToFocus();
            }
        }
    }, {
        key: "scroll",
        value: function scroll(amount) {
            var minScroll = 0;
            // const maxScroll = 100;
            var maxScroll = this.lastObjectRef.current ? this.lastObjectRef.current.offsetTop : this.focusedRef.current.offsetTop;
            if (amount !== 0) {
                this.setState(function (state) {
                    return { scroll: Math.min(Math.max(state.scroll + amount, minScroll), maxScroll) };
                }, function () {});
            }
        }
    }, {
        key: "scrollToFocus",
        value: function scrollToFocus() {
            this.scroll(this.focusedRef.current.offsetTop - this.state.scroll);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this31 = this;

            if (this.props.delayInitialScroll) {
                setTimeout(function () {
                    return _this31.scrollToFocus();
                }, this.props.delayInitialScroll * 50);
            } else {
                this.scrollToFocus();
            }
        }
    }]);

    return VerticalCarousel;
}(React.Component);