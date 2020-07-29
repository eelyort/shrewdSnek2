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

        _this.state = {
            errorText: "",
            deleteConfirmationUp: false
        };

        _this.editButton = _this.editButton.bind(_this);
        _this.deleteButton = _this.deleteButton.bind(_this);
        _this.cloneButton = _this.cloneButton.bind(_this);
        _this.saveButton = _this.saveButton.bind(_this);
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

            // delete confirmation box
            var deleteBox = null;
            if (this.state.deleteConfirmationUp) {
                deleteBox = React.createElement(
                    "div",
                    { className: "confirmation_box" },
                    React.createElement(
                        "h3",
                        null,
                        "Are you sure you want to delete this snake?"
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            Button,
                            { onClick: function onClick() {
                                    return _this2.setState(function () {
                                        return { deleteConfirmationUp: false };
                                    });
                                } },
                            "No"
                        ),
                        React.createElement(
                            Button,
                            { onClick: this.deleteButton },
                            "Yes"
                        )
                    )
                );
            }

            return React.createElement(
                PopUp,
                { className: "background selectSnake" + (this.props.className ? " " + this.props.className : ""), closeFunc: function closeFunc() {
                        return popUpFuncs.close();
                    } },
                React.createElement(
                    "div",
                    null,
                    deleteBox,
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
                                { htmlFor: "generation_number" },
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
                            ),
                            React.createElement(
                                Button,
                                { onClick: this.saveButton },
                                "Save"
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

            if (this.state.deleteConfirmationUp) {
                popUpFuncs.spliceLoaded(this.props.selectedSnake, 1);
                popUpFuncs.changeSelected(this.props.selectedSnake - 1);
                this.setState(function () {
                    return { deleteConfirmationUp: false };
                });
            } else {
                this.setState(function () {
                    return { deleteConfirmationUp: true };
                });
            }
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
        key: "saveButton",
        value: function saveButton() {
            var _props2 = this.props,
                metaInfo = _props2.metaInfo,
                selectedSnake = _props2.selectedSnake,
                selectedSnakeGen = _props2.selectedSnakeGen,
                loadedSnakesIn = _props2.loadedSnakesIn;


            console.log("todo save button - generation");

            // save a snakeSpecies
            // create a text area with the snake
            var el = document.createElement('textarea');
            el.value = loadedSnakesIn[selectedSnake].stringify();
            document.body.appendChild(el);
            // select it
            el.select();
            el.setSelectionRange(0, 99999); /*For mobile devices*/
            // copy
            document.execCommand("copy");
            // remove
            document.body.removeChild(el);

            this.changeErrorText("(Snake(s) copied to clipboard)");
        }
    }, {
        key: "changeErrorText",
        value: function changeErrorText(text) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
                return null;
            };

            if (!this.state.errorText) {
                this.setState(function (state) {
                    return { errorText: text };
                }, callback);
            } else if (this.state.errorText.length < text.length) {
                this.setState(function (state) {
                    return { errorText: text };
                }, callback);
            } else {
                if (this.state.errorText === text) {
                    this.setState(function (state) {
                        return { errorText: text + " " };
                    }, callback);
                } else {
                    this.setState(function (state) {
                        return { errorText: text };
                    }, callback);
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

        _this3.saved = false;

        _this3.state = {
            snake: null,
            errorText: "",
            confirmationBox: false,
            quitConfirmation: false
        };

        _this3.updateSnake = _this3.updateSnake.bind(_this3);
        _this3.createBlankSnake = _this3.createBlankSnake.bind(_this3);
        _this3.saveResults = _this3.saveResults.bind(_this3);
        _this3.saveAsNew = _this3.saveAsNew.bind(_this3);
        _this3.changeErrorText = _this3.changeErrorText.bind(_this3);
        return _this3;
    }

    _createClass(CreateSnakePopUpREACT, [{
        key: "render",
        value: function render() {
            var _this4 = this;

            var _props3 = this.props,
                metaInfo = _props3.metaInfo,
                loadedSnakesIn = _props3.loadedSnakesIn;

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))

            var popUpFuncs = this.props.popUpFuncs;

            // nothing to display
            if (!this.state.snake) {
                return React.createElement(
                    PopUp,
                    { className: "background create_snake" + (this.props.className ? " " + this.props.className : ""), closeFunc: function closeFunc() {
                            return popUpFuncs.close();
                        } },
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
                                ),
                                React.createElement(
                                    "p",
                                    null,
                                    "Lastly, to load a snake you previously saved, paste the result into this box."
                                ),
                                React.createElement(
                                    TextArea,
                                    { onChange: function onChange(val) {
                                            try {
                                                var snek = SnakeSpecies.parse(val);
                                                popUpFuncs.spliceLoaded(loadedSnakesIn.length, 1, snek);
                                                popUpFuncs.changeSelected(loadedSnakesIn.length - 1);
                                                _this4.changeErrorText("Snake loaded successfully, opening...");
                                                popUpFuncs.close();
                                                setTimeout(function () {
                                                    return popUpFuncs.close(2, loadedSnakesIn.length - 1);
                                                }, 1);
                                            } catch (e) {
                                                _this4.changeErrorText("Invalid snake");
                                            }
                                        } },
                                    React.createElement("p", { className: "paste_saved" })
                                ),
                                React.createElement(
                                    FadeDiv,
                                    { speed: .75, className: "error_text", shouldReset: true },
                                    this.state.errorText
                                )
                            )
                        )
                    )
                );
            }

            var confirmation = null;
            if (this.state.confirmationBox) {
                confirmation = React.createElement(
                    "div",
                    { className: "confirmation_box" },
                    React.createElement(
                        "h3",
                        null,
                        "Are you sure you want to override the previous version of this snake?",
                        loadedSnakesIn[metaInfo].getLength() > 1 ? " All generations will also be erased." : ""
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            Button,
                            { onClick: function onClick() {
                                    return _this4.setState(function () {
                                        return { confirmationBox: false };
                                    });
                                } },
                            "Cancel"
                        ),
                        React.createElement(
                            Button,
                            { onClick: function onClick() {
                                    _this4.setState(function () {
                                        return { confirmationBox: false };
                                    }, function () {
                                        return _this4.saveAsNew();
                                    });
                                } },
                            "Save as New Snake"
                        ),
                        React.createElement(
                            Button,
                            { onClick: this.saveResults },
                            "Yes, Override"
                        )
                    )
                );
            }
            var quitConfirmation = null;
            if (this.state.quitConfirmation) {
                quitConfirmation = React.createElement(
                    "div",
                    { className: "confirmation_box" },
                    React.createElement(
                        "h3",
                        null,
                        "Are you sure you want to quit without saving?"
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            Button,
                            { onClick: function onClick() {
                                    return _this4.setState(function () {
                                        return { quitConfirmation: false };
                                    });
                                } },
                            "Cancel"
                        ),
                        React.createElement(
                            Button,
                            { onClick: function onClick() {
                                    return _this4.setState(function () {
                                        return { quitConfirmation: false };
                                    }, function () {
                                        return _this4.saveResults();
                                    });
                                } },
                            "No, Save Snake"
                        ),
                        React.createElement(
                            Button,
                            { onClick: function onClick() {
                                    return popUpFuncs.close();
                                } },
                            "Yes, Quit Without Saving"
                        )
                    )
                );
            }

            return React.createElement(
                PopUp,
                { className: "background create_snake" + (this.props.className ? " " + this.props.className : ""), closeFunc: function closeFunc() {
                        if (!_this4.saved) {
                            _this4.setState(function () {
                                return { quitConfirmation: true };
                            });
                        } else {
                            popUpFuncs.close();
                        }
                    } },
                React.createElement(
                    "div",
                    null,
                    confirmation,
                    quitConfirmation,
                    React.createElement(
                        "div",
                        { className: "text_card background" },
                        React.createElement(SnakeDetailsEdit, { snake: this.state.snake, tellChange: function tellChange() {
                                console.log("unsave");
                                if (_this4.saved) {
                                    _this4.saved = false;
                                }
                            } }),
                        React.createElement(
                            "div",
                            { className: "button_div" },
                            React.createElement(
                                Button,
                                { onClick: this.saveResults },
                                "Save"
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
        // chose active snake if none

    }, {
        key: "updateSnake",
        value: function updateSnake() {
            var _props4 = this.props,
                metaInfo = _props4.metaInfo,
                loadedSnakesIn = _props4.loadedSnakesIn;


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
        value: function saveResults() {
            var _this5 = this;

            var _props5 = this.props,
                metaInfo = _props5.metaInfo,
                loadedSnakesIn = _props5.loadedSnakesIn;

            // TODO: snake validation

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))

            var popUpFuncs = this.props.popUpFuncs;

            // replace an existing snake
            if (metaInfo != null) {
                if (this.state.confirmationBox) {
                    this.setState(function () {
                        return { confirmationBox: false };
                    }, function () {
                        popUpFuncs.spliceLoaded(metaInfo, 1, _this5.state.snake);
                        popUpFuncs.changeSelected(metaInfo);
                        _this5.changeErrorText("(Save Successful)", function () {
                            _this5.saved = true;
                            console.log("saved");
                        });
                    });
                } else {
                    this.setState(function () {
                        return { confirmationBox: true };
                    });
                }
            }
            // add another
            else {
                    this.saveAsNew();
                    // popUpFuncs.close(1);
                }
        }
    }, {
        key: "saveAsNew",
        value: function saveAsNew() {
            var _this6 = this;

            var _props6 = this.props,
                metaInfo = _props6.metaInfo,
                loadedSnakesIn = _props6.loadedSnakesIn;

            // TODO: snake validation

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))

            var popUpFuncs = this.props.popUpFuncs;

            this.state.snake.setNameClone();
            this.setState(function (state) {
                return {
                    snake: state.snake.cloneMe()
                };
            }, function () {
                popUpFuncs.spliceLoaded(loadedSnakesIn.length, 0, _this6.state.snake.cloneMe());
                popUpFuncs.changeSelected(loadedSnakesIn.length - 1);
                popUpFuncs.close(1);
                // setTimeout(() => {
                //     this.saved=true;
                //     console.log("saved");
                // }, 1);
            });
        }
    }, {
        key: "changeErrorText",
        value: function changeErrorText(text) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
                return null;
            };

            if (!this.state.errorText) {
                this.setState(function (state) {
                    return { errorText: text };
                }, callback);
            } else if (this.state.errorText.length < text.length) {
                this.setState(function (state) {
                    return { errorText: text };
                }, callback);
            } else {
                if (this.state.errorText === text) {
                    this.setState(function (state) {
                        return { errorText: text + " " };
                    }, callback);
                } else {
                    this.setState(function (state) {
                        return { errorText: text };
                    }, callback);
                }
            }
        }
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