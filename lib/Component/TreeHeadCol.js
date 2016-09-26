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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeHeadCol = function (_Component) {
    _inherits(TreeHeadCol, _Component);

    function TreeHeadCol(props) {
        _classCallCheck(this, TreeHeadCol);

        return _possibleConstructorReturn(this, (TreeHeadCol.__proto__ || Object.getPrototypeOf(TreeHeadCol)).call(this, props));
    }

    _createClass(TreeHeadCol, [{
        key: "caretRender",
        value: function caretRender(dataField, sortName, sortOrder) {
            var SortGroup = _react2.default.createElement(
                "span",
                { className: "order" },
                _react2.default.createElement(
                    "span",
                    { className: "dropdown" },
                    _react2.default.createElement("span", { className: "caret", style: { margin: '10px 0 10px 5px', color: '#ccc' } })
                ),
                _react2.default.createElement(
                    "span",
                    { className: "dropup" },
                    _react2.default.createElement("span", { className: "caret", style: { margin: '10px 0', color: '#ccc' } })
                )
            );
            var AscCaret = _react2.default.createElement("span", { className: "caret", style: { margin: '10px 0 10px 5px' } });
            if (dataField === sortName && sortOrder) {
                return _react2.default.createElement(
                    "span",
                    { className: "order " + (sortOrder === 'desc' ? '' : 'dropup') },
                    AscCaret
                );
            } else {
                return SortGroup;
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props;
            var width = _props.width;
            var hidden = _props.hidden;
            var onSort = _props.onSort;
            var children = _props.children;
            var dataSort = _props.dataSort;
            var sortName = _props.sortName;
            var sortOrder = _props.sortOrder;
            var dataField = _props.dataField;
            var dataAlign = _props.dataAlign;


            var style = {
                width: width,
                maxWidth: width,
                textAlign: dataAlign,
                display: hidden && 'none'
            };

            return _react2.default.createElement(
                "th",
                { style: style,
                    onClick: dataSort ? function () {
                        return onSort(dataField, sortOrder === 'asc' ? 'desc' : 'asc');
                    } : function () {
                        return false;
                    } },
                _react2.default.createElement(
                    "span",
                    null,
                    children
                ),
                dataSort && this.caretRender(dataField, sortName, sortOrder)
            );
        }
    }]);

    return TreeHeadCol;
}(_react.Component);

TreeHeadCol.defaultProps = {
    dataSort: false,
    dataFixed: 'auto',
    showArrow: undefined
};

TreeHeadCol.propTypes = {
    hidden: _react.PropTypes.bool,
    dataSort: _react.PropTypes.bool,
    dataFormat: _react.PropTypes.func,
    dataFixed: _react.PropTypes.oneOf(['left', 'right', 'auto']),
    dataAlign: _react.PropTypes.oneOf(['left', 'right', 'center']),
    width: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    showArrow: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.bool])
};

exports.default = TreeHeadCol;