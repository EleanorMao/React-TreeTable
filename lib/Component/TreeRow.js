'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

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
        key: 'handleToggle',
        value: function handleToggle(e) {
            e.stopPropagation();
            var data = _extends({}, {
                opened: this.state.open
            }, {
                data: this.props.data
            });
            this.setState(function (old) {
                old.open = !old.open;
                return old;
            });
            this.props.onClick(data);
        }
    }, {
        key: 'cellRender',
        value: function cellRender() {
            var _this2 = this;

            var output = [];
            var arrow = -1;
            var _props = this.props;
            var open = _props.open;
            var data = _props.data;
            var cols = _props.cols;
            var iskey = _props.iskey;
            var level = _props.level;
            var isTree = _props.isTree;
            var hashKey = _props.hashKey;
            var checked = _props.checked;
            var isSelect = _props.isSelect;
            var arrowCol = _props.arrowCol;
            var selectRow = _props.selectRow;


            var _key = hashKey ? data.__uid : data[iskey];

            if (isSelect) {
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
                    minWidth: key.width,
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

                var showArrow = data.list || data.chdatalist || data.children;
                showArrow = showArrow && showArrow.length > 0;

                var type = _typeof(key.showArrow);

                if (type === 'function') {
                    key.showArrow.call(null, data[key.id], level, data, i, col);
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
                            'i',
                            {
                                className: 'table-arrow fa fa-chevron-down',
                                style: open ? { transform: 'rotate(-90deg)' } : {},
                                onClick: _this2.handleToggle.bind(_this2)
                            },
                            ' '
                        )
                    )
                ));
            });
            return output;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props;
            var data = _props2.data;
            var level = _props2.level;
            var isTree = _props2.isTree;
            var checked = _props2.checked;
            var isSelect = _props2.isSelect;
            var selectRow = _props2.selectRow;

            return _react2.default.createElement(
                'tr',
                { className: isTree && !level && "ancestor",
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
    hashKey: false
};