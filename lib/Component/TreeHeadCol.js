'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

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
        key: 'render',
        value: function render() {
            var _props = this.props;
            var width = _props.width;
            var hidden = _props.hidden;
            var children = _props.children;

            var style = {
                minWidth: width,
                width: width
            };
            if (hidden) {
                style.width = 0;
                style.display = 'none';
            }
            return _react2.default.createElement(
                'th',
                { style: style },
                _react2.default.createElement(
                    'span',
                    null,
                    children
                )
            );
        }
    }]);

    return TreeHeadCol;
}(_react.Component);

TreeHeadCol.defaultProps = {
    showArrow: function showArrow() {
        return true;
    }
};

exports.default = TreeHeadCol;