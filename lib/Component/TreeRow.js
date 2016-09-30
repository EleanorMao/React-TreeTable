'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Util = require('./Util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by BG236557 on 2016/5/27.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Component = _react2.default.Component;

var TreeRow = function (_Component) {
    _inherits(TreeRow, _Component);

    function TreeRow(props) {
        _classCallCheck(this, TreeRow);

        return _possibleConstructorReturn(this, (TreeRow.__proto__ || Object.getPrototypeOf(TreeRow)).call(this, props));
    }

    _createClass(TreeRow, [{
        key: 'handleToggle',
        value: function handleToggle(e) {
            var _props = this.props;
            var open = _props.open;
            var data = _props.data;
            var parent = _props.parent;

            e.stopPropagation();
            var options = (0, _Util.extend)({}, {
                open: open, data: data, parent: parent
            });
            this.props.onClick(options);
        }
    }, {
        key: 'cellRender',
        value: function cellRender() {
            var _this2 = this;

            var output = [];
            var arrow = -1;
            var _props2 = this.props;
            var open = _props2.open;
            var data = _props2.data;
            var cols = _props2.cols;
            var iskey = _props2.iskey;
            var level = _props2.level;
            var isTree = _props2.isTree;
            var hashKey = _props2.hashKey;
            var checked = _props2.checked;
            var isSelect = _props2.isSelect;
            var arrowCol = _props2.arrowCol;
            var selectRow = _props2.selectRow;
            var arrowRender = _props2.arrowRender;
            var hideSelectColumn = _props2.hideSelectColumn;
            var childrenPropertyName = _props2.childrenPropertyName;


            var _key = hashKey ? data.__uid : data[iskey];

            if (isSelect && !hideSelectColumn) {
                output.push(_react2.default.createElement(
                    'td',
                    { key: _key, style: { backgroundColor: checked && selectRow.bgColor, textAlign: 'center' } },
                    _react2.default.createElement('input', { type: selectRow.mode, checked: checked, readOnly: true })
                ));
            }

            cols.map(function (key, i, col) {

                var cell = data[key.id];
                var dataFormat = key.dataFormat;

                var style = {
                    width: key.width,
                    maxWidth: key.width,
                    textAlign: key.dataAlign,
                    display: key.hidden && 'none',
                    backgroundColor: isSelect && checked && selectRow.bgColor
                };

                if (dataFormat) {
                    cell = dataFormat.call(null, data[key.id], level, data, i, col);
                }

                if (i > arrowCol) {
                    arrow++;
                } else if (i === arrowCol) {
                    arrow = cell || cell === 0 ? 0 : -1;
                }

                var showArrow = data[childrenPropertyName];
                showArrow = showArrow && showArrow.length > 0;

                var type = _typeof(key.showArrow);

                if (type === 'function') {
                    showArrow = key.showArrow.call(null, data[key.id], level, data, i, col);
                } else if (type === 'boolean') {
                    showArrow = key.showArrow;
                }
                output.push(_react2.default.createElement(
                    'td',
                    { style: style,
                        key: '' + _key + i
                    },
                    _react2.default.createElement(
                        'span',
                        { style: { marginLeft: level * 10 + 'px' } },
                        cell,
                        isTree && showArrow && !arrow && _react2.default.createElement(
                            'span',
                            { className: 'table-arrow', onClick: _this2.handleToggle.bind(_this2) },
                            arrowRender(open)
                        )
                    )
                ));
            });
            return output;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props3 = this.props;
            var data = _props3.data;
            var level = _props3.level;
            var hover = _props3.hover;
            var isTree = _props3.isTree;
            var checked = _props3.checked;
            var isSelect = _props3.isSelect;
            var selectRow = _props3.selectRow;
            var hoverStyle = _props3.hoverStyle;
            var onMouseOut = _props3.onMouseOut;
            var onMouseOver = _props3.onMouseOver;

            return _react2.default.createElement(
                'tr',
                { style: hover ? hoverStyle : {},
                    className: isTree && !level && "ancestor" || null,
                    onMouseOut: onMouseOut, onMouseOver: onMouseOver,
                    onClick: isSelect ? function () {
                        return selectRow.onSelect(!checked, data);
                    } : function () {
                        return false;
                    }
                },
                this.cellRender()
            );
        }
    }]);

    return TreeRow;
}(Component);

exports.default = TreeRow;


TreeRow.defaultProps = {
    level: 0,
    hashKey: false,
    hideSelectColumn: false,
    arrowRender: function arrowRender(open) {
        return _react2.default.createElement(
            'i',
            {
                className: 'fa fa-chevron-down',
                style: open ? { transform: 'rotate(-90deg)' } : {}
            },
            ' '
        );
    }
};