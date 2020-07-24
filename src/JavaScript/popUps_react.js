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
        _this.cloneButton = _this.cloneButton.bind(_this);
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
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), pushLoaded(newSnake)
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
                                Button,
                                { onClick: this.editButton },
                                "Edit"
                            ) : React.createElement(
                                Button,
                                { onClick: function onClick() {
                                        _this2.setState(function (state) {
                                            return { errorText: state.errorText ? state.errorText + " " : "(Snake cannot be edited, try cloning then editing instead.)" };
                                        });
                                    }, className: "faded" },
                                "Edit"
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
                            { speed: .5, className: "error_text", shouldReset: true },
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
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), pushLoaded(newSnake)
            var popUpFuncs = this.props.popUpFuncs;

            popUpFuncs.close(2, this.props.selectedSnake);
        }
    }, {
        key: "cloneButton",
        value: function cloneButton() {
            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), pushLoaded(newSnake)
            var popUpFuncs = this.props.popUpFuncs;

            var snek = this.props.loadedSnakesIn[this.props.selectedSnake].snakes[this.props.selectedSnakeGen].cloneMe();
            snek.setNameClone();

            popUpFuncs.pushLoaded(snek);
            popUpFuncs.changeSelected(this.props.loadedSnakesIn.length - 1);
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
        return _this3;
    }

    _createClass(CreateSnakePopUpREACT, [{
        key: "render",
        value: function render() {
            var _props2 = this.props,
                metaInfo = _props2.metaInfo,
                loadedSnakesIn = _props2.loadedSnakesIn;


            var editable = !(selectedSnake < protectedSnakes);

            // bundle of functions for the popup to interact with the main menu
            //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), pushLoaded(newSnake)
            var popUpFuncs = this.props.popUpFuncs;

            // console.log(`render: selectedGen: ${selectedSnakeGen}`);

            return React.createElement(
                PopUp,
                { className: "background selectSnake" + (this.props.className ? " " + this.props.className : ""), closeFunc: popUpFuncs.close },
                React.createElement(
                    "div",
                    null,
                    React.createElement("div", { className: "text_card background" })
                )
            );
        }
    }]);

    return CreateSnakePopUpREACT;
}(React.Component);