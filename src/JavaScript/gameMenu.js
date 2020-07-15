var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// REACT

var SubCanvas = function (_React$Component) {
    _inherits(SubCanvas, _React$Component);

    function SubCanvas() {
        _classCallCheck(this, SubCanvas);

        return _possibleConstructorReturn(this, (SubCanvas.__proto__ || Object.getPrototypeOf(SubCanvas)).apply(this, arguments));
    }

    _createClass(SubCanvas, [{
        key: "render",
        value: function render() {
            return React.createElement("canvas", { width: subCanvasInnerSize, height: subCanvasInnerSize, ref: this.props.refIn, className: "subGameCanvas background" });
        }
    }]);

    return SubCanvas;
}(React.Component);

var GameMenu = function (_React$Component2) {
    _inherits(GameMenu, _React$Component2);

    function GameMenu(props) {
        _classCallCheck(this, GameMenu);

        var _this2 = _possibleConstructorReturn(this, (GameMenu.__proto__ || Object.getPrototypeOf(GameMenu)).call(this, props));

        _this2.state = {
            score: 0,
            tickRate: 20,
            paused: false,
            playing: "???",
            selectedSnake: 0
        };

        // bind functions
        _this2.startSnakeButton = _this2.startSnakeButton.bind(_this2);
        _this2.loadSnakeButton = _this2.loadSnakeButton.bind(_this2);
        _this2.changeTickRate = _this2.changeTickRate.bind(_this2);
        _this2.pauseButton = _this2.pauseButton.bind(_this2);
        _this2.unpauseButton = _this2.unpauseButton.bind(_this2);
        _this2.keyEventInDown = _this2.keyEventInDown.bind(_this2);
        _this2.keyEventInUp = _this2.keyEventInUp.bind(_this2);
        _this2.startDraw = _this2.startDraw.bind(_this2);
        _this2.draw = _this2.draw.bind(_this2);
        _this2.callbackEndCurrent = _this2.callbackEndCurrent.bind(_this2);
        _this2.startSelectedSnake = _this2.startSelectedSnake.bind(_this2);
        _this2.startRunner = _this2.startRunner.bind(_this2);

        // needed refs
        _this2.pausePlayButtonRef = React.createRef();
        _this2.subCanvasRef = React.createRef();

        // evolution
        // shell
        _this2.evolutionShell = new EvolutionShell(); // TODO: it takes MainMenu as input atm for some reason

        // runner variables
        // the instance of singleSnakeRunner which is running
        _this2.runningInstance = null;
        _this2.runningInstanceOld = null;
        // tick rate bounds (actual tickRate is in state)
        _this2.tickRateLowerBound = 1;
        _this2.tickRateUpperBound = 99999;
        // fps
        _this2.then = 0;
        _this2.now = 0;
        _this2.fps = defaultFPS;

        // TODO: popups


        // keyEvents: note that it is using keyDown instead of keyPress because keyPress doesn't register arrowKeys, shift, etc
        document.addEventListener("keydown", _this2.keyEventInDown, false);
        // set of keys down to prevent double presses for holding down, stores the keyEvent.key's
        _this2.keysDown = new Set();
        document.addEventListener("keyup", _this2.keyEventInUp, false);
        return _this2;
    }

    _createClass(GameMenu, [{
        key: "render",
        value: function render() {
            var _this3 = this;

            return React.createElement(
                SquareFill,
                { parentRef: this.props.parentRef },
                React.createElement(SubCanvas, { refIn: this.subCanvasRef }),
                React.createElement(
                    "div",
                    { className: "ui_layer" },
                    React.createElement(
                        "div",
                        { className: "inline_block_parent wrapper_div" },
                        React.createElement(
                            FadeMenu,
                            null,
                            React.createElement(
                                TypewriterText,
                                null,
                                React.createElement(
                                    "h3",
                                    null,
                                    "Selected: ",
                                    loadedSnakes[this.state.selectedSnake].getComponentName()
                                )
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: this.startSnakeButton },
                                "Play"
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: this.loadSnakeButton },
                                "Load"
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: this.startSnakeButton },
                                "Dunno"
                            )
                        ),
                        React.createElement(
                            TypewriterText,
                            { className: "playing_text" },
                            React.createElement(
                                "h2",
                                null,
                                "Playing: ",
                                this.state.playing
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "score_text" },
                            React.createElement(
                                "h2",
                                null,
                                "Score: " + ("\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0" + this.state.score).slice(-8)
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "bottom_ui" },
                        React.createElement(
                            FadeDiv,
                            { shouldReset: true },
                            React.createElement(
                                "h3",
                                null,
                                "Tick Rate: ",
                                JSON.stringify(this.state.tickRate)
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "inline_block_parent" },
                            React.createElement(
                                HoldButton,
                                { speed: 1, growth: 2, maxRate: this.tickRateUpperBound - this.tickRateLowerBound, onClick: function onClick(multi) {
                                        _this3.changeTickRate(-1 * multi);
                                    } },
                                React.createElement(ImgIcon, { className: "wrapper_div", small: 2, src: "src/Images/rewind-button-360x360.png" })
                            ),
                            React.createElement(
                                ToggleButton,
                                { ref: this.pausePlayButtonRef },
                                React.createElement(
                                    Button,
                                    { onClick: this.pauseButton },
                                    React.createElement(ImgIcon, { className: "wrapper_div", small: 2, src: "src/Images/pause-button-200x200.png" })
                                ),
                                React.createElement(
                                    Button,
                                    { onClick: this.unpauseButton },
                                    React.createElement(ImgIcon, { className: "wrapper_div", small: 2, src: "src/Images/play-button-200x200.png" })
                                )
                            ),
                            React.createElement(
                                HoldButton,
                                { speed: 1, growth: 2, maxRate: this.tickRateUpperBound - this.tickRateLowerBound, onClick: function onClick(multi) {
                                        _this3.changeTickRate(1 * multi);
                                    } },
                                React.createElement(ImgIcon, { className: "wrapper_div", small: 2, src: "src/Images/fast-forward-button-360x360.png" })
                            )
                        )
                    )
                )
            );
        }

        // button functions

    }, {
        key: "startSnakeButton",
        value: function startSnakeButton() {
            console.log("start snake button");
            this.startSelectedSnake();
        }
    }, {
        key: "loadSnakeButton",
        value: function loadSnakeButton() {
            console.log("TODO: loadSnakeButton()");
        }
    }, {
        key: "changeTickRate",
        value: function changeTickRate(val) {
            var _this4 = this;

            this.setState(function (state) {
                return { tickRate: Math.max(_this4.tickRateLowerBound, Math.min(_this4.tickRateUpperBound, state.tickRate + val)) };
            }, function () {
                if (_this4.runningInstance) {
                    _this4.runningInstance.changeTickRate(_this4.state.tickRate);
                }
            });
        }
    }, {
        key: "pauseButton",
        value: function pauseButton() {
            if (this.runningInstance) {
                this.runningInstance.pause();
            }
            this.setState(function (state) {
                return { paused: true };
            });
        }
    }, {
        key: "unpauseButton",
        value: function unpauseButton() {
            if (this.runningInstance) {
                this.runningInstance.unpause();
            }
            this.setState(function (state) {
                return { paused: false };
            });
        }

        // called on keyEvent press

    }, {
        key: "keyEventInDown",
        value: function keyEventInDown(keyEvent) {
            if (!this.keysDown.has(keyEvent.key)) {
                if (this.runningInstance) {
                    this.runningInstance.keyEventIn(keyEvent);
                } else {
                    console.log("Main menu keyEvent when not running: " + keyEvent + ", key: " + keyEvent.key);
                }

                // pause/unpause on space
                if (keyEvent.key == " " || keyEvent.key == "p" || keyEvent.key == "P") {
                    if (this.runningInstance) {
                        this.pausePlayButtonRef.current.clicked();
                    } else {
                        this.startSnakeButton();
                    }
                }
                this.keysDown.add(keyEvent.key);
            }
        }
    }, {
        key: "keyEventInUp",
        value: function keyEventInUp(keyEvent) {
            if (this.keysDown.has(keyEvent.key)) {
                this.keysDown.delete(keyEvent.key);
            }
        }

        // drawing
        // begins the draw loop

    }, {
        key: "startDraw",
        value: function startDraw() {
            this.then = Date.now();
            this.draw();
        }
        // draw loop

    }, {
        key: "draw",
        value: function draw() {
            var _this5 = this;

            if (this.runningInstance) {
                var fpsInterval = 1000 / this.fps;

                // request another frame
                requestAnimationFrame(function () {
                    _this5.draw();
                });

                // calc time elapsed
                this.now = Date.now();
                var elapsed = this.now - this.then;

                // draw next frame when needed
                if (elapsed > fpsInterval) {
                    // Get ready for next frame by setting then=now, but also adjust for your
                    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
                    this.then = this.now - elapsed % fpsInterval;

                    this.runningInstance.draw(this.subCanvasCTX);
                    this.setState(function (state) {
                        return { score: _this5.runningInstance.mySnake.myLength };
                    });
                }
            }
        }

        // runner interaction methods

    }, {
        key: "callbackEndCurrent",
        value: function callbackEndCurrent() {
            var _this6 = this;

            // last draw call + score update
            this.runningInstance.draw(this.subCanvasCTX);
            this.setState(function (state) {
                return { score: _this6.runningInstance.mySnake.myLength };
            });
            this.runningInstanceOld = this.runningInstance;
            this.runningInstance = null;

            // setTimeout(function (){                  TODO
            //     this.evolutionShell.runQueue()
            // }.bind(this), 15);
        }
    }, {
        key: "startSelectedSnake",
        value: function startSelectedSnake() {
            var snake = loadedSnakes[this.state.selectedSnake].cloneMe();
            var runner = void 0;
            // special runners for special cases
            if (snake.uuid && snake.uuid === "Mother's Day!!!") {
                runner = new SingleSnakeRunner(snake, this.state.tickRate, this.callbackEndCurrent.bind(this), null, pathAppleSpawn);
            } else {
                runner = new SingleSnakeRunner(snake, this.state.tickRate, this.callbackEndCurrent.bind(this));
            }
            this.startRunner(runner);
        }
    }, {
        key: "startRunner",
        value: function startRunner(runner) {
            var _this7 = this;

            // clear canvas
            if (this.runningInstance) {
                this.runningInstance.kill();
                this.runningInstanceOld = this.runningInstance;

                this.subCanvasRef.current.width = subCanvasInnerSize;
                this.subCanvasRef.current.height = subCanvasInnerSize;
            }
            this.runningInstance = runner;
            // unpause
            if (this.state.paused) {
                this.pausePlayButtonRef.current.clicked();
            }
            // reset display
            this.setState(function (state) {
                return {
                    score: _this7.runningInstance.mySnake.myLength,
                    playing: _this7.runningInstance.mySnake.getComponentName()
                };
            });
            this.runningInstance.focusMe();
            this.startDraw();
            this.runningInstance.startMe();
        }

        // REACT lifecycle

    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            // console.log(this.subCanvasRef.current);
            this.subCanvasCTX = this.subCanvasRef.current.getContext("2d");
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            var _this8 = this;

            document.removeEventListener("keydown", function () {
                return _this8.keyEventInDown;
            }, false);
            document.removeEventListener("keyup", function () {
                return _this8.keyEventInUp;
            }, false);
        }
    }]);

    return GameMenu;
}(React.Component);