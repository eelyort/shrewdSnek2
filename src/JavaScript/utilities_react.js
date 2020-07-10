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
                { style: style, className: "square_fill" + (this.props.className ? " " + this.props.className : "") },
                this.props.children
            );
        }
    }]);

    return SquareFill;
}(WindowSizes);

// div which slowly fades away
//   prop 'sec' for seconds to fade, allows 2 decimal places


var FadeAwayDiv = function (_React$Component2) {
    _inherits(FadeAwayDiv, _React$Component2);

    function FadeAwayDiv(props) {
        _classCallCheck(this, FadeAwayDiv);

        var _this3 = _possibleConstructorReturn(this, (FadeAwayDiv.__proto__ || Object.getPrototypeOf(FadeAwayDiv)).call(this, props));

        _this3.myInterval = null;

        // milliseconds to disappear, default is 2 sec, round to the tens place
        _this3.msToFade = _this3.props.sec ? Math.round(_this3.props.sec * 100) * 10 : 2000;

        _this3.state = { msLeft: _this3.msToFade };

        _this3.update = _this3.update.bind(_this3);
        _this3.finish = _this3.finish.bind(_this3);
        return _this3;
    }

    _createClass(FadeAwayDiv, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this4 = this;

            this.myInterval = setInterval(function () {
                return _this4.update;
            }, 10);
        }
    }, {
        key: 'render',
        value: function render() {
            var style = {
                opacity: this.state.msLeft / this.msToFade
            };

            return React.createElement(
                'div',
                { style: style, className: this.props.className },
                this.props.children
            );
        }
    }, {
        key: 'update',
        value: function update() {
            if (this.state.msLeft <= 0) {
                this.finish();
                return null;
            }

            this.setState(function (state) {
                return { msLeft: state.msLeft - 10 };
            });
        }
    }, {
        key: 'finish',
        value: function finish() {
            if (this.myInterval) {
                clearInterval(this.myInterval);
            }

            this.setState(function () {
                return { msLeft: 0 };
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.finish();
        }
    }]);

    return FadeAwayDiv;
}(React.Component);