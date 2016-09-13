"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by BG236557 on 2016/5/27.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Component = _react2.default.Component;

var _extends = function _extends(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

var TreeRow = function (_Component) {
    _inherits(TreeRow, _Component);

    function TreeRow(props) {
        _classCallCheck(this, TreeRow);

        var _this = _possibleConstructorReturn(this, (TreeRow.__proto__ || Object.getPrototypeOf(TreeRow)).call(this, props));

        _this.state = {
            open: props.open
        };
        return _this;
    }

    _createClass(TreeRow, [{
        key: "handleToggle",
        value: function handleToggle(event) {
            var data = _extends({}, { opened: this.state.open }, { data: this.props.data });
            this.setState(function (old) {
                old.open = !old.open;
                return old;
            });
            this.props.onClick(data);
        }
    }, {
        key: "cellRender",
        value: function cellRender() {
            var _this2 = this;

            var output = [];
            var data = this.props.data;
            var iskey = this.props.iskey;
            var hashKey = this.props.hashKey;
            var dataFormat = this.props.dataFormat;
            var level = this.props.level;
            var open = this.state.open;
            var arrow = -1;
            this.props.cols.map(function (key, i, col) {
                var children = data.list || data.chdatalist || data.children;
                var cell = data[key.id || key];
                if (dataFormat && dataFormat[key.id || key]) {
                    cell = dataFormat[key.id || key].call(null, data[key.id || key], level, data, i, col);
                }
                if (cell !== "") {
                    arrow++;
                }
                output.push(_react2.default.createElement(
                    "div",
                    { className: "table-cell",
                        style: { minWidth: key.width, width: _this2.props.width },
                        key: hashKey ? data.__uid + i : data[iskey] + i
                    },
                    _react2.default.createElement(
                        "span",
                        { style: { marginLeft: level * 10 + 'px' } },
                        cell,
                        children && children.length > 0 && !!!arrow ? _react2.default.createElement(
                            "i",
                            {
                                className: "table-arrow fa fa-chevron-down",
                                style: open ? { transform: 'rotate(-90deg)' } : {},
                                onClick: _this2.handleToggle.bind(_this2)
                            },
                            " "
                        ) : ''
                    )
                ));
            });
            return output;
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: !!this.props.level ? "table-row clearfix" : "table-row ancestor clearfix", ref: "row" },
                this.cellRender()
            );
        }
    }]);

    return TreeRow;
}(Component);

exports.default = TreeRow;


TreeRow.defaultProps = {
    level: 0
};