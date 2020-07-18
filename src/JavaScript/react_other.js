var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// snakes and whatnot react components

// blank subcanvas
var BlankSubCanvas = function (_React$Component) {
    _inherits(BlankSubCanvas, _React$Component);

    function BlankSubCanvas() {
        _classCallCheck(this, BlankSubCanvas);

        return _possibleConstructorReturn(this, (BlankSubCanvas.__proto__ || Object.getPrototypeOf(BlankSubCanvas)).apply(this, arguments));
    }

    _createClass(BlankSubCanvas, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                width = _props.width,
                height = _props.height,
                refIn = _props.refIn;


            return React.createElement("canvas", { className: "subCanvas" + (this.props.className ? " " + this.props.className : ""), width: subCanvasInnerSize * (width ? width : 1), height: subCanvasInnerSize * (height ? height : 1), ref: refIn });
        }
    }]);

    return BlankSubCanvas;
}(React.Component);

// an input's details || props: input | speed: typewrite speed


var InputDetails = function (_React$Component2) {
    _inherits(InputDetails, _React$Component2);

    function InputDetails() {
        _classCallCheck(this, InputDetails);

        return _possibleConstructorReturn(this, (InputDetails.__proto__ || Object.getPrototypeOf(InputDetails)).apply(this, arguments));
    }

    _createClass(InputDetails, [{
        key: "render",
        value: function render() {
            var _this3 = this;

            var _props2 = this.props,
                input = _props2.input,
                speed = _props2.speed;

            // multiple inputs returns more inputs
            // if(input.componentID === 0){

            if (input instanceof MultipleInput) {
                return React.createElement(
                    Fragment,
                    null,
                    input.myInputs.map(function (item, index) {
                        return React.createElement(InputDetails, { input: item, speed: speed, className: _this3.props.className });
                    })
                );
            }

            // single input
            // extra details
            var extraDetails = null;
            // if(input.componentID === 2){
            if (input instanceof DirectionalInput) {
                extraDetails = React.createElement(InputDetailsDirectional, { className: "category_text", input: input });
            }
            // input info
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

    return InputDetails;
}(React.Component);
// extra input details
// directional


var InputDetailsDirectional = function (_React$Component3) {
    _inherits(InputDetailsDirectional, _React$Component3);

    function InputDetailsDirectional() {
        _classCallCheck(this, InputDetailsDirectional);

        return _possibleConstructorReturn(this, (InputDetailsDirectional.__proto__ || Object.getPrototypeOf(InputDetailsDirectional)).apply(this, arguments));
    }

    _createClass(InputDetailsDirectional, [{
        key: "render",
        value: function render() {
            var _props3 = this.props,
                input = _props3.input,
                speed = _props3.speed;

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

    return InputDetailsDirectional;
}(React.Component);

// a brain's details


var BrainDetails = function (_React$Component4) {
    _inherits(BrainDetails, _React$Component4);

    function BrainDetails() {
        _classCallCheck(this, BrainDetails);

        return _possibleConstructorReturn(this, (BrainDetails.__proto__ || Object.getPrototypeOf(BrainDetails)).apply(this, arguments));
    }

    _createClass(BrainDetails, [{
        key: "render",
        value: function render() {
            var _props4 = this.props,
                brain = _props4.brain,
                speed = _props4.speed,
                gridSize = _props4.gridSize;

            // extra details

            var extraDetails = null;
            if (brain instanceof PathBrain) {
                extraDetails = React.createElement(BrainDetailsPath, { gridSize: gridSize, className: "category_text", brain: brain, speed: speed });
            }
            // brain info
            return React.createElement(
                Fragment,
                null,
                React.createElement(
                    "p",
                    { className: "category_text_title small" },
                    brain.getComponentName()
                ),
                React.createElement(
                    TypewriterText,
                    { speed: speed },
                    React.createElement(
                        "p",
                        { className: "category_text" },
                        brain.getComponentDescription()
                    )
                ),
                extraDetails
            );
        }
    }]);

    return BrainDetails;
}(React.Component);
// path brain


var BrainDetailsPath = function (_React$Component5) {
    _inherits(BrainDetailsPath, _React$Component5);

    // 400/sec
    function BrainDetailsPath(props) {
        _classCallCheck(this, BrainDetailsPath);

        var _this6 = _possibleConstructorReturn(this, (BrainDetailsPath.__proto__ || Object.getPrototypeOf(BrainDetailsPath)).call(this, props));

        _this6.subCanvasRef = React.createRef();

        _this6.interval = null;

        _this6.update = _this6.update.bind(_this6);
        return _this6;
    }

    _createClass(BrainDetailsPath, [{
        key: "render",
        value: function render() {
            var _props5 = this.props,
                brain = _props5.brain,
                speed = _props5.speed,
                gridSize = _props5.gridSize;


            return React.createElement(BlankSubCanvas, { className: "black_background", refIn: this.subCanvasRef });
        }
    }, {
        key: "update",
        value: function update() {
            var rawPath = this.props.brain.myRawPath;
            for (var i = 0; i < 20; i++) {
                if (this.index === rawPath.length) {
                    clearInterval(this.interval);
                    return;
                }
                // ignore directionals for now
                if (!Array.isArray(rawPath[this.index])) {
                    i--;
                    this.index++;
                    continue;
                }
                // update color
                var curr = this.stages[this.stage];

                // check if should proceed to next stage
                var _ref = [this.red + curr[0], this.green + curr[1], this.blue + curr[2]];
                this.red = _ref[0];
                this.green = _ref[1];
                this.blue = _ref[2];
                var num0 = 0,
                    num255 = 0;

                num0 += this.red === 0;
                num0 += this.green === 0;
                num0 += this.blue === 0;
                num255 += this.red === 255;
                num255 += this.green === 255;
                num255 += this.blue === 255;
                if (num255 === 2 || num0 === 2) {
                    this.stage++;
                    if (this.stage >= this.stages.length) {
                        this.stage = 0;
                    }
                }

                // draw square
                var _ref2 = [rawPath[this.index][0], rawPath[this.index][1]],
                    r = _ref2[0],
                    c = _ref2[1];

                this.ctx.fillStyle = "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", 1)";
                this.ctx.beginPath();
                this.ctx.rect(c * this.step, r * this.step, this.step, this.step);
                this.ctx.fill();
                this.ctx.closePath();

                this.index++;
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _props6 = this.props,
                brain = _props6.brain,
                speed = _props6.speed,
                gridSize = _props6.gridSize;

            var rawPath = brain.myRawPath;

            this.ctx = this.subCanvasRef.current.getContext("2d");

            this.step = this.ctx.canvas.width / gridSize;

            // draws path with a gradient from green to blue to red to green
            this.red = 0;
            this.green = 255;
            this.blue = 0;

            this.index = 0;
            this.stage = 0;
            this.stages = [[0, 0, 1], [0, -1, 0], [1, 0, 0], [0, 0, -1], [0, 1, 0], [-1, 0, 0]];

            this.runsPerUpdate = 20 + (rawPath.length > 5000 ? rawPath.length / 50 : rawPath.length > 2000 ? rawPath.length / 200 : 0);

            this.interval = setInterval(this.update, 50);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        }
    }]);

    return BrainDetailsPath;
}(React.Component);

// snake details || props: snake = snake to display


var SnakeDetails = function (_React$Component6) {
    _inherits(SnakeDetails, _React$Component6);

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
                React.createElement(InputDetails, { input: snake.myInput, speed: speed }),
                React.createElement(
                    "p",
                    { className: "category_text_title" },
                    "Brain"
                ),
                React.createElement(BrainDetails, { brain: snake.myBrain, gridSize: snake.gridSize, speed: speed })
            );
        }
    }]);

    return SnakeDetails;
}(React.Component);