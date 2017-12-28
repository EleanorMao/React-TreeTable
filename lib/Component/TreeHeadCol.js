'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SortGroup = function SortGroup() {
    return _react2['default'].createElement(
        'span',
        { className: 'order', key: 'sort-group' },
        _react2['default'].createElement(
            'span',
            { className: 'dropdown' },
            _react2['default'].createElement('span', { className: 'caret', style: { margin: '10px 0 10px 5px', color: '#ccc' } })
        ),
        _react2['default'].createElement(
            'span',
            { className: 'dropup' },
            _react2['default'].createElement('span', { className: 'caret', style: { margin: '10px 0', color: '#ccc' } })
        )
    );
};

var SingleSort = function SingleSort(sortOrder) {
    return _react2['default'].createElement(
        'span',
        { className: "order " + (sortOrder === 'desc' ? '' : 'dropup'), key: 'single-sort' },
        _react2['default'].createElement('span', { className: 'caret', style: { margin: '10px 0 10px 5px' } })
    );
};

var TreeHeadCol = function (_Component) {
    _inherits(TreeHeadCol, _Component);

    function TreeHeadCol(props) {
        _classCallCheck(this, TreeHeadCol);

        return _possibleConstructorReturn(this, (TreeHeadCol.__proto__ || Object.getPrototypeOf(TreeHeadCol)).call(this, props));
    }

    _createClass(TreeHeadCol, [{
        key: 'caretRender',
        value: function caretRender(dataField, sortName, sortOrder) {
            return dataField === sortName && sortOrder ? SingleSort(sortOrder) : SortGroup();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var width = _props.width;
            var hidden = _props.hidden;
            var onSort = _props.onSort;
            var colSpan = _props.colSpan;
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

            return _react2['default'].createElement(
                'th',
                { style: style, colSpan: colSpan || null,
                    onClick: dataSort ? function () {
                        return onSort(dataField, sortOrder === 'asc' ? 'desc' : 'asc');
                    } : function () {
                        return false;
                    } },
                _react2['default'].createElement(
                    'span',
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
    hidden: _propTypes2['default'].bool,
    dataSort: _propTypes2['default'].bool,
    colSpan: _propTypes2['default'].number,
    dataFormat: _propTypes2['default'].func,
    dataFixed: _propTypes2['default'].oneOf(['left', 'right', 'auto']),
    dataAlign: _propTypes2['default'].oneOf(['left', 'right', 'center']),
    width: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]),
    showArrow: _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].bool])
};

exports['default'] = TreeHeadCol;