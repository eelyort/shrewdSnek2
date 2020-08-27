var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var LoadScreen = function (_React$Component2) {
    _inherits(LoadScreen, _React$Component2);

    function LoadScreen() {
        _classCallCheck(this, LoadScreen);

        return _possibleConstructorReturn(this, (LoadScreen.__proto__ || Object.getPrototypeOf(LoadScreen)).apply(this, arguments));
    }

    _createClass(LoadScreen, [{
        key: "render",
        value: function render() {
            var evolution = this.props.evolution;


            var precision = Math.pow(10, scoreDisplayPrecision);

            var finished = evolution.runningProgress / evolution.parameters[0];
            var styleBar = {
                width: Math.floor(finished * 100) + "%"
            };

            var lastStats = evolution.statistics && evolution.statistics.length >= 1 ? evolution.statistics[evolution.statistics.length - 1] : [0, 0, 0];

            var lastLastStats = evolution.statistics && evolution.statistics.length >= 2 ? evolution.statistics[evolution.statistics.length - 2] : lastStats;
            var deltaStats = lastStats.map(function (value, index) {
                return value - lastLastStats[index];
            });

            lastStats = lastStats.map(function (value, index) {
                return Math.round(value * precision) / precision;
            });
            deltaStats = deltaStats.map(function (value, index) {
                return Math.round(value * precision) / precision;
            });

            var _lastStats = lastStats,
                _lastStats2 = _slicedToArray(_lastStats, 3),
                best = _lastStats2[0],
                mean = _lastStats2[1],
                median = _lastStats2[2];

            var _deltaStats = deltaStats,
                _deltaStats2 = _slicedToArray(_deltaStats, 3),
                dBest = _deltaStats2[0],
                dMean = _deltaStats2[1],
                dMedian = _deltaStats2[2];

            return React.createElement(
                "div",
                { className: "popUp-card small loading_screen background" },
                React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "background text_card" },
                        React.createElement(
                            "h3",
                            null,
                            "Currently Running: Generation ",
                            evolution.generationNumber
                        ),
                        React.createElement(
                            "h4",
                            null,
                            "Progress:"
                        ),
                        React.createElement(
                            "div",
                            { className: "progress_container" },
                            React.createElement("div", { style: styleBar, className: "fill" })
                        ),
                        evolution.statistics && evolution.statistics.length >= 1 ? React.createElement(
                            Fragment,
                            null,
                            React.createElement(
                                "h3",
                                null,
                                "\n",
                                "Last Generation:"
                            ),
                            React.createElement(
                                "p",
                                null,
                                React.createElement(
                                    "span",
                                    { className: "title" },
                                    "Best Score:"
                                ),
                                best ? best : "???",
                                React.createElement(
                                    "span",
                                    { className: "delta_stats" },
                                    "(",
                                    dBest > 0 ? "+" + dBest : "" + dBest,
                                    ")"
                                )
                            ),
                            React.createElement(
                                "p",
                                null,
                                React.createElement(
                                    "span",
                                    { className: "title" },
                                    "Mean:"
                                ),
                                mean ? mean : "???",
                                React.createElement(
                                    "span",
                                    { className: "delta_stats" },
                                    "(",
                                    dMean > 0 ? "+" + dMean : "" + dMean,
                                    ")"
                                )
                            ),
                            React.createElement(
                                "p",
                                null,
                                React.createElement(
                                    "span",
                                    { className: "title" },
                                    "Median:"
                                ),
                                median ? median : "???",
                                React.createElement(
                                    "span",
                                    { className: "delta_stats" },
                                    "(",
                                    dMedian > 0 ? "+" + dMedian : "" + dMedian,
                                    ")"
                                )
                            )
                        ) : React.createElement(
                            "h3",
                            null,
                            "No Past Generation To Show"
                        )
                    )
                )
            );
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this3 = this;

            this.interval = setInterval(function () {
                return _this3.forceUpdate();
            }, 100);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            clearInterval(this.interval);
        }
    }]);

    return LoadScreen;
}(React.Component);

