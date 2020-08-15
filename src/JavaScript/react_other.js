var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
                speed = _props2.speed,
                edit = _props2.edit,
                editFuncs = _props2.editFuncs,
                multipleIndex = _props2.multipleIndex;

            // decode targets

            var targets = ["Walls"];
            if (input.vals) {
                targets = targets.concat(input.vals.map(function (val, i) {
                    return decodeTargetVal(val);
                }));
            }

            // static display
            if (!edit) {
                return React.createElement(
                    TypewriterText,
                    { speed: speed },
                    React.createElement(
                        "p",
                        { className: "" + (this.props.className ? this.props.className : "") },
                        "Targets: ",
                        targets.join(", "),
                        "\n",
                        "Directions: ",
                        input.originalAdjacents.join(", "),
                        "\n"
                    )
                );
            }
            // editable
            else {
                    var changeFunc = function changeFunc(index, e, isTarget) {
                        var newVal = isNaN(e.target.value) ? e.target.value : parseInt(e.target.value);

                        // handle both targets and directions
                        var arr = isTarget ? input.vals : input.originalAdjacents;

                        // newVal = -1? delete, otherwise add
                        if (newVal === -1) {
                            arr.splice(index, 1);
                        }
                        // modify
                        else {
                                arr.splice(index, 1, newVal);
                            }
                        editFuncs.update();
                    };
                    return React.createElement(
                        Fragment,
                        null,
                        React.createElement(
                            "div",
                            { className: "inline_block_parent" },
                            React.createElement(
                                "p",
                                { className: "" + (this.props.className ? this.props.className : "") },
                                "Targets: Walls, "
                            ),
                            input.vals.map(function (currTarget, currIndexSelect) {
                                return React.createElement(
                                    "select",
                                    { value: currTarget, name: "directional_target_" + currIndexSelect, onChange: function onChange(e) {
                                            return changeFunc(currIndexSelect, e, true);
                                        } },
                                    React.createElement(
                                        "option",
                                        { value: -1 },
                                        "----"
                                    ),
                                    possibleTargets.filter(function (filterVal) {
                                        return !(input.vals.includes(filterVal) && filterVal !== currTarget);
                                    }).map(function (optionVal, optionIndex) {
                                        return React.createElement(
                                            "option",
                                            { value: optionVal },
                                            decodeTargetVal(optionVal)
                                        );
                                    })
                                );
                            }),
                            React.createElement(
                                "select",
                                { value: -1, name: "directional_target_" + input.vals.length, onChange: function onChange(e) {
                                        return changeFunc(input.vals.length, e, true);
                                    } },
                                React.createElement(
                                    "option",
                                    { value: -1 },
                                    "----"
                                ),
                                possibleTargets.filter(function (value1) {
                                    return !(input.vals.includes(value1) && value1 !== -1);
                                }).map(function (value1, index1) {
                                    return React.createElement(
                                        "option",
                                        { value: value1 },
                                        decodeTargetVal(value1)
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "inline_block_parent" },
                            React.createElement(
                                "p",
                                { className: "" + (this.props.className ? this.props.className : "") },
                                "Directions: "
                            ),
                            input.originalAdjacents.map(function (currDirection, currIndexSelect) {
                                return React.createElement(
                                    "select",
                                    { value: currDirection, name: "directional_direction_" + currIndexSelect, onChange: function onChange(e) {
                                            return changeFunc(currIndexSelect, e, false);
                                        } },
                                    React.createElement(
                                        "option",
                                        { value: -1 },
                                        "----"
                                    ),
                                    possibleDirections.filter(function (filterVal) {
                                        return !(input.originalAdjacents.includes(filterVal) && filterVal !== currDirection);
                                    }).map(function (optionVal, optionIndex) {
                                        return React.createElement(
                                            "option",
                                            { value: optionVal },
                                            optionVal
                                        );
                                    })
                                );
                            }),
                            React.createElement(
                                "select",
                                { value: -1, name: "directional_direction_" + input.originalAdjacents.length, onChange: function onChange(e) {
                                        return changeFunc(input.originalAdjacents.length, e, false);
                                    } },
                                React.createElement(
                                    "option",
                                    { value: -1 },
                                    "----"
                                ),
                                possibleDirections.filter(function (filterVal) {
                                    return !(input.originalAdjacents.includes(filterVal) && filterVal !== -1);
                                }).map(function (optionVal, optionIndex) {
                                    return React.createElement(
                                        "option",
                                        { value: optionVal },
                                        optionVal
                                    );
                                })
                            )
                        )
                    );
                }
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
                speed = _props3.speed,
                edit = _props3.edit,
                editFuncs = _props3.editFuncs,
                multipleIndex = _props3.multipleIndex,
                noDelete = _props3.noDelete;

            // multiple inputs returns more inputs
            // if(input.componentID === 0){

            if (input instanceof MultipleInput) {
                return React.createElement(
                    Fragment,
                    null,
                    input.myInputs.map(function (item, index) {
                        return React.createElement(InputDetails, { multipleIndex: index, input: item, speed: speed, className: _this4.props.className, edit: edit, editFuncs: editFuncs });
                    })
                );
            }

            // single input
            // extra details
            var extraDetails = null;
            // if(input.componentID === 2){
            if (input instanceof DirectionalInput) {
                extraDetails = React.createElement(InputDetailsDirectional, { className: "category_text" + (this.props.className ? " " + this.props.className : ""), input: input, edit: edit, editFuncs: editFuncs, multipleIndex: multipleIndex });
            }
            // input info
            var canGoUp = false,
                canGoDown = false;

            if (edit) {
                var master = editFuncs.get();
                if (master instanceof MultipleInput) {
                    canGoUp = multipleIndex > 0;
                    canGoDown = multipleIndex < master.myInputs.size - 1;
                }
            }
            return React.createElement(
                "div",
                { className: "component_block" },
                React.createElement(
                    "div",
                    { className: "wrapper_div inline_block_parent inline_buttons" },
                    React.createElement(
                        "p",
                        { className: "category_text_title small" + (this.props.className ? " " + this.props.className : "") },
                        input.getComponentName()
                    ),
                    edit ? React.createElement(
                        Fragment,
                        null,
                        noDelete ? React.createElement(
                            Button,
                            { className: "faded" + (this.props.className ? " " + this.props.className : ""), onClick: function onClick() {
                                    return null;
                                } },
                            React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/delete-button-580x580.png" })
                        ) : React.createElement(
                            Button,
                            { className: this.props.className, onClick: function onClick() {
                                    return editFuncs.delete(multipleIndex);
                                } },
                            React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/delete-button-580x580.png" })
                        ),
                        React.createElement(
                            Button,
                            { className: this.props.className, onClick: function onClick() {
                                    return editFuncs.add(input.cloneMe());
                                } },
                            React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/+-button-640x640.png" })
                        ),
                        canGoUp ? React.createElement(
                            Button,
                            { className: this.props.className, onClick: function onClick() {
                                    return editFuncs.shift(multipleIndex, true);
                                } },
                            React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/up-arrow-800x800.png" })
                        ) : React.createElement(
                            Button,
                            { className: "faded" + (this.props.className ? " " + this.props.className : ""), onClick: function onClick() {
                                    return null;
                                } },
                            React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/up-arrow-800x800.png" })
                        ),
                        canGoDown ? React.createElement(
                            Button,
                            { className: this.props.className, onClick: function onClick() {
                                    return editFuncs.shift(multipleIndex, false);
                                } },
                            React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/down-arrow-800x800.png" })
                        ) : React.createElement(
                            Button,
                            { className: "faded" + (this.props.className ? " " + this.props.className : ""), onClick: function onClick() {
                                    return null;
                                } },
                            React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/down-arrow-800x800.png" })
                        )
                    ) : null
                ),
                React.createElement(
                    TypewriterText,
                    { speed: speed },
                    React.createElement(
                        "p",
                        { className: "category_text" + (this.props.className ? " " + this.props.className : "") },
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
            var _this6 = this;

            var rawPath = this.props.brain.myRawPath;

            var _loop = function _loop(_i) {
                if (_this6.index === rawPath.length) {
                    clearInterval(_this6.interval);
                    return {
                        v: void 0
                    };
                }
                // ignore directionals for now
                if (!Array.isArray(rawPath[_this6.index])) {
                    _i--;
                    _this6.index++;
                    return "continue";
                }
                // update/clamp color
                var curr = _this6.stages[_this6.stage];
                _this6.colors = _this6.colors.map(function (value, index) {
                    return Math.max(0, Math.min(255, value + curr[index] * _this6.colorStep));
                });
                // check if should proceed to next stage
                var _ref = [_this6.colors.filter(function (val) {
                    return val === 0;
                }).length, _this6.colors.filter(function (val) {
                    return val === 255;
                }).length],
                    num0 = _ref[0],
                    num255 = _ref[1];

                if (num255 === 2 || num0 === 2) {
                    _this6.stage++;
                    if (_this6.stage >= _this6.stages.length) {
                        _this6.stage = 0;
                    }
                }

                // draw square
                var _ref2 = [rawPath[_this6.index][0], rawPath[_this6.index][1]],
                    r = _ref2[0],
                    c = _ref2[1];

                _this6.ctx.fillStyle = "rgba(" + _this6.colors[0] + ", " + _this6.colors[1] + ", " + _this6.colors[2] + ", 1)";
                _this6.ctx.beginPath();
                _this6.ctx.rect(c * _this6.step, r * _this6.step, _this6.step, _this6.step);
                _this6.ctx.fill();
                _this6.ctx.closePath();

                _this6.index++;
                i = _i;
            };

            for (var i = 0; i < 20; i++) {
                var _ret = _loop(i);

                switch (_ret) {
                    case "continue":
                        continue;

                    default:
                        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
                }
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
            this.colors = [0, 255, 0];

            this.index = 0;
            this.stage = 0;
            this.stages = [[0, 0, 1], [0, -1, 0], [1, 0, 0], [0, 0, -1], [0, 1, 0], [-1, 0, 0]];
            // how fast the color changes
            this.colorStep = Math.min(86, Math.max(1, Math.round(this.stages.length * 255 / rawPath.length)));

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

        var _this7 = _possibleConstructorReturn(this, (BrainDetailsNet.__proto__ || Object.getPrototypeOf(BrainDetailsNet)).call(this, props));

        _this7.subCanvasRef = React.createRef();

        _this7.draw = _this7.draw.bind(_this7);
        return _this7;
    }

    _createClass(BrainDetailsNet, [{
        key: "render",
        value: function render() {
            var _props6 = this.props,
                brain = _props6.brain,
                speed = _props6.speed,
                gridSize = _props6.gridSize,
                edit = _props6.edit,
                editFuncs = _props6.editFuncs;

            // static display

            if (!edit) {
                return React.createElement(
                    Fragment,
                    null,
                    React.createElement(
                        "div",
                        { className: "indent" },
                        React.createElement(
                            "p",
                            { className: "category_text_title small" },
                            brain.myNormalizer.getComponentName()
                        ),
                        React.createElement(
                            TypewriterText,
                            { speed: speed },
                            React.createElement(
                                "p",
                                { className: "category_text" },
                                brain.myNormalizer.getComponentDescription()
                            )
                        )
                    ),
                    React.createElement(BlankSubCanvas, { width: 2, className: "", refIn: this.subCanvasRef })
                );
            }
            // editable
            else {
                    return React.createElement(
                        Fragment,
                        null,
                        React.createElement(
                            "div",
                            { className: "indent" },
                            React.createElement(
                                "p",
                                { className: "category_text_title small" },
                                "Parameters (will reset weights/biases)"
                            ),
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "label",
                                    { htmlFor: "net_depth" },
                                    "Network Depth (# of layers):"
                                ),
                                React.createElement(NumberForm, { name: "net_depth", initVal: brain.myDepth, min: 1, max: 16, onChange: function onChange(val) {
                                        var newBrain = new NeuralNetBrain(brain.myNormalizer, val, brain.myWidth, brain.startWeight, brain.startBias);
                                        editFuncs.change(newBrain);
                                    } })
                            ),
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "label",
                                    { htmlFor: "net_width" },
                                    "Network Width (# nodes/layer):"
                                ),
                                React.createElement(NumberForm, { name: "net_width", initVal: brain.myWidth, min: 2, max: 36, onChange: function onChange(val) {
                                        var newBrain = new NeuralNetBrain(brain.myNormalizer, brain.myDepth, val, brain.startWeight, brain.startBias);
                                        editFuncs.change(newBrain);
                                    } })
                            ),
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "label",
                                    { htmlFor: "net_start_weight" },
                                    "Start Weight:"
                                ),
                                React.createElement(NumberForm, { name: "net_start_weight", initVal: brain.startWeight, min: 0, max: 1, step: 0.01, onChange: function onChange(val) {
                                        var newBrain = new NeuralNetBrain(brain.myNormalizer, brain.myDepth, brain.myWidth, val, brain.startBias);
                                        editFuncs.change(newBrain);
                                    } })
                            ),
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "label",
                                    { htmlFor: "net_start_bias" },
                                    "Start Bias:"
                                ),
                                React.createElement(NumberForm, { name: "net_start_bias", initVal: brain.startBias, min: 0, max: 1, step: 0.01, onChange: function onChange(val) {
                                        var newBrain = new NeuralNetBrain(brain.myNormalizer, brain.myDepth, brain.myWidth, brain.startWeight, val);
                                        editFuncs.change(newBrain);
                                    } })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "indent" },
                            React.createElement(
                                "div",
                                { className: "wrapper_div inline_block_parent" },
                                React.createElement(
                                    "label",
                                    { htmlFor: "normalizer_type", className: "category_text_title small" },
                                    "Normalizer"
                                ),
                                React.createElement(
                                    Select,
                                    { initVal: brain.myNormalizer.componentID, name: "normalizer_type", onSelect: function onSelect(val) {
                                            val = parseInt(val);
                                            brain.myNormalizer = blankNormalizers[val].cloneMe();
                                            editFuncs.update();
                                        } },
                                    blankNormalizers.map(function (value, index) {
                                        return React.createElement(
                                            "option",
                                            { value: index },
                                            value.getComponentName()
                                        );
                                    })
                                )
                            ),
                            React.createElement(
                                TypewriterText,
                                { speed: speed },
                                React.createElement(
                                    "p",
                                    { className: "category_text" },
                                    brain.myNormalizer.getComponentDescription()
                                )
                            )
                        ),
                        React.createElement(BlankSubCanvas, { width: 2, className: "", refIn: this.subCanvasRef })
                    );
                }
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

            var widthUsed = Math.floor(ctx.canvas.width / 4);

            // draw inputs
            var centers = [DrawInput(ctx, brain, widthUsed, ctx.canvas.height, 0, 0, "#000000")];

            // draw brain
            centers = centers.concat(DrawBrain(ctx, brain, Math.floor(ctx.canvas.width / 2), ctx.canvas.height, widthUsed, 0, "#000000", biasScale));
            widthUsed += Math.floor(ctx.canvas.width / 2);

            // draw outputs
            centers.push(DrawOutput(ctx, brain, Math.floor(ctx.canvas.width / 4), ctx.canvas.height, widthUsed, 0, "#000000", biasScale));

            // weights
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

                        // values: red/blue


                        if (brain.hasValues) {
                            var opacity = Math.round(Math.min(Math.abs(currVal) / (weightScale / weightLineOpacityMultiplier), 1) * 100) / 100;
                            opacity = Math.max(opacity, weightLineMinOpacity);
                            if (currVal > 0) {
                                ctx.strokeStyle = "rgba(0, 0, 255, " + opacity + ")";
                            } else {
                                ctx.strokeStyle = "rgba(255, 0, 0, " + opacity + ")";
                            }
                        }
                        // no values, gray lines
                        else {
                                ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
                            }

                        // draw
                        ctx.beginPath();
                        ctx.moveTo(srcX, srcY);
                        ctx.lineTo(targetX, targetY);
                        ctx.stroke();
                        ctx.closePath();
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
                gridSize = _props8.gridSize,
                edit = _props8.edit,
                editFuncs = _props8.editFuncs;

            // extra details

            var extraDetails = null;
            if (brain instanceof PathBrain) {
                extraDetails = React.createElement(BrainDetailsPath, { gridSize: gridSize, className: "category_text", brain: brain, speed: speed });
            } else if (brain instanceof NeuralNetBrain) {
                extraDetails = React.createElement(
                    Fragment,
                    null,
                    React.createElement(BrainDetailsNet, { gridSize: gridSize, className: "category_text", brain: brain, speed: speed, edit: edit, editFuncs: editFuncs })
                );
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


            var speed = typeWriteSpeed;

            var _map = [snake.startHeadPos / (snake.gridSize + 2), snake.startHeadPos % (snake.gridSize + 2) - 1].map(function (value, index) {
                return Math.floor(value);
            }),
                _map2 = _slicedToArray(_map, 2),
                currR = _map2[0],
                currC = _map2[1];

            return React.createElement(
                "div",
                { className: "details snake_details" + (this.props.className ? " " + this.props.className : "") },
                React.createElement(
                    "h1",
                    null,
                    snake.getComponentName()
                ),
                React.createElement(
                    CollapsibleDiv,
                    { startOpen: collapsePrefSnek[0], changePref: function changePref(val) {
                            return collapsePrefSnek[0] = val;
                        } },
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
                    )
                ),
                React.createElement(
                    CollapsibleDiv,
                    { startOpen: collapsePrefSnek[1], changePref: function changePref(val) {
                            return collapsePrefSnek[1] = val;
                        } },
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
                            "Starting Head Position (Row/Column): [",
                            currR,
                            ", ",
                            currC,
                            "]",
                            "\n",
                            "Starting Length: ",
                            snake.startLength,
                            "\n",
                            "Apple Value: ",
                            snake.appleVal,
                            "\n",
                            "Grid Size: ",
                            snake.gridSize,
                            "\n"
                        )
                    )
                ),
                React.createElement(
                    CollapsibleDiv,
                    { startOpen: collapsePrefSnek[2], changePref: function changePref(val) {
                            return collapsePrefSnek[2] = val;
                        } },
                    React.createElement(
                        "p",
                        { className: "category_text_title" },
                        "Input"
                    ),
                    React.createElement(InputDetails, { input: snake.myInput, speed: speed })
                ),
                React.createElement(
                    CollapsibleDiv,
                    { startOpen: collapsePrefSnek[3], changePref: function changePref(val) {
                            return collapsePrefSnek[3] = val;
                        } },
                    React.createElement(
                        "p",
                        { className: "category_text_title" },
                        "Brain"
                    ),
                    React.createElement(BrainDetails, { brain: snake.myBrain, gridSize: snake.gridSize, speed: speed })
                )
            );
        }
    }]);

    return SnakeDetails;
}(React.Component);

