var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// popup to select a loaded snake - 1
var SelectSnakePopUpREACT = function (_React$Component) {
    _inherits(SelectSnakePopUpREACT, _React$Component);

    function SelectSnakePopUpREACT(props) {
        _classCallCheck(this, SelectSnakePopUpREACT);

        var _this = _possibleConstructorReturn(this, (SelectSnakePopUpREACT.__proto__ || Object.getPrototypeOf(SelectSnakePopUpREACT)).call(this, props));

        _this.state = { errorText: "" };

        _this.editButton = _this.editButton.bind(_this);
        _this.deleteButton = _this.deleteButton.bind(_this);
        _this.cloneButton = _this.cloneButton.bind(_this);
        _this.changeErrorText = _this.changeErrorText.bind(_this);
        return _this;
    }

    _createClass(SelectSnakePopUpREACT, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                metaInfo = _props.metaInfo,
                selectedSnake = _props.selectedSnake,
                selectedSnakeGen = _props.selectedSnakeGen,
                loadedSnakesIn = _props.loadedSnakesIn;


            var editable = !(selectedSnake < protectedSnakes);

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
            var popUpFuncs = this.props.popUpFuncs;

            // console.log(`render: selectedGen: ${selectedSnakeGen}`);

            return React.createElement(
                PopUp,
                { className: "background selectSnake" + (this.props.className ? " " + this.props.className : ""), closeFunc: popUpFuncs.close },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "carousel_parent" },
                        React.createElement(
                            VerticalCarousel,
                            { delayInitialScroll: 1, selected: selectedSnake, items: loadedSnakesIn, select: popUpFuncs.changeSelected },
                            loadedSnakesIn.map(function (val, i) {
                                return React.createElement(
                                    "h3",
                                    null,
                                    val.getComponentName()
                                );
                            })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "background text_card" },
                        React.createElement(
                            "div",
                            { className: "inline_block_parent" },
                            React.createElement(
                                "h1",
                                null,
                                loadedSnakesIn[selectedSnake].getComponentName()
                            ),
                            React.createElement(
                                "label",
                                { htmlFor: "generation_number", className: "generation_label" },
                                "Generation: "
                            ),
                            React.createElement(
                                Select,
                                { initVal: selectedSnakeGen, name: "generation_number", onSelect: popUpFuncs.changeSelectedGen },
                                loadedSnakesIn[selectedSnake].snakes.map(function (value, index) {
                                    return React.createElement(
                                        "option",
                                        { value: index },
                                        index
                                    );
                                })
                            )
                        ),
                        React.createElement(SnakeDetails, { snake: loadedSnakesIn[selectedSnake].snakes[selectedSnakeGen] }),
                        React.createElement(
                            "div",
                            { className: "button_div" },
                            editable ? React.createElement(
                                Fragment,
                                null,
                                React.createElement(
                                    Button,
                                    { onClick: this.editButton },
                                    "Edit"
                                ),
                                React.createElement(
                                    Button,
                                    { onClick: this.deleteButton },
                                    "Delete"
                                )
                            ) : React.createElement(
                                Fragment,
                                null,
                                React.createElement(
                                    Button,
                                    { onClick: function onClick() {
                                            return _this2.changeErrorText("(Snake cannot be edited, try cloning then editing instead.)");
                                        }, className: "faded" },
                                    "Edit"
                                ),
                                React.createElement(
                                    Button,
                                    { onClick: function onClick() {
                                            return _this2.changeErrorText("(This snake is protected and cannot be deleted.)");
                                        }, className: "faded" },
                                    "Delete"
                                )
                            ),
                            React.createElement(
                                Button,
                                { onClick: this.cloneButton },
                                "Clone"
                            ),
                            React.createElement(
                                Button,
                                { onClick: popUpFuncs.close },
                                "Finish"
                            )
                        ),
                        React.createElement(
                            FadeDiv,
                            { speed: .75, className: "error_text", shouldReset: true },
                            this.state.errorText
                        )
                    )
                )
            );
        }
    }, {
        key: "editButton",
        value: function editButton() {
            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
            var popUpFuncs = this.props.popUpFuncs;

            popUpFuncs.close(2, this.props.selectedSnake);
        }
    }, {
        key: "deleteButton",
        value: function deleteButton() {
            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
            var popUpFuncs = this.props.popUpFuncs;

            popUpFuncs.spliceLoaded(this.props.selectedSnake, 1);
            popUpFuncs.changeSelected(this.props.selectedSnake - 1);
        }
    }, {
        key: "cloneButton",
        value: function cloneButton() {
            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
            var popUpFuncs = this.props.popUpFuncs;

            var snek = this.props.loadedSnakesIn[this.props.selectedSnake].snakes[this.props.selectedSnakeGen].cloneMe();
            snek.setNameClone();

            popUpFuncs.spliceLoaded(this.props.loadedSnakesIn.length, 0, snek);
            popUpFuncs.changeSelected(this.props.loadedSnakesIn.length - 1);
        }
    }, {
        key: "changeErrorText",
        value: function changeErrorText(text) {
            if (!this.state.errorText) {
                this.setState(function (state) {
                    return { errorText: text };
                });
            } else if (this.state.errorText.length < text.length) {
                this.setState(function (state) {
                    return { errorText: text };
                });
            } else {
                if (this.state.errorText === text) {
                    this.setState(function (state) {
                        return { errorText: text + " " };
                    });
                } else {
                    this.setState(function (state) {
                        return { errorText: text };
                    });
                }
            }
        }
    }]);

    return SelectSnakePopUpREACT;
}(React.Component);

