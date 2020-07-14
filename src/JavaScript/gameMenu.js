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
            return React.createElement("canvas", { ref: this.props.ref, className: "subGameCanvas background" });
        }
    }]);

    return SubCanvas;
}(React.Component);

var GameMenu = function (_React$Component2) {
    _inherits(GameMenu, _React$Component2);

    function GameMenu(props) {
        _classCallCheck(this, GameMenu);

        var _this2 = _possibleConstructorReturn(this, (GameMenu.__proto__ || Object.getPrototypeOf(GameMenu)).call(this, props));

        _this2.subCanvasRef = React.createRef();

        _this2.state = {
            score: 0,
            tickRate: 20,
            paused: false,
            playing: "???"
        };

        // bind functions
        _this2.startSnakeButton = _this2.startSnakeButton.bind(_this2);
        _this2.keyEventInUp = _this2.keyEventInUp.bind(_this2);
        _this2.keyEventInDown = _this2.keyEventInDown.bind(_this2);
        _this2.pauseButton = _this2.pauseButton.bind(_this2);
        _this2.unpauseButton = _this2.unpauseButton.bind(_this2);

        // evolution
        // shell
        _this2.evolutionShell = new EvolutionShell(); // TODO: it takes MainMenu as input atm for some reason

        // runner variables
        // the instance of singleSnakeRunner which is running
        _this2.runningInstance = null;
        // tick rate bounds (actual tickRate is in state)
        _this2.tickRateLowerBound = 1;
        _this2.tickRateUpperBound = 99999;
        // fps
        _this2.then = 0;
        _this2.now = 0;
        _this2.fps = defaultFPS;

        // TODO: popups


        // keyEvents: note that it is using keyDown instead of keyPress because keyPress doesn't register arrowKeys, shift, etc
        document.addEventListener("keydown", function () {
            return _this2.keyEventInDown;
        }, false);
        // set of keys down to prevent double presses for holding down, stores the keyEvent.key's
        _this2.keysDown = new Set();
        document.addEventListener("keyup", function () {
            return _this2.keyEventInUp;
        }, false);
        return _this2;
    }

    _createClass(GameMenu, [{
        key: "render",
        value: function render() {
            return React.createElement(
                SquareFill,
                { parentRef: this.props.parentRef },
                React.createElement(SubCanvas, { ref: this.subCanvasRef }),
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
                                Button,
                                { className: "gameButton", onClick: this.startSnakeButton },
                                "Play"
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: this.startSnakeButton },
                                "Load"
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: this.startSnakeButton },
                                "Play"
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
                            { className: "score_text", reverse: true },
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
                                this.state.tickRate
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "inline_block_parent" },
                            React.createElement(
                                ToggleButton,
                                null,
                                React.createElement(
                                    Button,
                                    { onClick: this.pauseButton },
                                    React.createElement(ImgIcon, { small: 2, src: "src/Images/pause-button-200x200.png" })
                                ),
                                React.createElement(
                                    Button,
                                    { onClick: this.unpauseButton },
                                    React.createElement(ImgIcon, { small: 2, src: "src/Images/play-button-200x200.png" })
                                )
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: "startSnakeButton",
        value: function startSnakeButton() {
            console.log("start snake button");
            // TODO
        }
    }, {
        key: "pauseButton",
        value: function pauseButton() {
            // console.log("pause button");
            // console.log(this.state);
            this.setState(function (state) {
                return { paused: true };
            });
        }
    }, {
        key: "unpauseButton",
        value: function unpauseButton() {
            // console.log("unpause button");
            // console.log(this.state);
            this.setState(function (state) {
                return { paused: false };
            });
        }

        // called on keyEvent press

    }, {
        key: "keyEventInDown",
        value: function keyEventInDown(keyEvent) {
            if (!this.keysDown.has(keyEvent.key)) {
                if (this.isRunning) {
                    this.runningInstance.keyEventIn(keyEvent);
                } else {}
                // alert("Main menu keyEvent when not running: " + keyEvent + ", key: " + keyEvent.key);


                // pause/unpause on space
                if (keyEvent.key == " " || keyEvent.key == "p" || keyEvent.key == "P") {
                    // TODO
                }
                this.keysDown.add(keyEvent.key);
            }
        }
    }, {
        key: "keyEventInUp",
        value: function keyEventInUp(keyEvent) {
            if (this.keysDown.has(keyEvent.key)) {
                this.keysDown.delete(keyEvent.key);
                // alert(keyEvent.key + ": up");
            }
        }
    }]);

    return GameMenu;
}(React.Component);