// editable snake details || props: snake = snake to display/edit | tellChange: a function which should b called on snake change


var SnakeDetailsEdit = function (_React$Component8) {
    _inherits(SnakeDetailsEdit, _React$Component8);

    function SnakeDetailsEdit() {
        _classCallCheck(this, SnakeDetailsEdit);

        return _possibleConstructorReturn(this, (SnakeDetailsEdit.__proto__ || Object.getPrototypeOf(SnakeDetailsEdit)).apply(this, arguments));
    }

    _createClass(SnakeDetailsEdit, [{
        key: "render",
        value: function render() {
            var _this11 = this;

            var _props9 = this.props,
                snake = _props9.snake,
                tellChange = _props9.tellChange,
                tellDeepChange = _props9.tellDeepChange;


            var speed = typeWriteSpeed;

            var _map3 = [snake.startHeadPos / (snake.gridSize + 2), snake.startHeadPos % (snake.gridSize + 2) - 1].map(function (value, index) {
                return Math.floor(value);
            }),
                _map4 = _slicedToArray(_map3, 2),
                currR = _map4[0],
                currC = _map4[1];

            // inputs


            if (!this.inputs) {
                this.inputs = blankInputs.map(function (value, index) {
                    return value.cloneMe();
                });
                // start at 1 cuz multiple input is 0
                this.inputActive = 0;
            }
            var editFuncsInput = {
                get: function get() {
                    return snake.myInput;
                },
                change: function change(inputNew) {
                    snake.changeInput(inputNew);

                    if (tellDeepChange) {
                        tellDeepChange();
                    }
                    _this11.forceUpdate();
                },
                add: function add(inputNew) {
                    // no inputs
                    if (!snake.myInput) {
                        snake.changeInput(inputNew);
                    }
                    // multiple inputs
                    else if (snake.myInput instanceof MultipleInput) {
                            snake.myInput.addInput(inputNew);
                            snake.changeInput(snake.myInput);
                        }
                        // one input b4 add
                        else {
                                var newVal = new MultipleInput(snake.myInput, inputNew);
                                snake.changeInput(newVal);
                            }

                    if (tellDeepChange) {
                        tellDeepChange();
                    }
                    _this11.forceUpdate();
                },
                delete: function _delete(index) {
                    // delete last input (total now at 0)
                    if (!(snake.myInput instanceof MultipleInput)) {
                        snake.changeInput(null);
                    }
                    // deleting from multiple
                    else {
                            // extract previous inputs from queue
                            var inputs = snake.myInput.myInputs.map(function (val, i) {
                                return val;
                            });

                            // delete 2nd input (total now at 1)
                            if (snake.myInput.myInputs.length === 2) {
                                var indexToKeep = index === 0 ? 1 : 0;
                                snake.changeInput(inputs[indexToKeep].cloneMe());
                            }
                            // delete a random input from MultipleInput
                            else {
                                    var ans = new MultipleInput();
                                    inputs.map(function (val, i) {
                                        if (i !== index) {
                                            ans.addInput(val);
                                        }
                                    });
                                    snake.changeInput(ans);
                                }
                        }

                    if (tellDeepChange) {
                        tellDeepChange();
                    }
                    _this11.forceUpdate();
                },
                shift: function shift(origin, goUp) {
                    // assume validation is done already
                    var oldInputs = snake.myInput.myInputs.map(function (val, i) {
                        return val;
                    });
                    var newMultiple = new MultipleInput();
                    oldInputs.map(function (value, index) {
                        // shift up (decrease index)
                        if (goUp) {
                            if (index === origin - 1) {
                                newMultiple.addInput(oldInputs[origin]);
                                return;
                            }
                            if (index === origin) {
                                newMultiple.addInput(oldInputs[origin - 1]);
                                return;
                            }
                            newMultiple.addInput(value);
                        }
                        // shift down (increase index)
                        else {
                                if (index === origin) {
                                    newMultiple.addInput(oldInputs[origin + 1]);
                                    return;
                                }
                                if (index === origin + 1) {
                                    newMultiple.addInput(oldInputs[origin]);
                                    return;
                                }
                                newMultiple.addInput(value);
                            }
                    });
                    snake.changeInput(newMultiple);

                    if (tellDeepChange) {
                        tellDeepChange();
                    }
                    _this11.forceUpdate();
                },
                update: function update() {
                    if (snake.myInput instanceof MultipleInput) {
                        var ans = new MultipleInput();
                        snake.myInput.myInputs.map(function (val, i) {
                            return ans.addInput(val);
                        });
                        snake.changeInput(ans);
                    } else {
                        snake.changeInput(snake.myInput);
                    }

                    if (tellDeepChange) {
                        tellDeepChange();
                    }
                    _this11.forceUpdate();
                }
            };

            // brains
            // keep a log of brains so you can toggle between multiple while preserving info
            if (!this.brains) {
                this.brains = Array(blankBrains.length).fill(null);
            }
            if (tellDeepChange && this.origBrainID === undefined) {
                this.origBrainID = snake.myBrain.componentID;
                this.brainChanges = 0;
            }
            this.brains[snake.myBrain.componentID] = snake.myBrain;
            var editFuncsBrain = {
                change: function change(val) {
                    snake.changeBrain(val);
                    _this11.forceUpdate();
                },
                update: function update() {
                    _this11.forceUpdate();
                }
            };

            return React.createElement(
                "div",
                { className: "details snake_details" + (this.props.className ? " " + this.props.className : "") },
                React.createElement(
                    TextArea,
                    { onChange: function onChange(val) {
                            snake.setName(val);
                            _this11.forceUpdate();
                        } },
                    React.createElement(
                        "h1",
                        null,
                        snake.getComponentName()
                    )
                ),
                React.createElement(
                    CollapsibleDiv,
                    { startOpen: collapsePrefSnek[0], changePref: function changePref(val) {
                            return collapsePrefSnek[0] = val;
                        } },
                    React.createElement(
                        "p",
                        { className: "category_text_title" },
                        "Description"
                    ),
                    React.createElement(
                        TextArea,
                        { onChange: function onChange(val) {
                                snake.componentDescription = val;
                                _this11.forceUpdate();
                            } },
                        React.createElement(
                            "p",
                            { className: "category_text" },
                            snake.getComponentDescription()
                        )
                    )
                ),
                React.createElement(
                    CollapsibleDiv,
                    { startOpen: collapsePrefSnek[1], changePref: function changePref(val) {
                            return collapsePrefSnek[1] = val;
                        } },
                    React.createElement(
                        "p",
                        { className: "category_text_title" },
                        "Parameters"
                    ),
                    React.createElement(
                        "div",
                        { className: "category_text" },
                        React.createElement(
                            "div",
                            { className: "start_head_pos" },
                            React.createElement(
                                "p",
                                { className: "category_text" },
                                "Starting Head Position:"
                            ),
                            React.createElement(
                                "label",
                                { htmlFor: "head_pos_r" },
                                "Row:"
                            ),
                            React.createElement(NumberForm, { name: "head_pos_r", initVal: currR, min: 0, max: snake.gridSize - 1, onChange: function onChange(val) {
                                    snake.startHeadPos = val * (snake.gridSize + 2) + 1 + currC;
                                    _this11.forceUpdate();
                                } }),
                            React.createElement(
                                "label",
                                { htmlFor: "head_pos_c" },
                                "Column:"
                            ),
                            React.createElement(NumberForm, { name: "head_pos_c", initVal: currC, min: 0, max: snake.gridSize - 1, onChange: function onChange(val) {
                                    snake.startHeadPos = currR * (snake.gridSize + 2) + 1 + val;
                                    _this11.forceUpdate();
                                } })
                        ),
                        React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "label",
                                { htmlFor: "start_length" },
                                "Starting Length:"
                            ),
                            React.createElement(NumberForm, { name: "start_length", initVal: snake.startLength, min: 1, max: snake.gridSize * snake.gridSize, onChange: function onChange(val) {
                                    snake.startLength = val;
                                    snake.myLength = snake.startLength;
                                    _this11.forceUpdate();
                                } })
                        ),
                        React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "label",
                                { htmlFor: "apple_val" },
                                "Apple Value:"
                            ),
                            React.createElement(NumberForm, { name: "apple_val", initVal: snake.appleVal, min: 1, max: 99999, onChange: function onChange(val) {
                                    snake.appleVal = val;
                                    _this11.forceUpdate();
                                } })
                        ),
                        React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "label",
                                { htmlFor: "grid_size" },
                                "Grid Size:"
                            ),
                            React.createElement(NumberForm, { name: "grid_size", initVal: snake.gridSize, min: 1, max: 250, onChange: function onChange(val) {
                                    snake.gridSize = val;
                                    _this11.forceUpdate();
                                } })
                        )
                    )
                ),
                React.createElement(
                    CollapsibleDiv,
                    { startOpen: collapsePrefSnek[2], changePref: function changePref(val) {
                            return collapsePrefSnek[2] = val;
                        } },
                    React.createElement(
                        "p",
                        { className: "category_text_title" },
                        "Input"
                    ),
                    React.createElement(InputDetails, { input: snake.myInput, speed: speed, edit: true, editFuncs: editFuncsInput }),
                    React.createElement(
                        "div",
                        { className: "edit_add_component" },
                        React.createElement(
                            "label",
                            { className: "category_text_title small", htmlFor: "input_add_type" },
                            "New Input Type"
                        ),
                        React.createElement(
                            Select,
                            { initVal: this.inputs[this.inputActive].componentID, name: "input_add_type", onSelect: function onSelect(val) {
                                    _this11.inputActive = val;
                                    _this11.forceUpdate();
                                } },
                            this.inputs.map(function (value, index) {
                                // not multiple
                                if (index > 0) {
                                    return React.createElement(
                                        "option",
                                        { value: index },
                                        value.getComponentName()
                                    );
                                } else {
                                    return React.createElement(
                                        "option",
                                        { value: index },
                                        "None"
                                    );
                                }
                            })
                        ),
                        React.createElement(InputDetails, { className: "temp_input", input: this.inputs[this.inputActive], speed: speed, edit: true, editFuncs: editFuncsInput, noDelete: true }),
                        this.inputActive > 0 ? React.createElement(
                            "p",
                            { className: "category_text" },
                            "(red input does nothing unless you hit the \"+\" button)"
                        ) : null
                    )
                ),
                React.createElement(
                    CollapsibleDiv,
                    { startOpen: collapsePrefSnek[3], changePref: function changePref(val) {
                            return collapsePrefSnek[3] = val;
                        } },
                    React.createElement(
                        "p",
                        { className: "category_text_title" },
                        "Brain"
                    ),
                    React.createElement(
                        "div",
                        { className: "wrapper_div inline_block_parent" },
                        React.createElement(
                            "label",
                            { htmlFor: "brain_type" },
                            "Brain Type: "
                        ),
                        React.createElement(
                            Select,
                            { initVal: snake.myBrain.componentID, name: "brain_type", onSelect: function onSelect(val) {
                                    // target id
                                    var id = parseInt(val);

                                    // ignore unnecessary switches
                                    if (id !== snake.myBrain.componentID) {
                                        if (tellDeepChange) {
                                            tellDeepChange();
                                            _this11.brainChanges++;
                                        }
                                        // TODO: deepchange on brain parameters

                                        // save old
                                        _this11.brains[snake.myBrain.componentID] = snake.myBrain;

                                        // change to new
                                        // this type exists already
                                        if (_this11.brains[id]) {
                                            if (tellDeepChange && _this11.origBrainID === id) {
                                                tellDeepChange(_this11.brainChanges);
                                                _this11.brainChanges = 0;
                                            }
                                            snake.changeBrain(_this11.brains[id]);
                                        }
                                        // first time this type
                                        else {
                                                snake.changeBrain(blankBrains[id].cloneMe());
                                            }
                                        _this11.forceUpdate();
                                    }
                                } },
                            blankBrains.map(function (value, index) {
                                return React.createElement(
                                    "option",
                                    { value: index },
                                    value.getComponentName()
                                );
                            })
                        )
                    ),
                    React.createElement(BrainDetails, { brain: snake.myBrain, gridSize: snake.gridSize, speed: speed, edit: true, editFuncs: editFuncsBrain })
                )
            );
        }
    }, {
        key: "forceUpdate",
        value: function forceUpdate(callback) {
            var _props10 = this.props,
                snake = _props10.snake,
                tellChange = _props10.tellChange;


            if (tellChange) {
                tellChange();
            }

            _get(SnakeDetailsEdit.prototype.__proto__ || Object.getPrototypeOf(SnakeDetailsEdit.prototype), "forceUpdate", this).call(this, callback);
        }
    }]);

    return SnakeDetailsEdit;
}(React.Component);