// popup to create/edit a snake - 2


var CreateSnakePopUpREACT = function (_React$Component2) {
    _inherits(CreateSnakePopUpREACT, _React$Component2);

    function CreateSnakePopUpREACT(props) {
        _classCallCheck(this, CreateSnakePopUpREACT);

        var _this3 = _possibleConstructorReturn(this, (CreateSnakePopUpREACT.__proto__ || Object.getPrototypeOf(CreateSnakePopUpREACT)).call(this, props));

        _this3.state = {
            snake: null
        };

        _this3.updateSnake = _this3.updateSnake.bind(_this3);
        _this3.createBlankSnake = _this3.createBlankSnake.bind(_this3);
        _this3.saveResults = _this3.saveResults.bind(_this3);
        return _this3;
    }

    _createClass(CreateSnakePopUpREACT, [{
        key: "render",
        value: function render() {
            var _props2 = this.props,
                metaInfo = _props2.metaInfo,
                loadedSnakesIn = _props2.loadedSnakesIn;

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))

            var popUpFuncs = this.props.popUpFuncs;

            // nothing to display
            if (!this.state.snake) {
                return React.createElement(
                    PopUp,
                    { className: "background create_snake" + (this.props.className ? " " + this.props.className : ""), closeFunc: popUpFuncs.close },
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "text_card background" },
                            React.createElement(
                                "div",
                                { className: "waiting_box" },
                                React.createElement(
                                    "h2",
                                    null,
                                    "Welcome to the snake creator!"
                                ),
                                React.createElement(
                                    "p",
                                    null,
                                    "In general, it is recommended to use a pre-existing snake, such as \"Basic Neural-Net Snake\" as a template for creating new snakes. To do so, click the button below and hit \"edit\" on whichever snake template you wish to use. Do note that while some snakes cannot be edited, you may simply clone them then edit the clone."
                                ),
                                React.createElement(
                                    Button,
                                    { onClick: function onClick() {
                                            return popUpFuncs.close(1);
                                        } },
                                    "Select a Snake"
                                ),
                                "\n",
                                React.createElement(
                                    "h4",
                                    null,
                                    "Warning: editing then saving a snake which has multiple generations will delete all generations other than the first."
                                ),
                                React.createElement(
                                    "p",
                                    null,
                                    "Otherwise, if you wish to create a new, blank snake, please click the button below. Note that the snake will not be saved/stored until you press the \"save\" button."
                                ),
                                React.createElement(
                                    Button,
                                    { onClick: this.createBlankSnake },
                                    "Create a Blank Snake"
                                )
                            )
                        )
                    )
                );
            }

            return React.createElement(
                PopUp,
                { className: "background create_snake" + (this.props.className ? " " + this.props.className : ""), closeFunc: popUpFuncs.close },
                React.createElement(
                    "div",
                    null,
                    React.createElement("div", { className: "text_card background" })
                )
            );
        }
        // chose active snake if none

    }, {
        key: "updateSnake",
        value: function updateSnake() {
            var _props3 = this.props,
                metaInfo = _props3.metaInfo,
                loadedSnakesIn = _props3.loadedSnakesIn;


            if (!this.state.snake) {
                if (metaInfo != null) {
                    this.setState(function (state) {
                        return { snake: loadedSnakesIn[metaInfo].cloneMe() };
                    });
                }
                // do nothing if no metaInfo (popup opened directly instead of from selectSnake)
            }
        }
    }, {
        key: "createBlankSnake",
        value: function createBlankSnake() {}
    }, {
        key: "saveResults",
        value: function saveResults() {}
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.updateSnake();
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
            this.updateSnake();
        }
    }]);

    return CreateSnakePopUpREACT;
}(React.Component);