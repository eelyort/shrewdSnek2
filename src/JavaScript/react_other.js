var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// snakes and whatnot react components

// functions for drawing input, brain, output on a canvas - returns array of arrays of centers
//   scale is the maxValue for fill color
function DrawInput(ctx, brain, width, height) {
    var xOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var yOffset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var outlineColor = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "#000000";
    var scale = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 100;

    // no input
    if (brain.myInputWidth <= 0) {
        // draw a big X lol
        ctx.lineWidth = Math.max(weightLineWidth * 5, Math.min(width, height) / 8);
        ctx.strokeStyle = "#FF0000";

        ctx.beginPath();
        ctx.moveTo(width / 10 + xOffset, height / 10 + yOffset);
        ctx.lineTo(width / 10 * 9 + xOffset, height / 10 * 9 + yOffset);
        ctx.stroke();
        ctx.closePath();

        return;
    }
    // side length
    var sideLength = Math.floor(Math.min(width / 3, height / (brain.myInputWidth * 2 + 1)));
    var leftPadding = Math.round((width - sideLength) / 2);
    var borderWidth = Math.max(minOutlineWidth, Math.floor(sideLength * outlinePercent));

    // console.log(`width: ${width}, height: ${height}, myInputWidth: ${brain.myInputWidth}, sideLength: ${sideLength}, leftPadding: ${leftPadding}, borderWidth: ${borderWidth}, borderWidth2: ${Math.floor(sideLength * 0.18)}`);

    var halfSide = sideLength / 2;

    var centers = [];

    for (var i = 0; i < brain.myInputWidth; i++) {
        var x = leftPadding + xOffset,
            y = (i * 2 + 1) * sideLength + yOffset;

        centers.push([x + halfSide, y + halfSide]);

        // draw outline - fill because stroke doesn't work well at small resolutions
        ctx.fillStyle = outlineColor;
        ctx.beginPath();
        ctx.rect(x, y, sideLength, sideLength);
        ctx.fill();
        ctx.closePath();
        ctx.clearRect(x + borderWidth, y + borderWidth, sideLength - 2 * borderWidth, sideLength - 2 * borderWidth);
    }
    return centers;
}
function DrawBrain(ctx, brain, width, height) {
    var xOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var yOffset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var outlineColor = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "#000000";
    var scale = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 100;

    // side length
    var sideLength = Math.floor(Math.min(width / (brain.myDepth * 2 + 1), height / (brain.myWidth * 2 + 1)));
    var extraHorzSpace = (width - sideLength * (brain.myDepth * 2 + 1)) / (brain.myDepth + 1);
    var extraVertSpace = (height - sideLength * (brain.myWidth * 2 + 1)) / (brain.myWidth + 1);
    var borderWidth = Math.max(minOutlineWidth, Math.floor(sideLength * outlinePercent));

    // console.log(`width: ${width}, height: ${height}, myWidth: ${brain.myWidth}, sideLength: ${sideLength}, extraHorzSpace: ${extraHorzSpace}, extraVertSpace: ${extraVertSpace}, borderWidth: ${borderWidth}, borderWidth2: ${Math.floor(sideLength * 0.18)}`);

    var halfSide = sideLength / 2;

    var centers = [];

    // layers
    for (var c = 0; c < brain.myDepth; c++) {
        centers.push([]);
        // nodes
        for (var r = 0; r < brain.myWidth; r++) {
            var x = (c * 2 + 1) * sideLength + extraHorzSpace * (c + 1) + xOffset,
                y = (r * 2 + 1) * sideLength + extraVertSpace * (r + 1) + yOffset;

            centers[c].push([x + halfSide, y + halfSide]);

            // draw outline - fill because stroke doesn't work well at small resolutions
            ctx.fillStyle = outlineColor;
            ctx.beginPath();
            ctx.rect(x, y, sideLength, sideLength);
            ctx.fill();
            ctx.closePath();
            ctx.clearRect(x + borderWidth, y + borderWidth, sideLength - 2 * borderWidth, sideLength - 2 * borderWidth);

            // fill with red for negative numbers, blue for positive
            if (brain.hasValues) {
                var curr = brain.myMat[c][2][r];
                var opacity = Math.round(Math.min(Math.abs(curr) / scale, 1) * 100) / 100;
                if (curr > 0) {
                    ctx.fillStyle = "rgba(0, 0, 255, " + opacity + ")";
                } else {
                    ctx.fillStyle = "rgba(255, 0, 0, " + opacity + ")";
                }
                // console.log(`curr: ${curr}, opacity: ${opacity}, fillStyle: ${ctx.fillStyle}`);
                ctx.beginPath();
                ctx.rect(x + borderWidth, y + borderWidth, sideLength - 2 * borderWidth, sideLength - 2 * borderWidth);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    return centers;
}
function DrawOutput(ctx, brain, width, height) {
    var xOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var yOffset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var outlineColor = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "#000000";
    var scale = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 100;

    // side length
    var sideLength = Math.floor(Math.min(width / 3, height / (4 * 2 + 1)));
    var leftPadding = Math.round((width - sideLength) / 2);
    var borderWidth = Math.max(minOutlineWidth, Math.floor(sideLength * outlinePercent));

    // console.log(`width: ${width}, height: ${height}, 4: ${4}, sideLength: ${sideLength}, leftPadding: ${leftPadding}, borderWidth: ${borderWidth}, borderWidth2: ${Math.floor(sideLength * 0.18)}`);

    var halfSide = sideLength / 2;

    var centers = [];

    for (var i = 0; i < 4; i++) {
        var x = leftPadding + xOffset,
            y = (i * 2 + 1) * sideLength + yOffset;

        centers.push([x + halfSide, y + halfSide]);

        // draw outline - fill because stroke doesn't work well at small resolutions
        ctx.fillStyle = outlineColor;
        ctx.beginPath();
        ctx.rect(x, y, sideLength, sideLength);
        ctx.fill();
        ctx.closePath();
        ctx.clearRect(x + borderWidth, y + borderWidth, sideLength - 2 * borderWidth, sideLength - 2 * borderWidth);

        // fill with red for negative numbers, blue for positive
        if (brain.hasValues) {
            var curr = brain.myMat[brain.myDepth][2][i];
            var opacity = Math.round(Math.min(Math.abs(curr) / scale, 1) * 100) / 100;
            if (curr > 0) {
                ctx.fillStyle = "rgba(0, 0, 255, " + opacity + ")";
            } else {
                ctx.fillStyle = "rgba(255, 0, 0, " + opacity + ")";
            }
            // console.log(`curr: ${curr}, opacity: ${opacity}, fillStyle: ${ctx.fillStyle}`);
            ctx.beginPath();
            ctx.rect(x + borderWidth, y + borderWidth, sideLength - 2 * borderWidth, sideLength - 2 * borderWidth);
            ctx.fill();
            ctx.closePath();
        }
    }
    return centers;
}

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

// extra input details
// directional


var InputDetailsDirectional = function (_React$Component2) {
    _inherits(InputDetailsDirectional, _React$Component2);

    function InputDetailsDirectional() {
        _classCallCheck(this, InputDetailsDirectional);

        return _possibleConstructorReturn(this, (InputDetailsDirectional.__proto__ || Object.getPrototypeOf(InputDetailsDirectional)).apply(this, arguments));
    }

    _createClass(InputDetailsDirectional, [{
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

    return InputDetailsDirectional;
}(React.Component);
// an input's details || props: input | speed: typewrite speed


var InputDetails = function (_React$Component3) {
    _inherits(InputDetails, _React$Component3);

    function InputDetails() {
        _classCallCheck(this, InputDetails);

        return _possibleConstructorReturn(this, (InputDetails.__proto__ || Object.getPrototypeOf(InputDetails)).apply(this, arguments));
    }

    _createClass(InputDetails, [{
        key: "render",
        value: function render() {
            var _this4 = this;

            var _props3 = this.props,
                input = _props3.input,
                speed = _props3.speed;

            // multiple inputs returns more inputs
            // if(input.componentID === 0){

            if (input instanceof MultipleInput) {
                return React.createElement(
                    Fragment,
                    null,
                    input.myInputs.map(function (item, index) {
                        return React.createElement(InputDetails, { input: item, speed: speed, className: _this4.props.className });
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

// extra brain details
// path brain


var BrainDetailsPath = function (_React$Component4) {
    _inherits(BrainDetailsPath, _React$Component4);

    // 400/sec
    function BrainDetailsPath(props) {
        _classCallCheck(this, BrainDetailsPath);

        var _this5 = _possibleConstructorReturn(this, (BrainDetailsPath.__proto__ || Object.getPrototypeOf(BrainDetailsPath)).call(this, props));

        _this5.subCanvasRef = React.createRef();

        _this5.interval = null;

        _this5.update = _this5.update.bind(_this5);
        return _this5;
    }

    _createClass(BrainDetailsPath, [{
        key: "render",
        value: function render() {
            var _props4 = this.props,
                brain = _props4.brain,
                speed = _props4.speed,
                gridSize = _props4.gridSize;


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
        key: "startRun",
        value: function startRun() {
            var _props5 = this.props,
                brain = _props5.brain,
                speed = _props5.speed,
                gridSize = _props5.gridSize;

            var rawPath = brain.myRawPath;

            this.ctx = this.subCanvasRef.current.getContext("2d");

            // clear old
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

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
        key: "componentDidMount",
        value: function componentDidMount() {
            this.startRun();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
            this.startRun();
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
// neural net


var BrainDetailsNet = function (_React$Component5) {
    _inherits(BrainDetailsNet, _React$Component5);

    function BrainDetailsNet(props) {
        _classCallCheck(this, BrainDetailsNet);

        var _this6 = _possibleConstructorReturn(this, (BrainDetailsNet.__proto__ || Object.getPrototypeOf(BrainDetailsNet)).call(this, props));

        _this6.subCanvasRef = React.createRef();

        _this6.draw = _this6.draw.bind(_this6);
        return _this6;
    }

    _createClass(BrainDetailsNet, [{
        key: "render",
        value: function render() {
            var _props6 = this.props,
                brain = _props6.brain,
                speed = _props6.speed,
                gridSize = _props6.gridSize;


            return React.createElement(BlankSubCanvas, { width: 2, className: "", refIn: this.subCanvasRef });
        }
    }, {
        key: "draw",
        value: function draw() {
            var _props7 = this.props,
                brain = _props7.brain,
                speed = _props7.speed,
                gridSize = _props7.gridSize;

            var ctx = this.subCanvasRef.current.getContext("2d");
            var mat = brain.myMat;

            // clear
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // bias scale - basically find the max bias
            var biasScale = 0;
            if (brain.hasValues) {
                // layer
                for (var layer = 0; layer < mat.length; layer++) {
                    // node
                    for (var node = 0; node < mat[layer][2].length; node++) {
                        biasScale = Math.max(biasScale, Math.abs(mat[layer][2][node]));
                    }
                }
            }
            // weight scale
            var weightScale = 0;
            if (brain.hasValues) {
                // layer
                for (var _layer = 0; _layer < mat.length; _layer++) {
                    // destination node
                    for (var _node = 0; _node < mat[_layer][1].length; _node++) {
                        // src node
                        for (var src = 0; src < mat[_layer][1][_node].length; src++) {
                            weightScale = Math.max(weightScale, Math.abs(mat[_layer][1][_node][src]));
                        }
                    }
                }
            }
            // console.log(`biasScale: ${biasScale}, weightScale: ${weightScale}`);

            var widthUsed = Math.floor(ctx.canvas.width / 4);

            // draw inputs
            var centers = [DrawInput(ctx, brain, widthUsed, ctx.canvas.height, 0, 0, "#000000")];
            // console.log("input:");
            // console.log(centers);

            // draw brain
            var curr = DrawBrain(ctx, brain, Math.floor(ctx.canvas.width / 2), ctx.canvas.height, widthUsed, 0, "#000000", biasScale);
            centers = centers.concat(DrawBrain(ctx, brain, Math.floor(ctx.canvas.width / 2), ctx.canvas.height, widthUsed, 0, "#000000", biasScale));
            widthUsed += Math.floor(ctx.canvas.width / 2);
            // console.log("brain:");
            // console.log(centers);

            // draw outputs
            centers.push(DrawOutput(ctx, brain, Math.floor(ctx.canvas.width / 4), ctx.canvas.height, widthUsed, 0, "#000000", biasScale));
            // console.log("output:");
            // console.log(centers);

            // weights
            if (brain.hasValues) {
                // console.log(centers);
                ctx.lineWidth = weightLineWidth;

                // layer
                for (var _layer2 = 0; _layer2 < mat.length; _layer2++) {
                    // destination node
                    for (var targetNode = 0; targetNode < mat[_layer2][1].length; targetNode++) {
                        // src node
                        for (var srcNode = 0; srcNode < mat[_layer2][1][targetNode].length; srcNode++) {
                            var currVal = mat[_layer2][1][targetNode][srcNode];

                            var _centers$_layer2$srcN = _slicedToArray(centers[_layer2][srcNode], 2),
                                srcX = _centers$_layer2$srcN[0],
                                srcY = _centers$_layer2$srcN[1];

                            var _centers$targetNode = _slicedToArray(centers[_layer2 + 1][targetNode], 2),
                                targetX = _centers$targetNode[0],
                                targetY = _centers$targetNode[1];

                            // console.log(`layer: ${layer}, target: ${targetNode}, src: ${srcNode}, currVal: ${currVal}, srcCoord: ${[srcX, srcY]}, targetCoord: ${[targetX, targetY]}`);

                            var opacity = Math.round(Math.min(Math.abs(currVal) / (weightScale / weightLineOpacityMultiplier), 1) * 100) / 100;
                            if (currVal > 0) {
                                ctx.strokeStyle = "rgba(0, 0, 255, " + opacity + ")";
                            } else {
                                ctx.strokeStyle = "rgba(255, 0, 0, " + opacity + ")";
                            }
                            // console.log(`curr: ${curr}, opacity: ${opacity}, fillStyle: ${ctx.fillStyle}`);
                            ctx.beginPath();
                            ctx.moveTo(srcX, srcY);
                            ctx.lineTo(targetX, targetY);
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.draw();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
            this.draw();
        }
    }]);

    return BrainDetailsNet;
}(React.Component);
// a brain's details


var BrainDetails = function (_React$Component6) {
    _inherits(BrainDetails, _React$Component6);

    function BrainDetails() {
        _classCallCheck(this, BrainDetails);

        return _possibleConstructorReturn(this, (BrainDetails.__proto__ || Object.getPrototypeOf(BrainDetails)).apply(this, arguments));
    }

    _createClass(BrainDetails, [{
        key: "render",
        value: function render() {
            var _props8 = this.props,
                brain = _props8.brain,
                speed = _props8.speed,
                gridSize = _props8.gridSize;

            // extra details

            var extraDetails = null;
            if (brain instanceof PathBrain) {
                extraDetails = React.createElement(BrainDetailsPath, { gridSize: gridSize, className: "category_text", brain: brain, speed: speed });
            } else if (brain instanceof NeuralNetBrain) {
                extraDetails = React.createElement(BrainDetailsNet, { gridSize: gridSize, className: "category_text", brain: brain, speed: speed });
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

// snake details || props: snake = snake to display


var SnakeDetails = function (_React$Component7) {
    _inherits(SnakeDetails, _React$Component7);

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