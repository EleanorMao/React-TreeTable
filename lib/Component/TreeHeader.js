'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Util = require('./Util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by EleanorMao on 2016/9/19.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var TreeHeader = function (_Component) {
    _inherits(TreeHeader, _Component);

    function TreeHeader(props) {
        _classCallCheck(this, TreeHeader);

        return _possibleConstructorReturn(this, (TreeHeader.__proto__ || Object.getPrototypeOf(TreeHeader)).call(this, props));
    }

    _createClass(TreeHeader, [{
        key: 'selectRender',
        value: function selectRender(mode, onSelectAll, checked) {
            if (mode === 'checkbox') {
                return _react2['default'].createElement(
                    'th',
                    { onClick: function onClick() {
                            return onSelectAll(!checked);
                        }, style: { textAlign: 'center', width: 30 }, 'data-input': mode },
                    _react2['default'].createElement('input', { type: mode, checked: checked, readOnly: true })
                );
            } else if (mode === 'radio') {
                return _react2['default'].createElement('th', { 'data-input': mode });
            } else {
                return false;
            }
        }
    }, {
        key: 'colgroupRender',
        value: function colgroupRender(renderChildren, selectRow, isTree, left, right) {
            var _this2 = this;

            var i = 0;
            return _react2['default'].createElement(
                'colgroup',
                { ref: function ref(c) {
                        _this2._colgroup = c;
                    } },
                !!selectRow.mode && selectRow.mode !== 'none' && !selectRow.hideSelectColumn && !isTree && _react2['default'].createElement('col', { key: 'select', style: { textAlign: 'center', width: 30 } }),
                _react2['default'].Children.map(renderChildren, function (elm) {
                    if (!elm) return;
                    if (left && elm.props.dataFixed !== 'left') return;
                    if (right && elm.props.dataFixed !== 'right') return;
                    var style = {
                        width: elm.props.width,
                        maxWidth: elm.props.width,
                        textAlign: elm.props.dataAlign,
                        display: elm.props.hidden && 'none'
                    };
                    return _react2['default'].createElement('col', { key: i, style: style });
                })
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _props = this.props;
            var left = _props.left;
            var right = _props.right;
            var onSort = _props.onSort;
            var isTree = _props.isTree;
            var checked = _props.checked;
            var children = _props.children;
            var sortName = _props.sortName;
            var sortOrder = _props.sortOrder;
            var selectRow = _props.selectRow;
            var dataLength = _props.dataLength;
            var onSelectAll = _props.onSelectAll;

            var i = 0,
                colSpan = void 0,
                target = void 0;
            var renderChildren = _react2['default'].Children.toArray(children);
            renderChildren = (0, _Util.sort)(renderChildren).sorted;
            return _react2['default'].createElement(
                'div',
                { className: 'table-container table-header-container', ref: function ref(c) {
                        _this3._header = c;
                    } },
                _react2['default'].createElement(
                    'table',
                    { className: 'table table-bordered', ref: function ref(c) {
                            _this3._table = c;
                        } },
                    this.colgroupRender(renderChildren, selectRow, isTree, left, right),
                    _react2['default'].createElement(
                        'thead',
                        null,
                        _react2['default'].createElement(
                            'tr',
                            { ref: function ref(c) {
                                    _this3._thead = c;
                                } },
                            !isTree && !selectRow.hideSelectColumn && this.selectRender(selectRow.mode, onSelectAll, dataLength && checked),
                            _react2['default'].Children.map(renderChildren, function (elm) {
                                if (!elm) return;
                                if (left && elm.props.dataFixed !== 'left') return;
                                if (right && elm.props.dataFixed !== 'right') return;
                                if (colSpan && target < i && i < colSpan) {
                                    i++;
                                    return;
                                }
                                if (elm.props.colSpan) {
                                    target = i;
                                    colSpan = elm.props.colSpan + i;
                                }
                                return _react2['default'].cloneElement(elm, { key: i++, onSort: onSort, sortName: sortName, sortOrder: sortOrder });
                            })
                        )
                    )
                )
            );
        }
    }]);

    return TreeHeader;
}(_react.Component);

exports['default'] = TreeHeader;


TreeHeader.defaultProps = {
    left: 0,
    right: 0,
    selectRow: {
        mode: 'none',
        bgColor: '#dff0d8',
        selected: [],
        onSelect: _Util.empty,
        onSelectAll: _Util.empty
    }
};