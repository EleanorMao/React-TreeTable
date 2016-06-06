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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by dalin on 16/6/6.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Component = _react2.default.Component;

var Paging = function (_Component) {
    _inherits(Paging, _Component);

    function Paging(props) {
        _classCallCheck(this, Paging);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Paging).call(this, props));
    }

    _createClass(Paging, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var max = Math.ceil(this.props.size / this.props.length);
            return _react2.default.createElement(
                "div",
                { className: "clearfix", style: { height: 35 } },
                _react2.default.createElement(
                    "div",
                    { className: "clearfix", style: { float: "right", height: 35 } },
                    function () {
                        if (_this2.props.num < max) return _react2.default.createElement(
                            "div",
                            { onClick: function onClick(event) {
                                    return _this2.props.click(event, max);
                                }, className: "paging-group" },
                            _react2.default.createElement(
                                "a",
                                { href: "javascript:void(0)" },
                                ">>"
                            )
                        );else return _react2.default.createElement(
                            "div",
                            { className: "paging-group" },
                            _react2.default.createElement(
                                "a",
                                { style: { color: '#e5e5e5' }, href: "javascript:void(0)" },
                                ">>"
                            )
                        );
                    }(),
                    function () {
                        if (_this2.props.num < max) return _react2.default.createElement(
                            "div",
                            { onClick: function onClick(event) {
                                    return _this2.props.click(event, _this2.props.num + 1);
                                }, className: "paging-group" },
                            _react2.default.createElement(
                                "a",
                                { href: "javascript:void(0)" },
                                ">"
                            )
                        );else return _react2.default.createElement(
                            "div",
                            { className: "paging-group" },
                            _react2.default.createElement(
                                "a",
                                { style: { color: '#e5e5e5' }, href: "javascript:void(0)" },
                                ">"
                            )
                        );
                    }(),
                    function () {
                        if (_this2.props.num + 4 <= max) {
                            var arr = [];

                            var _loop = function _loop(i) {
                                arr.push(_react2.default.createElement(
                                    "div",
                                    { onClick: function onClick(event) {
                                            return _this2.props.click(event, i);
                                        }, key: i, className: _this2.props.num == i ? "checked" : "paging-group" },
                                    _react2.default.createElement(
                                        "a",
                                        {
                                            href: "javascript:void(0)" },
                                        i
                                    )
                                ));
                            };

                            for (var i = _this2.props.num + 4; i > _this2.props.num - 1; i--) {
                                _loop(i);
                            }
                            return arr;
                        } else if (_this2.props.num + 3 <= max) {
                            var _arr = [];

                            var _loop2 = function _loop2(_i) {
                                _arr.push(_react2.default.createElement(
                                    "div",
                                    { onClick: function onClick(event) {
                                            return _this2.props.click(event, _i);
                                        }, key: _i, className: _this2.props.num == _i ? "checked" : "paging-group" },
                                    _react2.default.createElement(
                                        "a",
                                        {
                                            href: "javascript:void(0)" },
                                        _i
                                    )
                                ));
                            };

                            for (var _i = _this2.props.num + 3; _i > _this2.props.num - 2 && _i > 0; _i--) {
                                _loop2(_i);
                            }
                            return _arr;
                        } else if (_this2.props.num + 2 <= max) {
                            var _arr2 = [];

                            var _loop3 = function _loop3(_i2) {
                                _arr2.push(_react2.default.createElement(
                                    "div",
                                    { onClick: function onClick(event) {
                                            return _this2.props.click(event, _i2);
                                        }, key: _i2, className: _this2.props.num == _i2 ? "checked" : "paging-group" },
                                    _react2.default.createElement(
                                        "a",
                                        {
                                            href: "javascript:void(0)" },
                                        _i2
                                    )
                                ));
                            };

                            for (var _i2 = _this2.props.num + 2; _i2 > _this2.props.num - 3 && _i2 > 0; _i2--) {
                                _loop3(_i2);
                            }
                            return _arr2;
                        } else if (_this2.props.num + 1 <= max) {
                            var _arr3 = [];

                            var _loop4 = function _loop4(_i3) {
                                _arr3.push(_react2.default.createElement(
                                    "div",
                                    { onClick: function onClick(event) {
                                            return _this2.props.click(event, _i3);
                                        }, key: _i3, className: _this2.props.num == _i3 ? "checked" : "paging-group" },
                                    _react2.default.createElement(
                                        "a",
                                        {
                                            href: "javascript:void(0)" },
                                        _i3
                                    )
                                ));
                            };

                            for (var _i3 = _this2.props.num + 1; _i3 > _this2.props.num - 4 && _i3 > 0; _i3--) {
                                _loop4(_i3);
                            }
                            return _arr3;
                        } else if (_this2.props.num <= max) {
                            var _arr4 = [];

                            var _loop5 = function _loop5(_i4) {
                                _arr4.push(_react2.default.createElement(
                                    "div",
                                    { onClick: function onClick(event) {
                                            return _this2.props.click(event, _i4);
                                        }, key: _i4, className: _this2.props.num == _i4 ? "checked" : "paging-group" },
                                    _react2.default.createElement(
                                        "a",
                                        {
                                            href: "javascript:void(0)" },
                                        _i4
                                    )
                                ));
                            };

                            for (var _i4 = _this2.props.num; _i4 > _this2.props.num - 5 && _i4 > 0; _i4--) {
                                _loop5(_i4);
                            }
                            return _arr4;
                        }
                    }(),
                    function () {
                        if (_this2.props.num > 1) return _react2.default.createElement(
                            "div",
                            { onClick: function onClick(event) {
                                    return _this2.props.click(event, _this2.props.num - 1);
                                }, className: "paging-group" },
                            _react2.default.createElement(
                                "a",
                                { href: "javascript:void(0)" },
                                "<"
                            )
                        );else return _react2.default.createElement(
                            "div",
                            { className: "paging-group" },
                            _react2.default.createElement(
                                "a",
                                { style: { color: '#e5e5e5' }, href: "javascript:void(0)" },
                                "<"
                            )
                        );
                    }(),
                    function () {
                        if (_this2.props.num > 1) return _react2.default.createElement(
                            "div",
                            { onClick: function onClick(event) {
                                    return _this2.props.click(event, 1);
                                }, className: "paging-group" },
                            _react2.default.createElement(
                                "a",
                                { href: "javascript:void(0)" },
                                "<<"
                            )
                        );else return _react2.default.createElement(
                            "div",
                            { className: "paging-group" },
                            _react2.default.createElement(
                                "a",
                                { style: { color: '#e5e5e5' }, href: "javascript:void(0)" },
                                "<<"
                            )
                        );
                    }()
                )
            );
        }
    }]);

    return Paging;
}(Component);

exports.default = Paging;