var GameMenu = function (_React$Component3) {
    _inherits(GameMenu, _React$Component3);

    function GameMenu(props) {
        _classCallCheck(this, GameMenu);

        var _this4 = _possibleConstructorReturn(this, (GameMenu.__proto__ || Object.getPrototypeOf(GameMenu)).call(this, props));

        _this4.state = {
            score: 0,
            tickRate: defaultTickRate,
            paused: false,
            playing: "???",
            selectedSnake: 0,
            selectedSnakeGen: 0,
            popupActive: 0,
            popupMetaInfo: null,
            infiniteEvolve: false,
            evolutionLoading: false
        };

        // bind functions
        _this4.startSnakeButton = _this4.startSnakeButton.bind(_this4);
        _this4.changeTickRate = _this4.changeTickRate.bind(_this4);
        _this4.pauseButton = _this4.pauseButton.bind(_this4);
        _this4.unpauseButton = _this4.unpauseButton.bind(_this4);

        _this4.openPopUp = _this4.openPopUp.bind(_this4);
        _this4.closePopUp = _this4.closePopUp.bind(_this4);
        _this4.changeLoadedSnakes = _this4.changeLoadedSnakes.bind(_this4);
        _this4.spliceLoadedSnakes = _this4.spliceLoadedSnakes.bind(_this4);
        _this4.changeEvolution = _this4.changeEvolution.bind(_this4);

        _this4.keyEventInDown = _this4.keyEventInDown.bind(_this4);
        _this4.keyEventInUp = _this4.keyEventInUp.bind(_this4);

        _this4.startDraw = _this4.startDraw.bind(_this4);
        _this4.draw = _this4.draw.bind(_this4);

        _this4.callbackEndCurrent = _this4.callbackEndCurrent.bind(_this4);
        _this4.getSelectedSnake = _this4.getSelectedSnake.bind(_this4);
        _this4.showcaseRandomEvolutionSnake = _this4.showcaseRandomEvolutionSnake.bind(_this4);
        _this4.startSnake = _this4.startSnake.bind(_this4);
        _this4.startRunner = _this4.startRunner.bind(_this4);

        _this4.evolutionReady = _this4.evolutionReady.bind(_this4);
        _this4.evolveButton = _this4.evolveButton.bind(_this4);
        _this4.infiniteButton = _this4.infiniteButton.bind(_this4);

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s)), changeEvolution(newEvolution)
        _this4.popUpFuncs = {
            close: _this4.closePopUp,
            changeSelected: function changeSelected(i) {
                return _this4.setState(function () {
                    return { selectedSnake: i };
                });
            },
            changeSelectedGen: function changeSelectedGen(i) {
                return _this4.setState(function () {
                    return { selectedSnakeGen: i };
                });
            },
            changeLoaded: _this4.changeLoadedSnakes,
            spliceLoaded: _this4.spliceLoadedSnakes,
            changeEvolution: _this4.changeEvolution
        };

        // needed refs
        _this4.pausePlayButtonRef = React.createRef();
        _this4.subCanvasRef = React.createRef();

        // evolution
        // shell
        _this4.changeEvolution(defaultEvolution);

        // runner variables
        // the instance of singleSnakeRunner which is running
        _this4.runningInstance = null;
        _this4.runningInstanceOld = null;
        // tick rate bounds (actual tickRate is in state)
        _this4.tickRateLowerBound = 1;
        _this4.tickRateUpperBound = 99999;
        // fps
        _this4.then = 0;
        _this4.now = 0;
        _this4.fps = defaultFPS;
        _this4.drawing = false;

        _this4.showcase = true;

        // keyEvents: note that it is using keyDown instead of keyPress because keyPress doesn't register arrowKeys, shift, etc
        document.addEventListener("keydown", _this4.keyEventInDown, false);
        // set of keys down to prevent double presses for holding down, stores the keyEvent.key's
        _this4.keysDown = new Set();
        document.addEventListener("keyup", _this4.keyEventInUp, false);
        return _this4;
    }

    _createClass(GameMenu, [{
        key: "render",
        value: function render() {
            var _this5 = this;

            // popUps
            var popUp = null;
            if (this.state.popupActive) {
                // 1 = select snake
                if (this.state.popupActive === 1) {
                    popUp = React.createElement(SelectSnakePopUpREACT, { metaInfo: this.state.popupMetaInfo, selectedSnake: this.state.selectedSnake, selectedSnakeGen: this.state.selectedSnakeGen, popUpFuncs: this.popUpFuncs, loadedSnakesIn: loadedSnakes });
                }
                // 2 = create/edit snake
                else if (this.state.popupActive === 2) {
                        popUp = React.createElement(CreateSnakePopUpREACT, { metaInfo: this.state.popupMetaInfo, popUpFuncs: this.popUpFuncs, loadedSnakesIn: loadedSnakes });
                    }
                    // 3 = create/edit generation
                    else if (this.state.popupActive === 3) {
                            popUp = React.createElement(EditEvolutionPopUp, { metaInfo: this.state.popupMetaInfo, popUpFuncs: this.popUpFuncs, evolutionIn: this.evolutionShell.evolution });
                        }
            }

            return React.createElement(
                SquareFill,
                { parentRef: this.props.parentRef },
                this.state.evolutionLoading ? React.createElement(LoadScreen, { evolution: this.evolutionShell.evolution }) : null,
                popUp,
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
                                "h3",
                                null,
                                "Selected: ",
                                loadedSnakes[this.state.selectedSnake].getComponentName()
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: this.startSnakeButton },
                                "Play"
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: function onClick() {
                                        return _this5.openPopUp(1);
                                    } },
                                "Load"
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: function onClick() {
                                        return _this5.openPopUp(2);
                                    } },
                                "New Snake"
                            ),
                            React.createElement(
                                "h3",
                                null,
                                "Generation: ",
                                this.evolutionShell.evolution ? this.evolutionShell.evolution.generationNumber : 0
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: function onClick() {
                                        return _this5.evolveButton();
                                    } },
                                "Evolve"
                            ),
                            React.createElement(
                                Button,
                                { className: "gameButton", onClick: function onClick() {
                                        return _this5.openPopUp(3);
                                    } },
                                "Edit Evolution"
                            ),
                            React.createElement(
                                "div",
                                { className: "inline_block_parent" },
                                React.createElement("input", { type: "checkbox", name: "infinite_evolve", checked: this.state.infiniteEvolve, onChange: this.infiniteButton }),
                                React.createElement(
                                    "label",
                                    { htmlFor: "infinite_evolve" },
                                    "Evolve Infinitely"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "inline_block_parent" },
                                React.createElement("input", { type: "checkbox", name: "infinite_evolve", checked: this.showcase, onChange: function onChange() {
                                        _this5.showcase = !_this5.showcase;
                                        _this5.forceUpdate(function () {
                                            if (_this5.showcase && !_this5.runningInstance) {
                                                _this5.showcaseRandomEvolutionSnake();
                                            }
                                        });
                                    } }),
                                React.createElement(
                                    "label",
                                    { htmlFor: "infinite_evolve" },
                                    "Showcase Mode"
                                )
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
                                MouseFadeDiv,
                                { padding: .3, speed: 3.6 },
                                React.createElement(
                                    HoldButton,
                                    { speed: 1, growth: 2, maxRate: this.tickRateUpperBound - this.tickRateLowerBound, onClick: function onClick(multi) {
                                            _this5.changeTickRate(-1 * multi);
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
                                            _this5.changeTickRate(1 * multi);
                                        } },
                                    React.createElement(ImgIcon, { className: "wrapper_div", small: 2, src: "src/Images/fast-forward-button-360x360.png" })
                                )
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
            this.showcase = false;

            this.startSnake(this.getSelectedSnake());
        }
    }, {
        key: "changeTickRate",
        value: function changeTickRate(val) {
            var _this6 = this;

            this.setState(function (state) {
                return { tickRate: Math.max(_this6.tickRateLowerBound, Math.min(_this6.tickRateUpperBound, state.tickRate + val)) };
            }, function () {
                if (_this6.runningInstance) {
                    _this6.runningInstance.changeTickRate(_this6.state.tickRate);
                }
            });
        }
    }, {
        key: "pauseButton",
        value: function pauseButton() {
            var _this7 = this;

            this.setState(function (state) {
                return { paused: true };
            }, function () {
                if (_this7.runningInstance) {
                    _this7.runningInstance.pause();
                }
            });
        }
    }, {
        key: "unpauseButton",
        value: function unpauseButton() {
            var _this8 = this;

            this.setState(function (state) {
                return { paused: false };
            }, function () {
                _this8.startDraw();
                if (_this8.runningInstance) {
                    _this8.runningInstance.unpause();
                } else {
                    _this8.startSnake(_this8.getSelectedSnake());
                }
            });
        }

        // popup stuff
        // opens a popup

    }, {
        key: "openPopUp",
        value: function openPopUp(i) {
            var info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            this.showcase = false;

            this.setState(function () {
                return {
                    popupActive: i,
                    popupMetaInfo: info
                };
            });
            if (!this.state.paused) {
                this.pausePlayButtonRef.current.clicked();
            }
        }
        // pass as function to popups, optional parameter closes the current popup and immediately opens another

    }, {
        key: "closePopUp",
        value: function closePopUp() {
            var _this9 = this;

            var toOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            this.setState(function () {
                return {
                    popupActive: toOpen,
                    popupMetaInfo: info
                };
            }, function () {
                // unpause the snake if it isn't player controlled
                if (_this9.state.popupActive === 0 && _this9.runningInstance && _this9.state.paused && _this9.runningInstance.mySnake.myBrain.componentID !== 1) {
                    _this9.pausePlayButtonRef.current.clicked();
                }
            });
        }
    }, {
        key: "changeLoadedSnakes",
        value: function changeLoadedSnakes(newVer) {
            loadedSnakes = newVer;
        }
    }, {
        key: "spliceLoadedSnakes",
        value: function spliceLoadedSnakes(start) {
            var deleteCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var items = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            if (items && items instanceof SnakeSpecies) {
                loadedSnakes.splice(start, deleteCount, items);
            } else if (items) {
                loadedSnakes.splice(start, deleteCount, new SnakeSpecies(items));
            } else if (deleteCount) {
                loadedSnakes.splice(start, deleteCount);
            } else {
                loadedSnakes.splice(start);
            }
        }
    }, {
        key: "changeEvolution",
        value: function changeEvolution(newEvolution) {
            this.evolutionShell = new EvolutionShell(this.evolutionReady, this.popUpFuncs);
            this.evolutionShell.createEvolution(newEvolution);
        }

        // called on keyEvent press

    }, {
        key: "keyEventInDown",
        value: function keyEventInDown(keyEvent) {
            if (this.state.popupActive === 0) {
                if (!this.keysDown.has(keyEvent.key)) {
                    if (this.runningInstance) {
                        this.runningInstance.keyEventIn(keyEvent);
                    } else {
                        console.log("Main menu keyEvent when not running: " + keyEvent + ", key: " + keyEvent.key);
                    }

                    // pause/unpause on space
                    if (keyEvent.key === " " || keyEvent.key === "p" || keyEvent.key === "P") {
                        this.pausePlayButtonRef.current.clicked();
                    }
                    this.keysDown.add(keyEvent.key);
                }
            }
        }
    }, {
        key: "keyEventInUp",
        value: function keyEventInUp(keyEvent) {
            if (this.state.popupActive === 0) {
                if (this.keysDown.has(keyEvent.key)) {
                    this.keysDown.delete(keyEvent.key);
                }
            }
        }

        // drawing
        // begins the draw loop

    }, {
        key: "startDraw",
        value: function startDraw() {
            if (!this.drawing) {
                this.drawing = true;
                this.then = Date.now();
                this.draw();
            }
        }
        // draw loop

    }, {
        key: "draw",
        value: function draw() {
            var _this10 = this;

            if (this.runningInstance) {
                // when paused stop draw loop, draw one last time
                if (this.state.paused) {
                    this.runningInstance.draw(this.subCanvasCTX);
                    if (this.runningInstance.mySnake.myLength !== this.state.score) {
                        this.setState(function (state) {
                            return { score: _this10.runningInstance.mySnake.myLength };
                        });
                    }
                    this.drawing = false;
                    return;
                }

                // regular draw
                var fpsInterval = 1000 / this.fps;

                // request another frame
                requestAnimationFrame(function () {
                    _this10.draw();
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
                    if (this.runningInstance.mySnake.myLength !== this.state.score) {
                        this.setState(function (state) {
                            return { score: _this10.runningInstance.mySnake.myLength };
                        });
                    }
                }
            } else {
                this.drawing = false;
            }
        }

        // runner interaction methods

    }, {
        key: "callbackEndCurrent",
        value: function callbackEndCurrent() {
            var _this11 = this;

            // last draw call + score update
            this.runningInstance.draw(this.subCanvasCTX);
            this.setState(function (state) {
                return { score: _this11.runningInstance.mySnake.myLength };
            });
            if (!this.state.paused) {
                this.pausePlayButtonRef.current.clicked();
            }
            this.runningInstanceOld = this.runningInstance;
            this.runningInstance = null;

            if (this.showcase) {
                setTimeout(function () {
                    return _this11.showcaseRandomEvolutionSnake();
                }, 1000);
            } else if (this.evolutionShell && (this.evolutionShell.runningGen || this.evolutionShell.viewQueue.size > 0)) {
                setTimeout(function () {
                    return _this11.evolutionShell.runQueue(_this11.startSnake, _this11.startRunner);
                }, 1000);
            }
        }
    }, {
        key: "getSelectedSnake",
        value: function getSelectedSnake() {
            return loadedSnakes[this.state.selectedSnake].snakes[this.state.selectedSnakeGen].cloneMe();
        }
    }, {
        key: "showcaseRandomEvolutionSnake",
        value: function showcaseRandomEvolutionSnake() {
            var _this12 = this;

            var filtered = loadedSnakes.filter(function (value, index) {
                var snekBrain = value.snakes[value.getLength() - 1].myBrain;

                // only snakes which play by themselves
                if (evolutionBrains.includes(snekBrain.componentID)) {
                    // only previously evolved snakes
                    if (snekBrain.hasValues && (snekBrain.myMat[0][2][0] !== snekBrain.startBias || snekBrain.myMat[0][1][0][0] !== snekBrain.startWeight / Math.sqrt(snekBrain.myMat[0][0].length))) {
                        return true;
                    }
                }
                return false;
            });

            var snek = filtered[Math.floor(Math.random() * filtered.length)].cloneMe();
            var timeOut = function timeOut(length) {
                return snek.gridSize * timeoutInitMultiplier + snek.gridSize * length * timeoutInitMultiplier2;
            };

            this.startRunner(new SingleSnakeRunner(snek, this.state.tickRate === defaultTickRate ? showcaseTickRate * snek.gridSize / showcaseGridSize : this.state.tickRate, function () {
                return _this12.callbackEndCurrent();
            }, timeOut));
        }
    }, {
        key: "startSnake",
        value: function startSnake(snake) {
            var _this13 = this;

            var runner = void 0;
            // special runners for special cases
            if (snake.uuid && snake.uuid === "Mother's Day!!!") {
                runner = new SingleSnakeRunner(snake, this.state.tickRate, this.callbackEndCurrent.bind(this), null, pathAppleSpawn);
            } else if (evolutionBrains.includes(snake.myBrain.componentID)) {
                var timeOut = function timeOut(length) {
                    return snake.gridSize * timeoutInitMultiplier + snake.gridSize * length * timeoutInitMultiplier2;
                };

                runner = new SingleSnakeRunner(snake, this.state.tickRate, this.callbackEndCurrent.bind(this), timeOut);
            } else {
                runner = new SingleSnakeRunner(snake, this.state.tickRate, function () {
                    return _this13.callbackEndCurrent();
                });
            }
            this.startRunner(runner);
        }
    }, {
        key: "startRunner",
        value: function startRunner(runner) {
            var _this14 = this;

            if (runner instanceof EvolutionLoadScreen) {
                this.setState(function (state) {
                    return { evolutionLoading: true };
                });
            }

            // clear canvas
            if (this.runningInstance) {
                if (this.runningInstance instanceof EvolutionLoadScreen) {
                    this.setState(function (state) {
                        return { evolutionLoading: false };
                    });
                }

                this.runningInstance.kill();
                this.runningInstanceOld = this.runningInstance;

                // clear canvas
                if (this.subCanvasCTX) {
                    this.subCanvasCTX.clearRect(0, 0, subCanvasInnerSize, subCanvasInnerSize);
                } else {
                    this.subCanvasRef.current.width = subCanvasInnerSize;
                    this.subCanvasRef.current.height = subCanvasInnerSize;
                }
            }
            this.runningInstance = runner;
            // reset display
            this.setState(function (state) {
                return {
                    score: _this14.runningInstance.mySnake.myLength,
                    playing: _this14.runningInstance.mySnake.getComponentName()
                };
            });

            this.runningInstance.focusMe();
            this.startDraw();
            this.runningInstance.startMe();
            if (this.state.paused) {
                this.runningInstance.pause();
                this.pausePlayButtonRef.current.clicked();
            }
        }

        // evolution shell interaction methods
        // called by the shell when it has something new to show

    }, {
        key: "evolutionReady",
        value: function evolutionReady() {
            // console.log("Game Menu evolutionReady");
            if (!this.runningInstance || this.runningInstance instanceof EvolutionLoadScreen) {
                this.evolutionShell.runQueue(this.startSnake, this.startRunner);
            }
        }
    }, {
        key: "evolveButton",
        value: function evolveButton() {
            this.showcase = false;
            this.evolutionShell.runGen();
            this.evolutionShell.runQueue(this.startSnake, this.startRunner);
        }
    }, {
        key: "infiniteButton",
        value: function infiniteButton() {
            var _this15 = this;

            this.setState(function (state) {
                return {
                    infiniteEvolve: !state.infiniteEvolve
                };
            }, function () {
                if (_this15.evolutionShell) {
                    _this15.evolutionShell.infiniteRun = _this15.state.infiniteEvolve;
                }
            });
        }

        // REACT lifecycle

    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this16 = this;

            this.subCanvasCTX = this.subCanvasRef.current.getContext("2d");

            // buy time for snakes to load
            setTimeout(function () {
                return _this16.showcaseRandomEvolutionSnake();
            }, 120);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            var _this17 = this;

            document.removeEventListener("keydown", function () {
                return _this17.keyEventInDown;
            }, false);
            document.removeEventListener("keyup", function () {
                return _this17.keyEventInUp;
            }, false);
        }
    }]);

    return GameMenu;
}(React.Component);