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

var EvolutionMenu = function (_React$Component2) {
    _inherits(EvolutionMenu, _React$Component2);

    function EvolutionMenu(props) {
        _classCallCheck(this, EvolutionMenu);

        var _this2 = _possibleConstructorReturn(this, (EvolutionMenu.__proto__ || Object.getPrototypeOf(EvolutionMenu)).call(this, props));

        _this2.subCanvasRef = React.createRef();
        return _this2;
    }

    _createClass(EvolutionMenu, [{
        key: "render",
        value: function render() {
            return React.createElement(
                SquareFill,
                { parentRef: this.props.parentRef },
                React.createElement(SubCanvas, { ref: this.subCanvasRef }),
                React.createElement(
                    "h1",
                    null,
                    "hi"
                )
            );
        }
    }]);

    return EvolutionMenu;
}(React.Component);