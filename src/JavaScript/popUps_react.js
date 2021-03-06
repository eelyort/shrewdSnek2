var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

        _this.resetRender = false;

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

            if (this.resetRender) {
                return null;
            }

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

            if (selectedSnakeGen >= loadedSnakesIn[selectedSnake].getLength()) {
                popUpFuncs.changeSelectedGen(loadedSnakesIn[selectedSnake].getLength() - 1);
                return null;
            }

            return React.createElement(
                PopUp,
                { className: "background selectSnake" + (this.props.className ? " " + this.props.className : ""), closeFunc: function closeFunc() {
                        return popUpFuncs.close();
                    } },
                React.createElement(
                    FadeDiv,
                    { speed: .75, className: "error_text", shouldReset: true },
                    React.createElement(
                        "span",
                        null,
                        this.state.errorText
                    )
                ),
                React.createElement(
                    "div",
                    { className: "container" },
                    deleteBox,
                    React.createElement(
                        "div",
                        { className: "carousel_parent" },
                        React.createElement(
                            VerticalCarousel,
                            { delayInitialScroll: 1, selected: selectedSnake, items: loadedSnakesIn, select: function select(index) {
                                    popUpFuncs.changeSelected(index);
                                    popUpFuncs.changeSelectedGen(loadedSnakesIn[index].getLength() - 1);
                                    _this2.resetRender = true;
                                } },
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
                                        value.generationNumber ? value.generationNumber : index
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

            var species = this.props.loadedSnakesIn[this.props.selectedSnake].cloneSpecies();
            species.setNameClone();

            popUpFuncs.spliceLoaded(this.props.loadedSnakesIn.length, 0, species);
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
            console.log("todo save button - snake species");
            // console.log("todo save button - snake individual");

            // // save a snakeSpecies - doesn't work on mobile
            // // create a text area with the snake
            // const el = document.createElement('textarea');
            // el.value = loadedSnakesIn[selectedSnake].stringify();
            // document.body.appendChild(el);
            // // select it
            // el.select();
            // // copy
            // document.execCommand("copy");
            // // remove
            // document.body.removeChild(el);

            // save a snake
            // create a text area with the snake
            var el = document.createElement('textarea');
            el.value = loadedSnakesIn[selectedSnake].snakes[selectedSnakeGen].cloneMe().stringify();
            document.body.appendChild(el);
            // select it
            el.select();
            el.setSelectionRange(0, 9999999999); /*For mobile devices*/
            // copy
            document.execCommand("copy");
            // remove
            document.body.removeChild(el);

            this.changeErrorText("(Snake copied to clipboard)");
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
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
            if (this.resetRender) {
                this.resetRender = false;
                this.forceUpdate();
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

        // snake saved
        var _this3 = _possibleConstructorReturn(this, (CreateSnakePopUpREACT.__proto__ || Object.getPrototypeOf(CreateSnakePopUpREACT)).call(this, props));

        _this3.saved = true;
        // change in inputs or brain
        _this3.deepChanges = 0;

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
        _this3.modifySpecies = _this3.modifySpecies.bind(_this3);
        _this3.changeErrorText = _this3.changeErrorText.bind(_this3);
        _this3.loadFromString = _this3.loadFromString.bind(_this3);
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
                        FadeDiv,
                        { speed: .75, className: "error_text", shouldReset: true },
                        React.createElement(
                            "span",
                            null,
                            this.state.errorText
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "container" },
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
                                    { onChange: this.loadFromString },
                                    React.createElement("p", { className: "paste_saved" })
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
                        this.deepChanges > 0 ? " Due to changes in inputs/brain, saving this snake will erase all evolution progress." : ""
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
                    FadeDiv,
                    { speed: .75, className: "error_text", shouldReset: true },
                    React.createElement(
                        "span",
                        null,
                        this.state.errorText
                    )
                ),
                React.createElement(
                    "div",
                    { className: "container" },
                    confirmation,
                    quitConfirmation,
                    React.createElement(
                        "div",
                        { className: "text_card background" },
                        React.createElement(SnakeDetailsEdit, { snake: this.state.snake, tellChange: function tellChange() {
                                _this4.saved = false;
                            }, tellDeepChange: function tellDeepChange(revertAmount) {
                                if (revertAmount) {
                                    _this4.deepChanges -= revertAmount;
                                } else {
                                    _this4.deepChanges++;
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

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))

            var popUpFuncs = this.props.popUpFuncs;

            // replace an existing snake
            if (metaInfo != null) {
                if (this.state.confirmationBox) {
                    this.setState(function () {
                        return { confirmationBox: false };
                    }, function () {
                        // change input/brain, delete all generations except one
                        if (_this5.deepChanges > 0) {
                            popUpFuncs.spliceLoaded(metaInfo, 1, _this5.state.snake);
                        }
                        // surface changes: name, desc, params | keep all generations
                        else {
                                var newSnakes = _this5.modifySpecies();
                                popUpFuncs.spliceLoaded(metaInfo, 1, newSnakes);
                            }
                        // mark saved
                        popUpFuncs.changeSelected(metaInfo);
                        _this5.changeErrorText("(Save Successful)", function () {
                            _this5.saved = true;
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

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))

            var popUpFuncs = this.props.popUpFuncs;

            this.state.snake.setNameClone();
            this.setState(function (state) {
                return {
                    snake: state.snake.cloneMe()
                };
            }, function () {
                // change input/brain, delete all generations except one
                if (_this6.deepChanges > 0 || !metaInfo) {
                    popUpFuncs.spliceLoaded(loadedSnakesIn.length, 0, _this6.state.snake.cloneMe());
                }
                // surface changes: name, desc, params | keep all generations
                else {
                        var newSnakes = _this6.modifySpecies();
                        popUpFuncs.spliceLoaded(loadedSnakesIn.length, 0, newSnakes);
                    }
                // mark saved
                popUpFuncs.changeSelected(loadedSnakesIn.length - 1);
                popUpFuncs.close(1);
            });
        }
    }, {
        key: "modifySpecies",
        value: function modifySpecies() {
            var _props7 = this.props,
                metaInfo = _props7.metaInfo,
                loadedSnakesIn = _props7.loadedSnakesIn;


            var newSnek = this.state.snake;
            var oldSpecies = loadedSnakesIn[metaInfo];
            return oldSpecies.snakes.map(function (value, index) {
                value = value.cloneMe();
                value.setName(newSnek.componentName);
                value.componentDescription = newSnek.componentDescription;
                value.startHeadPos = newSnek.startHeadPos;
                value.startLength = newSnek.startLength;
                value.appleVal = newSnek.appleVal;
                value.gridSize = newSnek.gridSize;
                return value;
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
        key: "loadFromString",
        value: function loadFromString(str) {
            var _props8 = this.props,
                metaInfo = _props8.metaInfo,
                loadedSnakesIn = _props8.loadedSnakesIn;

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))

            var popUpFuncs = this.props.popUpFuncs;

            var snek = null;

            try {
                // console.log("try one");
                // console.log("success species");
                snek = new SnakeSpecies(Snake.parse(str));
            } catch (e) {} finally {
                // console.log("finally 1");
                try {
                    // console.log("try two");
                    // console.log("success snek");
                    snek = SnakeSpecies.parse(str);
                } catch (e) {} finally {
                    // console.log("finally");
                    if (snek) {
                        // console.log("saving");
                        // console.log(snek);
                        popUpFuncs.spliceLoaded(loadedSnakesIn.length, 0, snek);
                        popUpFuncs.changeSelected(loadedSnakesIn.length - 1);
                        this.changeErrorText("Snake loaded successfully, opening...");
                        popUpFuncs.close();
                        // console.log(loadedSnakesIn);
                        // setTimeout(() => popUpFuncs.close(2, loadedSnakesIn.length - 1), 1);
                    } else {
                        // console.log("invalid");
                        this.changeErrorText("Invalid Snake");
                    }
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

// edit evolution popup


var EditEvolutionPopUp = function (_React$Component3) {
    _inherits(EditEvolutionPopUp, _React$Component3);

    function EditEvolutionPopUp(props) {
        _classCallCheck(this, EditEvolutionPopUp);

        var _this7 = _possibleConstructorReturn(this, (EditEvolutionPopUp.__proto__ || Object.getPrototypeOf(EditEvolutionPopUp)).call(this, props));

        _this7.state = {
            evolution: null,
            currSnake: null,
            errorText: "(Nothing to Save.)",
            confirmationBox: false,
            quitConfirmation: false
        };

        _this7.saved = true;

        _this7.createBlank = _this7.createBlank.bind(_this7);
        _this7.saveResults = _this7.saveResults.bind(_this7);
        _this7.changeErrorText = _this7.changeErrorText.bind(_this7);
        _this7.changed = _this7.changed.bind(_this7);
        return _this7;
    }

    _createClass(EditEvolutionPopUp, [{
        key: "render",
        value: function render() {
            var _this8 = this;

            var _props9 = this.props,
                metaInfo = _props9.metaInfo,
                evolutionIn = _props9.evolutionIn;
            var _state = this.state,
                evolution = _state.evolution,
                currSnake = _state.currSnake;


            if (!evolution) {
                return null;
            }

            var speed = typeWriteSpeed;

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s)), changeEvolution(newEvolution)
            var popUpFuncs = this.props.popUpFuncs;

            var confirmation = null;
            if (this.state.confirmationBox) {
                confirmation = React.createElement(
                    "div",
                    { className: "confirmation_box" },
                    React.createElement(
                        "h3",
                        null,
                        "Are you sure you want to override the previous parameters and evolution progress? The previous snakes will remain saved."
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            Button,
                            { onClick: function onClick() {
                                    return _this8.setState(function () {
                                        return { confirmationBox: false };
                                    });
                                } },
                            "Cancel"
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
                                    return _this8.setState(function () {
                                        return { quitConfirmation: false };
                                    });
                                } },
                            "Cancel"
                        ),
                        React.createElement(
                            Button,
                            { onClick: function onClick() {
                                    return _this8.setState(function () {
                                        return { quitConfirmation: false };
                                    }, function () {
                                        return _this8.saveResults();
                                    });
                                } },
                            "No, Save"
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
                        if (!_this8.saved) {
                            _this8.setState(function () {
                                return { quitConfirmation: true };
                            });
                        } else {
                            popUpFuncs.close();
                        }
                    } },
                React.createElement(
                    FadeDiv,
                    { speed: .75, className: "error_text", shouldReset: true },
                    React.createElement(
                        "span",
                        null,
                        this.state.errorText
                    )
                ),
                React.createElement(
                    "div",
                    { className: "container" },
                    confirmation,
                    quitConfirmation,
                    React.createElement(
                        "div",
                        { className: "text_card background" },
                        React.createElement(
                            "div",
                            { className: "details" },
                            React.createElement(
                                TextArea,
                                { onChange: function onChange(val) {
                                        evolution.componentName = val;
                                        _this8.changed();
                                    } },
                                React.createElement(
                                    "h1",
                                    null,
                                    evolution.getComponentName()
                                )
                            ),
                            React.createElement(
                                CollapsibleDiv,
                                { startOpen: collapsePrefEvolution[0], changePref: function changePref(val) {
                                        return collapsePrefEvolution[0] = val;
                                    } },
                                React.createElement(
                                    "p",
                                    { className: "category_text_title" },
                                    "Description"
                                ),
                                React.createElement(
                                    TextArea,
                                    { onChange: function onChange(val) {
                                            evolution.componentDescription = val;
                                            _this8.changed();
                                        } },
                                    React.createElement(
                                        "p",
                                        { className: "category_text" },
                                        evolution.getComponentDescription()
                                    )
                                )
                            ),
                            React.createElement(
                                CollapsibleDiv,
                                { startOpen: collapsePrefEvolution[1], changePref: function changePref(val) {
                                        return collapsePrefEvolution[1] = val;
                                    } },
                                React.createElement(
                                    "p",
                                    { className: "category_text_title" },
                                    "Parameters"
                                ),
                                evolution.parameters.map(function (val, index) {
                                    var _defaultEvolutionPara = _slicedToArray(defaultEvolutionParams[index], 6),
                                        name = _defaultEvolutionPara[0],
                                        defaultVal = _defaultEvolutionPara[1],
                                        desc = _defaultEvolutionPara[2],
                                        min = _defaultEvolutionPara[3],
                                        max = _defaultEvolutionPara[4],
                                        step = _defaultEvolutionPara[5];

                                    var htmlName = name.replace(" ", "_");
                                    if (index !== 1 && index !== 2) {
                                        return React.createElement(
                                            Fragment,
                                            null,
                                            React.createElement(
                                                "div",
                                                { className: "wrapper_div inline_block_parent" },
                                                React.createElement(
                                                    "label",
                                                    { htmlFor: htmlName, className: "category_text_title small" },
                                                    name
                                                ),
                                                index !== 5 ?
                                                // all fields are numeric input except for 5
                                                React.createElement(NumberForm, { name: htmlName, initVal: val, min: min, max: max, step: step, onChange: function onChange(val) {
                                                        evolution.parameters[index] = val;
                                                        _this8.changed();
                                                    } }) :
                                                // special case for mode-normalization
                                                React.createElement(
                                                    Select,
                                                    { initVal: evolution.parameters[index], name: htmlName, onSelect: function onSelect(val) {
                                                            evolution.parameters[index] = parseInt(val);
                                                            _this8.changed();
                                                        } },
                                                    React.createElement(
                                                        "option",
                                                        { value: 0 },
                                                        "Median"
                                                    ),
                                                    React.createElement(
                                                        "option",
                                                        { value: 1 },
                                                        "Mean"
                                                    )
                                                )
                                            ),
                                            React.createElement(
                                                TypewriterText,
                                                { speed: speed },
                                                React.createElement(
                                                    "p",
                                                    { className: "category_text" },
                                                    desc
                                                )
                                            )
                                        );
                                    }
                                })
                            ),
                            React.createElement(
                                CollapsibleDiv,
                                { startOpen: collapsePrefEvolution[2], changePref: function changePref(val) {
                                        return collapsePrefEvolution[2] = val;
                                    } },
                                React.createElement(
                                    "p",
                                    { className: "category_text_title" },
                                    "Mutation Methods"
                                ),
                                evolution.parameters[2].map(function (arr, mutationIndex) {
                                    var _arr = _slicedToArray(arr, 2),
                                        mutation = _arr[0],
                                        relativeProb = _arr[1];

                                    var htmlNameMutation = "mutation_" + mutationIndex;
                                    return React.createElement(
                                        "div",
                                        { className: "component_block" },
                                        React.createElement(
                                            "div",
                                            { className: "wrapper_div inline_block_parent" },
                                            React.createElement(
                                                "select",
                                                { className: "category_text_title small", value: mutation.componentID, name: htmlNameMutation, onChange: function onChange(val) {
                                                        val = val.target.value;
                                                        evolution.parameters[2].splice(mutationIndex, 1, [blankMutations[val].cloneMe(), 1]);
                                                        _this8.changed();
                                                    } },
                                                blankMutations.map(function (value, index) {
                                                    return React.createElement(
                                                        "option",
                                                        { value: index },
                                                        value.getComponentName()
                                                    );
                                                })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "wrapper_div inline_block_parent float_right" },
                                                React.createElement(
                                                    "label",
                                                    { htmlFor: htmlNameMutation + "_probability" },
                                                    "Relative Likelihood: "
                                                ),
                                                React.createElement(NumberForm, { name: htmlNameMutation + "_probability", initVal: relativeProb, min: 1, max: 100000, step: 0.5, onChange: function onChange(val) {
                                                        evolution.parameters[2][mutationIndex][1] = val;
                                                        _this8.changed();
                                                    } })
                                            )
                                        ),
                                        React.createElement(
                                            TypewriterText,
                                            { speed: speed },
                                            React.createElement(
                                                "p",
                                                { className: "category_text" + (_this8.props.className ? " " + _this8.props.className : "") },
                                                mutation.getComponentDescription()
                                            )
                                        ),
                                        mutation.mutationParameters.map(function (arr, paramIndex) {
                                            var isSelect = arr.length === 4;
                                            var name = void 0,
                                                val = void 0,
                                                desc = void 0;

                                            var form = null;

                                            var htmlName = "parameter_" + paramIndex;

                                            var min = void 0,
                                                max = void 0,
                                                step = void 0,
                                                options = void 0;
                                            if (!isSelect) {
                                                var _arr2 = _slicedToArray(arr, 6);

                                                name = _arr2[0];
                                                val = _arr2[1];
                                                desc = _arr2[2];
                                                min = _arr2[3];
                                                max = _arr2[4];
                                                step = _arr2[5];

                                                form = React.createElement(NumberForm, { name: htmlName, initVal: val, min: min, max: max, step: step, onChange: function onChange(val) {
                                                        mutation.mutationParameters[paramIndex][1] = val;
                                                        _this8.changed();
                                                    } });
                                            } else {
                                                var _arr3 = _slicedToArray(arr, 4);

                                                name = _arr3[0];
                                                val = _arr3[1];
                                                desc = _arr3[2];
                                                options = _arr3[3];

                                                form = React.createElement(
                                                    Select,
                                                    { name: htmlName, initVal: val, onSelect: function onSelect(val) {
                                                            mutation.mutationParameters[paramIndex][1] = val;
                                                            _this8.changed();
                                                        } },
                                                    options.map(function (optionVal, optionIndex) {
                                                        return React.createElement(
                                                            "option",
                                                            { value: optionVal },
                                                            optionVal + ""
                                                        );
                                                    })
                                                );
                                            }

                                            return React.createElement(
                                                Fragment,
                                                null,
                                                React.createElement(
                                                    "div",
                                                    { className: "inline_block_parent" },
                                                    React.createElement(
                                                        "label",
                                                        { htmlFor: htmlName, className: "category_text_title small" },
                                                        name
                                                    ),
                                                    form
                                                ),
                                                React.createElement(
                                                    "p",
                                                    { className: "category_text" },
                                                    desc
                                                )
                                            );
                                        }),
                                        React.createElement(
                                            "div",
                                            { className: "button_div" },
                                            evolution.parameters[2].length <= 1 ? React.createElement(
                                                Button,
                                                { className: "faded" + (_this8.props.className ? " " + _this8.props.className : ""), onClick: function onClick() {
                                                        return null;
                                                    } },
                                                React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/delete-button-580x580.png" })
                                            ) : React.createElement(
                                                Button,
                                                { className: _this8.props.className, onClick: function onClick() {
                                                        evolution.parameters[2].splice(mutationIndex, 1);
                                                        _this8.changed();
                                                    } },
                                                React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/delete-button-580x580.png" })
                                            ),
                                            React.createElement(
                                                Button,
                                                { className: _this8.props.className, onClick: function onClick() {
                                                        evolution.parameters[2].push([mutation.cloneMe(), relativeProb]);
                                                        _this8.changed();
                                                    } },
                                                React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/+-button-640x640.png" })
                                            )
                                        )
                                    );
                                }),
                                React.createElement(
                                    "div",
                                    { className: "inline_block_parent inline_buttons edit_add_component" },
                                    React.createElement(
                                        "label",
                                        { htmlFor: "mutation_extra" },
                                        "Add Mutation:"
                                    ),
                                    React.createElement(
                                        "select",
                                        { value: -1, name: "mutation_extra", onChange: function onChange(val) {
                                                val = val.target.value;
                                                evolution.parameters[2].push([blankMutations[val].cloneMe(), 1]);
                                                _this8.changed();
                                            } },
                                        React.createElement(
                                            "option",
                                            { value: -1 },
                                            "------"
                                        ),
                                        blankMutations.map(function (value, index) {
                                            return React.createElement(
                                                "option",
                                                { value: index },
                                                value.getComponentName()
                                            );
                                        })
                                    )
                                )
                            ),
                            React.createElement(
                                CollapsibleDiv,
                                { startOpen: collapsePrefEvolution[3], changePref: function changePref(val) {
                                        return collapsePrefEvolution[3] = val;
                                    } },
                                React.createElement(
                                    "p",
                                    { className: "category_text_title" },
                                    "Reproduction Methods"
                                ),
                                evolution.parameters[1].map(function (arr, reproductionIndex) {
                                    var _arr4 = _slicedToArray(arr, 2),
                                        reproduction = _arr4[0],
                                        relativeProb = _arr4[1];

                                    var htmlNameReproduction = "reproduction_" + reproductionIndex;
                                    return React.createElement(
                                        "div",
                                        { className: "component_block" },
                                        React.createElement(
                                            "div",
                                            { className: "wrapper_div inline_block_parent" },
                                            React.createElement(
                                                "select",
                                                { className: "category_text_title small", value: reproduction.componentID, name: htmlNameReproduction, onChange: function onChange(val) {
                                                        val = val.target.value;
                                                        evolution.parameters[1].splice(reproductionIndex, 1, [blankReproductions[val].cloneMe(), 1]);
                                                        _this8.changed();
                                                    } },
                                                blankReproductions.map(function (value, index) {
                                                    return React.createElement(
                                                        "option",
                                                        { value: index },
                                                        value.getComponentName()
                                                    );
                                                })
                                            ),
                                            React.createElement(
                                                "div",
                                                { className: "wrapper_div inline_block_parent float_right" },
                                                React.createElement(
                                                    "label",
                                                    { htmlFor: htmlNameReproduction + "_probability" },
                                                    "Relative Likelihood: "
                                                ),
                                                React.createElement(NumberForm, { name: htmlNameReproduction + "_probability", initVal: relativeProb, min: 1, max: 100000, step: 0.5, onChange: function onChange(val) {
                                                        evolution.parameters[1][reproductionIndex][1] = val;
                                                        _this8.changed();
                                                    } })
                                            )
                                        ),
                                        React.createElement(
                                            TypewriterText,
                                            { speed: speed },
                                            React.createElement(
                                                "p",
                                                { className: "category_text" + (_this8.props.className ? " " + _this8.props.className : "") },
                                                reproduction.getComponentDescription()
                                            )
                                        ),
                                        reproduction.reproductionParameters.map(function (arr, paramIndex) {
                                            var isSelect = arr.length === 4;
                                            var name = void 0,
                                                val = void 0,
                                                desc = void 0;

                                            var form = null;

                                            var htmlName = "parameter_" + paramIndex;

                                            var min = void 0,
                                                max = void 0,
                                                step = void 0,
                                                options = void 0;
                                            if (!isSelect) {
                                                var _arr5 = _slicedToArray(arr, 6);

                                                name = _arr5[0];
                                                val = _arr5[1];
                                                desc = _arr5[2];
                                                min = _arr5[3];
                                                max = _arr5[4];
                                                step = _arr5[5];

                                                form = React.createElement(NumberForm, { name: htmlName, initVal: val, min: min, max: max, step: step, onChange: function onChange(val) {
                                                        reproduction.reproductionParameters[paramIndex][1] = val;
                                                        _this8.changed();
                                                    } });
                                            } else {
                                                var _arr6 = _slicedToArray(arr, 4);

                                                name = _arr6[0];
                                                val = _arr6[1];
                                                desc = _arr6[2];
                                                options = _arr6[3];

                                                form = React.createElement(
                                                    Select,
                                                    { name: htmlName, initVal: val, onSelect: function onSelect(val) {
                                                            reproduction.reproductionParameters[paramIndex][1] = val;
                                                            _this8.changed();
                                                        } },
                                                    options.map(function (optionVal, optionIndex) {
                                                        return React.createElement(
                                                            "option",
                                                            { value: optionVal },
                                                            optionVal + ""
                                                        );
                                                    })
                                                );
                                            }

                                            return React.createElement(
                                                Fragment,
                                                null,
                                                React.createElement(
                                                    "div",
                                                    { className: "inline_block_parent" },
                                                    React.createElement(
                                                        "label",
                                                        { htmlFor: htmlName, className: "category_text_title small" },
                                                        name
                                                    ),
                                                    form
                                                ),
                                                React.createElement(
                                                    "p",
                                                    { className: "category_text" },
                                                    desc
                                                )
                                            );
                                        }),
                                        React.createElement(
                                            "div",
                                            { className: "button_div" },
                                            evolution.parameters[1].length <= 1 ? React.createElement(
                                                Button,
                                                { className: "faded" + (_this8.props.className ? " " + _this8.props.className : ""), onClick: function onClick() {
                                                        return null;
                                                    } },
                                                React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/delete-button-580x580.png" })
                                            ) : React.createElement(
                                                Button,
                                                { className: _this8.props.className, onClick: function onClick() {
                                                        evolution.parameters[1].splice(reproductionIndex, 1);
                                                        _this8.changed();
                                                    } },
                                                React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/delete-button-580x580.png" })
                                            ),
                                            React.createElement(
                                                Button,
                                                { className: _this8.props.className, onClick: function onClick() {
                                                        evolution.parameters[1].push([reproduction.cloneMe(), relativeProb]);
                                                        _this8.changed();
                                                    } },
                                                React.createElement(ImgIcon, { className: "wrapper_div", small: 3, src: "src/Images/+-button-640x640.png" })
                                            )
                                        )
                                    );
                                }),
                                React.createElement(
                                    "div",
                                    { className: "inline_block_parent inline_buttons edit_add_component" },
                                    React.createElement(
                                        "label",
                                        { htmlFor: "reproduction_extra" },
                                        "Add Reproduction:"
                                    ),
                                    React.createElement(
                                        "select",
                                        { value: -1, name: "reproduction_extra", onChange: function onChange(val) {
                                                val = val.target.value;
                                                evolution.parameters[1].push([blankReproductions[val].cloneMe(), 1]);
                                                _this8.changed();
                                            } },
                                        React.createElement(
                                            "option",
                                            { value: -1 },
                                            "------"
                                        ),
                                        blankReproductions.map(function (value, index) {
                                            return React.createElement(
                                                "option",
                                                { value: index },
                                                value.getComponentName()
                                            );
                                        })
                                    )
                                )
                            ),
                            React.createElement(
                                CollapsibleDiv,
                                { startOpen: collapsePrefEvolution[4], changePref: function changePref(val) {
                                        return collapsePrefEvolution[4] = val;
                                    } },
                                React.createElement(
                                    "div",
                                    { className: "inline_block_parent" },
                                    React.createElement(
                                        "label",
                                        { className: "category_text_title", htmlFor: "snake_select" },
                                        "Snake"
                                    ),
                                    React.createElement(
                                        Select,
                                        { initVal: -1, name: "snake_select", onSelect: function onSelect(val) {
                                                val = parseInt(val);
                                                if (val !== -1) {
                                                    _this8.setState(function () {
                                                        return { currSnake: loadedSnakes[val].cloneMe() };
                                                    });
                                                    _this8.changed();
                                                }
                                            } },
                                        React.createElement(
                                            "option",
                                            { value: -1 },
                                            currSnake ? currSnake.getComponentName() : "---"
                                        ),
                                        loadedSnakes.map(function (snek, index) {
                                            snek = snek.snakes[0];
                                            if (evolutionBrains.includes(snek.myBrain.componentID)) {
                                                return React.createElement(
                                                    "option",
                                                    { value: index },
                                                    snek.getComponentName()
                                                );
                                            } else {
                                                return null;
                                            }
                                        })
                                    )
                                ),
                                React.createElement(
                                    "h4",
                                    null,
                                    "(Snakes Must Have One Of The Following Brains:",
                                    " ",
                                    blankBrains.filter(function (value, index) {
                                        return evolutionBrains.includes(value.componentID);
                                    }).map(function (value, index) {
                                        return "\"" + value.getComponentName() + (index === evolutionBrains.length - 1 ? "." : ",") + "\"";
                                    }).join(" "),
                                    ")"
                                ),
                                currSnake ? React.createElement(SnakeDetails, { snake: currSnake }) : null
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "button_div" },
                            React.createElement(
                                Button,
                                { onClick: this.saveResults },
                                "Save"
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: "createBlank",
        value: function createBlank() {
            var _this9 = this;

            if (this.props.metaInfo instanceof Snake) {
                this.setState(function (state) {
                    return { evolution: new Evolution(_this9.props.metaInfo) };
                });
            } else {
                this.setState(function (state) {
                    return { evolution: new Evolution(null) };
                });
            }
        }
    }, {
        key: "saveResults",
        value: function saveResults() {
            if (!this.saved) {
                if (this.state.confirmationBox) {
                    // save
                    this.setState(function () {
                        return { confirmationBox: false };
                    });
                    var ans = this.state.evolution.cloneMe();
                    ans.currentGeneration = [[this.state.currSnake.cloneMe(), 1]];
                    this.props.popUpFuncs.changeEvolution(ans);
                    this.saved = true;
                    this.changeErrorText("(Saved Successfully.)");
                } else {
                    this.setState(function () {
                        return { confirmationBox: true };
                    });
                }
            } else {
                this.changeErrorText("(Nothing to Save.)");
            }
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
        key: "changed",
        value: function changed() {
            this.saved = false;
            this.forceUpdate();
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this10 = this;

            if (!this.state.evolution) {
                this.setState(function () {
                    return { evolution: _this10.props.evolutionIn.cloneMe() };
                }, function () {
                    if (_this10.state.evolution.currentGeneration && _this10.state.evolution.currentGeneration[0] && _this10.state.evolution.currentGeneration[0][0] instanceof Snake) {
                        _this10.setState(function () {
                            return { currSnake: _this10.state.evolution.currentGeneration[0][0].cloneMe() };
                        });
                    }
                });
            }
        }
    }]);

    return EditEvolutionPopUp;
}(React.Component);