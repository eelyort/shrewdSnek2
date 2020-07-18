var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// snakes and whatnot react components

// an input's details || props: input | speed: typewrite speed
var SnakeInput = function (_React$Component) {
    _inherits(SnakeInput, _React$Component);

    function SnakeInput() {
        _classCallCheck(this, SnakeInput);

        return _possibleConstructorReturn(this, (SnakeInput.__proto__ || Object.getPrototypeOf(SnakeInput)).apply(this, arguments));
    }

    _createClass(SnakeInput, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                input = _props.input,
                speed = _props.speed;

            // multiple inputs returns more inputs

            if (input.componentID === 0) {
                return React.createElement(
                    Fragment,
                    null,
                    input.myInputs.map(function (item, index) {
                        return React.createElement(SnakeInput, { input: item, speed: speed, className: _this2.props.className });
                    })
                );
            }

            // single input
            // extra details
            var extraDetails = null;
            if (input.componentID === 2) {
                extraDetails = React.createElement(DetailsDirectional, { className: "category_text", input: input });
            }
            return React.createElement(
                Fragment,
                null,
                React.createElement(
                    "p",
                    { className: "category_text_title small" },
                    input.getComponentName()
                ),
                React.createElement(
                    TypewriterText,
                    { speed: speed },
                    React.createElement(
                        "p",
                        { className: "category_text" },
                        input.getComponentDescription()
                    )
                ),
                extraDetails
            );
        }
    }]);

    return SnakeInput;
}(React.Component);
// extra input details
// directional


var DetailsDirectional = function (_React$Component2) {
    _inherits(DetailsDirectional, _React$Component2);

    function DetailsDirectional() {
        _classCallCheck(this, DetailsDirectional);

        return _possibleConstructorReturn(this, (DetailsDirectional.__proto__ || Object.getPrototypeOf(DetailsDirectional)).apply(this, arguments));
    }

    _createClass(DetailsDirectional, [{
        key: "render",
        value: function render() {
            var _props2 = this.props,
                input = _props2.input,
                speed = _props2.speed;

            // decode targets

            var targets = input.vals;
            if (targets) {
                targets = targets.map(function (val, i) {
                    return decodeTargetVal(val);
                });
            }
            targets.push("Walls");

            return React.createElement(
                TypewriterText,
                { speed: speed },
                React.createElement(
                    "p",
                    { className: this.props.className },
                    "Targets: ",
                    targets.join(", "),
                    "\n",
                    "Directions: ",
                    input.originalAdjacents.join(", "),
                    "\n"
                )
            );
        }
    }]);

    return DetailsDirectional;
}(React.Component);

// snake details || props: snake = snake to display


var SnakeDetails = function (_React$Component3) {
    _inherits(SnakeDetails, _React$Component3);

    function SnakeDetails() {
        _classCallCheck(this, SnakeDetails);

        return _possibleConstructorReturn(this, (SnakeDetails.__proto__ || Object.getPrototypeOf(SnakeDetails)).apply(this, arguments));
    }

    _createClass(SnakeDetails, [{
        key: "render",
        value: function render() {
            var snake = this.props.snake;


            var speed = 3.5;

            return React.createElement(
                "div",
                { className: "snake_details" + (this.props.className ? " " + this.props.className : "") },
                React.createElement(
                    "p",
                    { className: "category_text_title" },
                    "Description"
                ),
                React.createElement(
                    TypewriterText,
                    { speed: speed },
                    React.createElement(
                        "p",
                        { className: "category_text" },
                        snake.getComponentDescription()
                    )
                ),
                React.createElement(
                    "p",
                    { className: "category_text_title" },
                    "Parameters"
                ),
                React.createElement(
                    TypewriterText,
                    { speed: speed },
                    React.createElement(
                        "p",
                        { className: "category_text" },
                        "Starting Head Position: ",
                        snake.startHeadPos,
                        "\n",
                        "Starting Length: ",
                        snake.myLength,
                        "\n",
                        "Apple Value: ",
                        snake.appleVal,
                        "\n",
                        "Grid Size: ",
                        snake.gridSize,
                        "\n"
                    )
                ),
                React.createElement(
                    "p",
                    { className: "category_text_title" },
                    "Input"
                ),
                React.createElement(SnakeInput, { input: snake.myInput, speed: speed })
            );
        }
    }]);

    return SnakeDetails;
}(React.Component);