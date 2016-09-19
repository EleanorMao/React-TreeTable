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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by BG236557 on 2016/9/19.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


function isObj(input) {
    return Object.prototype.toString.call(input) === '[object Object]';
}

var TreeHead = function (_Component) {
    _inherits(TreeHead, _Component);

    function TreeHead(props) {
        _classCallCheck(this, TreeHead);

        return _possibleConstructorReturn(this, (TreeHead.__proto__ || Object.getPrototypeOf(TreeHead)).call(this, props));
    }

    _createClass(TreeHead, [{
        key: 'nestedHeadRender',
        value: function nestedHeadRender(neseted, selectRow) {
            var output = [];
            var select = selectRow.mode !== 'none';
            neseted.map(function (throws, index) {
                var item = _react2.default.createElement(
                    'tr',
                    { key: 'trow' + index },
                    select && _react2.default.createElement('th', { key: 'trow-1' }),
                    throws.map(function (cell, i) {
                        var obj = isObj(cell);
                        return _react2.default.createElement(
                            'th',
                            { colSpan: obj && cell.colspan, key: i },
                            obj ? cell.label : cell
                        );
                    })
                );
                output.push(item);
            });
            return output;
        }
    }, {
        key: 'selectRender',
        value: function selectRender(selectRow, onSelectAll, checked) {
            var mode = selectRow.mode;
            if (mode === 'checkbox') {
                return _react2.default.createElement(
                    'th',
                    { onClick: function onClick() {
                            return onSelectAll(!checked);
                        } },
                    _react2.default.createElement('input', { type: mode, checked: checked, readOnly: true })
                );
            } else if (mode === 'radio') {
                return _react2.default.createElement('th', null);
            } else {
                return false;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var onSort = _props.onSort;
            var checked = _props.checked;
            var children = _props.children;
            var sortName = _props.sortName;
            var sortOrder = _props.sortOrder;
            var selectRow = _props.selectRow;
            var nestedHead = _props.nestedHead;
            var onSelectAll = _props.onSelectAll;

            var i = 0;
            return _react2.default.createElement(
                'table',
                { className: 'table table-bordered' },
                _react2.default.createElement(
                    'thead',
                    null,
                    !!nestedHead.length && this.nestedHeadRender(nestedHead, selectRow),
                    _react2.default.createElement(
                        'tr',
                        { ref: 'thead' },
                        this.selectRender(selectRow, onSelectAll, checked),
                        _react2.default.Children.map(children, function (elm) {
                            return _react2.default.cloneElement(elm, { key: i++, onSort: onSort, sortName: sortName, sortOrder: sortOrder });
                        })
                    )
                )
            );
        }
    }]);

    return TreeHead;
}(_react.Component);

exports.default = TreeHead;


TreeHead.defaultProps = {
    selectRow: {
        mode: 'none',
        bgColor: '#dff0d8',
        selected: [],
        onSelect: function onSelect() {},
        onSelectAll: function onSelectAll() {}
    }
};