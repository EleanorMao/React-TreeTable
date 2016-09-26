'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Util = require('./Util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by elly on 16/9/26.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var NestedTreeHeader = function (_Component) {
    _inherits(NestedTreeHeader, _Component);

    function NestedTreeHeader(props) {
        _classCallCheck(this, NestedTreeHeader);

        return _possibleConstructorReturn(this, (NestedTreeHeader.__proto__ || Object.getPrototypeOf(NestedTreeHeader)).call(this, props));
    }

    _createClass(NestedTreeHeader, [{
        key: 'nestedHeadRender',
        value: function nestedHeadRender() {
            var output = [];
            var _props = this.props;
            var nestedHead = _props.nestedHead;
            var isTree = _props.isTree;
            var selectRow = _props.selectRow;

            var select = !isTree && selectRow.mode !== 'none';
            nestedHead.map(function (throws, index) {
                var item = _react2.default.createElement(
                    'tr',
                    { key: 'trow' + index },
                    select && _react2.default.createElement('th', { key: 'trow-1' }),
                    throws.map(function (cell, i) {
                        var obj = (0, _Util.isObj)(cell);
                        return _react2.default.createElement(
                            'th',
                            { colSpan: obj && cell.colspan || null,
                                rowSpan: obj && cell.rowspan || null,
                                key: i },
                            obj ? cell.label : cell
                        );
                    })
                );
                output.push(item);
            });
            return output;
        }
    }, {
        key: 'colgroupRender',
        value: function colgroupRender() {
            var cols = this.props.cols;
            var output = [];
            cols.map(function (item, i) {
                output.push(_react2.default.createElement('col', { key: i, style: { display: item.hidden && 'none' } }));
            });
            return output;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: "table-tree table-nestedHead " + this.props.lineWrap, ref: 'header' },
                _react2.default.createElement(
                    'table',
                    { className: 'table table-bordered table-striped table-hover' },
                    _react2.default.createElement(
                        'colgroup',
                        { ref: 'colgroup' },
                        this.colgroupRender()
                    ),
                    _react2.default.createElement(
                        'thead',
                        null,
                        this.nestedHeadRender()
                    )
                )
            );
        }
    }]);

    return NestedTreeHeader;
}(_react.Component);

exports.default = NestedTreeHeader;


NestedTreeHeader.defaultProps = {
    nestedHead: _react.PropTypes.arrayOf(_react.PropTypes.array)
};