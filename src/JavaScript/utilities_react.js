var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// REACT general purpose utilities

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
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.updateWindowDimensions();
            window.addEventListener('resize', this.updateWindowDimensions);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.updateWindowDimensions);
        }
    }, {
        key: 'updateWindowDimensions',
        value: function updateWindowDimensions() {
            this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
        }
    }]);

    return WindowSizes;
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
        key: 'render',
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
                width: side + 'px',
                height: side + 'px'
            };

            return React.createElement(
                'div',
                { style: style, className: "square_fill wrapper_div" + (this.props.className ? " " + this.props.className : "") },
                this.props.children
            );
        }
    }]);

    return SquareFill;
}(WindowSizes);

// div which can fade in/out using css transitions
//  default is fade-out, to get opposite use props.reverse


var FadeDiv = function (_React$Component2) {
    _inherits(FadeDiv, _React$Component2);

    function FadeDiv(props) {
        _classCallCheck(this, FadeDiv);

        var _this3 = _possibleConstructorReturn(this, (FadeDiv.__proto__ || Object.getPrototypeOf(FadeDiv)).call(this, props));

        _this3.state = {
            isVisible: !_this3.props.reverse
        };
        return _this3;
    }

    _createClass(FadeDiv, [{
        key: 'render',
        value: function render() {
            var isVisible = this.state.isVisible;
            var _props = this.props,
                reverse = _props.reverse,
                speed = _props.speed;

            // change

            if (isVisible !== reverse) {
                this.setState(function () {
                    return { isVisible: reverse };
                });
            }

            var style = {
                transition: 'opacity ' + Math.round(2400 / (speed ? speed : 1)) + 'ms ease',
                opacity: (isVisible ? 100 : 0) + '%'
            };

            return React.createElement(
                'div',
                { style: style, className: "wrapper_div" + (this.props.className ? " " + this.props.className : "") },
                this.props.children
            );
        }
    }]);

    return FadeDiv;
}(React.Component);

// text which is a typewriter
//   renders a single child text tag (h1, p, etc)


var TypewriterText = function (_React$Component3) {
    _inherits(TypewriterText, _React$Component3);

    function TypewriterText(props) {
        _classCallCheck(this, TypewriterText);

        // bigger number is faster, 1 is normal speed, 2 is 2 times as fast, etc
        var _this4 = _possibleConstructorReturn(this, (TypewriterText.__proto__ || Object.getPrototypeOf(TypewriterText)).call(this, props));

        _this4.speed = _this4.props.speed ? _this4.props.speed : 1;
        // pull text
        _this4.text = React.Children.only(_this4.props.children).props.children;

        _this4.state = {
            current: ""
        };

        _this4.interval = null;

        _this4.update = _this4.update.bind(_this4);
        _this4.finish = _this4.finish.bind(_this4);
        return _this4;
    }

    _createClass(TypewriterText, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this5 = this;

            this.interval = setInterval(function () {
                return _this5.update();
            }, 32 / this.speed);
        }
    }, {
        key: 'update',
        value: function update() {
            var _this6 = this;

            if (this.state.current.length >= this.text.length) {
                this.finish();
                return null;
            }

            this.setState(function (state) {
                return { current: state.current + _this6.text.charAt(_this6.state.current.length) };
            });
        }
    }, {
        key: 'finish',
        value: function finish() {
            var _this7 = this;

            if (this.interval) {
                clearInterval(this.interval);
            }

            this.setState(function (state) {
                return { current: _this7.text };
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.finish();
        }
    }, {
        key: 'render',
        value: function render() {
            // smoosh together the classnames of both classes
            var classNames = "";
            if (this.props.className) {
                classNames = this.props.className;
            }
            var childClass = React.Children.only(this.props.children).props.className;
            if (childClass) {
                classNames += (this.props.className ? " " : "") + childClass;
            }

            return React.cloneElement(this.props.children, {
                children: this.state.current,
                className: classNames
            });
        }
    }]);

    return TypewriterText;
}(React.Component);

// image icon


var ImgIcon = function (_React$Component4) {
    _inherits(ImgIcon, _React$Component4);

    function ImgIcon() {
        _classCallCheck(this, ImgIcon);

        return _possibleConstructorReturn(this, (ImgIcon.__proto__ || Object.getPrototypeOf(ImgIcon)).apply(this, arguments));
    }

    _createClass(ImgIcon, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: "icon" + (this.props.small ? " small" + (this.props.small + 0) : "") + (this.props.className ? " " + this.props.className : "") },
                React.createElement('img', { className: "wrapper_div", src: this.props.src }),
                this.props.children
            );
        }
    }]);

    return ImgIcon;
}(React.Component);

// hamburger drop down menu


var Menu = function (_React$Component5) {
    _inherits(Menu, _React$Component5);

    function Menu() {
        _classCallCheck(this, Menu);

        return _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).apply(this, arguments));
    }

    _createClass(Menu, [{
        key: 'render',
        value: function render() {
            return React.createElement(ImgIcon, { className: "menu", small: 2, src: "src/Images/hamburger-icon-550x550.png" });
        }
    }]);

    return Menu;
}(React.Component);