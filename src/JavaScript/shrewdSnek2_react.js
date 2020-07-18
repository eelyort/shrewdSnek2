var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO: depreciated, delete me
var MainMenuShell = function (_React$Component) {
    _inherits(MainMenuShell, _React$Component);

    function MainMenuShell(props) {
        _classCallCheck(this, MainMenuShell);

        // TODO: fix main menu and remove this stuff
        var _this = _possibleConstructorReturn(this, (MainMenuShell.__proto__ || Object.getPrototypeOf(MainMenuShell)).call(this, props));

        _this.runningMainMenu = null;
        _this.gamePanelRef = React.createRef();
        // -----------------------------------------

        _this.change = _this.change.bind(_this);
        return _this;
    }

    _createClass(MainMenuShell, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            setTimeout(function () {
                _this2.runningMainMenu = new MainMenu(document, _this2.gamePanelRef.current, function (target) {
                    return _this2.change(target);
                });
            }, 50);

            return React.createElement("div", { ref: this.gamePanelRef, id: "gamePanel-1", className: "gamePanelContainer" });
        }
    }, {
        key: "change",
        value: function change(target) {
            if (this.runningMainMenu) {
                this.runningMainMenu.KILLME();
                this.runningMainMenu = null;
            }
            this.props.change(target);
        }
    }]);

    return MainMenuShell;
}(React.Component);

// top level shell which manages the game display


var ShrewdSnek2Shell = function (_React$Component2) {
    _inherits(ShrewdSnek2Shell, _React$Component2);

    function ShrewdSnek2Shell(props) {
        _classCallCheck(this, ShrewdSnek2Shell);

        // 0 - nothing
        // 1 - main menu TODO: become REACT
        // 2 - game menu
        // 3 - empty wrapper
        var _this3 = _possibleConstructorReturn(this, (ShrewdSnek2Shell.__proto__ || Object.getPrototypeOf(ShrewdSnek2Shell)).call(this, props));

        _this3.state = { currentlyRunning: 0 };

        _this3.wrapperRef = React.createRef();

        _this3.change = _this3.change.bind(_this3);
        return _this3;
    }

    _createClass(ShrewdSnek2Shell, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.change(3);
        }
    }, {
        key: "render",
        value: function render() {
            // main menu - OLD
            if (this.state.currentlyRunning === 1) {
                return React.createElement(
                    "div",
                    { ref: this.wrapperRef, className: "react_wrapper" },
                    React.createElement(MainMenuShell, { change: this.change })
                );
            }
            // Game Menu
            else if (this.state.currentlyRunning === 2) {
                    return React.createElement(
                        "div",
                        { ref: this.wrapperRef, className: "react_wrapper" },
                        React.createElement(GameMenu, { parentRef: this.wrapperRef, change: this.change })
                    );
                }
                // empty wrapper
                else if (this.state.currentlyRunning === 3) {
                        return React.createElement("div", { ref: this.wrapperRef, className: "react_wrapper" });
                    }
            // default
            return React.createElement(
                "h1",
                null,
                "NO CURRENTLY RUNNING"
            );
        }
    }, {
        key: "change",
        value: function change(target) {
            this.setState(function (state) {
                return { currentlyRunning: target };
            });
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
            var _this4 = this;

            if (this.state.currentlyRunning !== 2) {
                requestAnimationFrame(function () {
                    return _this4.change(2);
                });
            }
        }
    }]);

    return ShrewdSnek2Shell;
}(React.Component);

ReactDOM.render(React.createElement(ShrewdSnek2Shell, null), $("#app_container")[0]);