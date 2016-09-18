'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TreeRow = require('./TreeRow.js');

var _TreeRow2 = _interopRequireDefault(_TreeRow);

var _Pagination = require('./Pagination/Pagination.js');

var _Pagination2 = _interopRequireDefault(_Pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Elly on 2016/5/26.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Tree Table
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 3.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Author: Eleanor Mao
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * require bootstrap.css
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * data: JSON Format Array,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * iskey: required,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * headRow: [key, key, ...] || [{id: , name: }, ...]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * dataFormat: {key: function, key: function, ...}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * hashKey: default false, in case of don't have a id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


require('../style/treetable.css');

var idCounter = 0;

function uniqueID() {
    return idCounter++ + new Date().getTime() + Math.random();
}

var TreeTable = function (_Component) {
    _inherits(TreeTable, _Component);

    function TreeTable(props) {
        _classCallCheck(this, TreeTable);

        var _this = _possibleConstructorReturn(this, (TreeTable.__proto__ || Object.getPrototypeOf(TreeTable)).call(this, props));

        _this.state = {
            renderedList: props.data.slice(),
            dictionary: _this._initDictionary(props),
            crtPage: props.pagination && props.options.page || 1
        };
        return _this;
    }

    _createClass(TreeTable, [{
        key: '_initDictionary',
        value: function _initDictionary(props) {
            var data = props.data,
                key = props.iskey,
                hashKey = props.hashKey,
                dictionary = [];
            data.forEach(function (item) {
                item.__level = 0;
                if (hashKey) {
                    item.__uid = uniqueID();
                    dictionary.push(item.__uid);
                    return;
                }
                dictionary.push(item[key]);
            });
            return dictionary;
        }
    }, {
        key: '_initColumnDate',
        value: function _initColumnDate() {
            var columnDate = [];
            _react2.default.Children.map(this.props.children, function (column) {
                columnDate.push({
                    id: column.props.dataField,
                    name: column.props.children,
                    hidden: column.props.hidden,
                    showArrow: column.props.showArrow,
                    dataFormat: column.props.dataFormat,
                    width: column.props.width
                });
            });
            this.columnDate = columnDate;
        }
    }, {
        key: '_adjustWidth',
        value: function _adjustWidth() {
            var tbody = this.refs.tbody;
            var firstRow = tbody.childNodes[0].childNodes;
            var cells = this.refs.thead.childNodes;
            for (var i = 0, len = cells.length; i < len; i++) {
                var cell = cells[i];
                var target = firstRow[i];
                var computedStyle = getComputedStyle(cell);
                var width = parseFloat(computedStyle.width.replace('px', ''));
                if (!-[1]) {
                    var paddingLeftWidth = parseFloat(computedStyle.paddingLeft.replace('px', ''));
                    var paddingRightWidth = parseFloat(computedStyle.paddingRight.replace('px', ''));
                    var borderRightWidth = parseFloat(computedStyle.borderRightWidth.replace('px', ''));
                    var borderLeftWidth = parseFloat(computedStyle.borderLeftWidth.replace('px', ''));
                    width = width + paddingLeftWidth + paddingRightWidth + borderRightWidth + borderLeftWidth;
                }
                var result = width + 'px';
                target.style.width = result;
                target.style.minWidth = result;
            }
        }
    }, {
        key: '_scrollHeader',
        value: function _scrollHeader(e) {
            this.refs.header.scrollLeft = e.currentTarget.scrollLeft;
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this._initColumnDate();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._adjustWidth();
            window.addEventListener('resize', this._adjustWidth.bind(this));
            this.refs.container.addEventListener('scroll', this._scrollHeader.bind(this));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this._adjustWidth.bind(this));
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this._initColumnDate();

            this.state = {
                renderedList: nextProps.data.slice(),
                dictionary: this._initDictionary(nextProps),
                crtPage: nextProps.pagination && nextProps.options.page || this.state.crtPage
            };
        }
    }, {
        key: 'flatten',
        value: function flatten(data) {
            var _this2 = this;

            //处理子节点数据
            var output = [],
                index = 0;
            data.forEach(function (item) {
                var children = item.list || item.chdatalist || item.children;
                if (children) {
                    output[index++] = item;
                    item = _this2.flatten(children);
                    var j = 0,
                        len = item.length;
                    output.length += len;
                    while (j < len) {
                        output[index++] = item[j++];
                    }
                } else {
                    output[index++] = item;
                }
            });
            return output;
        }
    }, {
        key: 'handleToggle',
        value: function handleToggle(option) {
            var opened = option.opened;
            var data = option.data;

            var that = this;
            var iskey = this.props.iskey;
            var hashKey = this.props.hashKey;
            var callback = function callback() {
                var childList = data.list || data.chdatalist || data.children;
                data.__opened = !data.__opened;
                if (!opened) {
                    (function () {
                        var target = hashKey ? data.__uid : data[iskey];
                        var index = that.state.dictionary.indexOf(target) + 1;
                        that.setState(function (old) {
                            childList.forEach(function (item) {
                                item.__parent = data;
                                item.__opened = false;
                                item.__level = data.__level + 1;
                                var id = item[iskey];
                                if (that.props.hashKey) {
                                    if (!item.__uid) {
                                        item.__uid = uniqueID();
                                    }
                                    id = item.__uid;
                                }
                                old.dictionary.splice(index, 0, id);
                                old.renderedList.splice(index++, 0, item);
                            });
                            return old;
                        });
                    })();
                } else {
                    //close
                    childList = that.flatten(childList);
                    that.setState(function (old) {
                        childList.forEach(function (item) {
                            item.__opened = true;
                            var id = that.props.hashKey ? item.__uid : item[iskey];
                            var i = old.dictionary.indexOf(id);
                            if (i > -1) {
                                old.dictionary.splice(i, 1);
                                old.renderedList.splice(i, 1);
                            }
                        });
                        return old;
                    });
                }
            };
            this.props.handleClick(opened, data, callback);
        }
    }, {
        key: 'handleClick',
        value: function handleClick(page, sizePerPage) {
            this.setState(function (old) {
                old.crtPage = page;
                return old;
            });
            this.props.options.onPageChange(page, sizePerPage);
        }
    }, {
        key: 'bodyRender',
        value: function bodyRender() {
            var _this3 = this;

            var _state = this.state;
            var crtPage = _state.crtPage;
            var renderedList = _state.renderedList;
            var _props = this.props;
            var iskey = _props.iskey;
            var options = _props.options;
            var headRow = _props.headRow;
            var hashKey = _props.hashKey;
            var pagination = _props.pagination;


            if (renderedList.length < 1) {
                return _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                        'td',
                        { className: 'text-center' },
                        _react2.default.createElement(
                            'span',
                            null,
                            '暂无数据'
                        )
                    )
                );
            }
            var output = [];
            if (pagination) {
                var len = options.sizePerPage;
                renderedList = renderedList.slice((crtPage - 1) * len, crtPage * len);
            }
            renderedList.forEach(function (node) {
                output.push(_react2.default.createElement(_TreeRow2.default, {
                    data: node,
                    iskey: iskey,
                    hashKey: hashKey,
                    level: node.__level,
                    open: node.__opened,
                    parent: node.__parent,
                    cols: _this3.columnDate,
                    onClick: _this3.handleToggle.bind(_this3),
                    key: hashKey ? node.__uid : node[iskey]
                }));
            });
            return output;
        }
    }, {
        key: 'paginationTotalRender',
        value: function paginationTotalRender() {
            var _props2 = this.props;
            var data = _props2.data;
            var remote = _props2.remote;
            var options = _props2.options;
            var dataSize = _props2.dataSize;
            var pagination = _props2.pagination;

            if (pagination && options.paginationShowsTotal) {
                var len = options.sizePerPage;
                var current = remote ? (options.page - 1) * len : (this.state.crtPage - 1) * len;
                var start = remote ? current + 1 : Math.min(data.length, current + 1);
                var to = remote ? current + data.length : Math.min(data.length, current + len);
                return _react2.default.createElement(
                    'div',
                    { style: { marginTop: 20 } },
                    options.paginationShowsTotal === true ? _react2.default.createElement(
                        'div',
                        null,
                        '当前第',
                        start,
                        '条 至 第',
                        to,
                        '条 共',
                        data.length,
                        '条'
                    ) : options.paginationShowsTotal(start, to, dataSize)
                );
            }
        }
    }, {
        key: 'pagingRender',
        value: function pagingRender() {
            var _props3 = this.props;
            var remote = _props3.remote;
            var options = _props3.options;
            var dataSize = _props3.dataSize;
            var pagination = _props3.pagination;

            if (pagination) {
                return _react2.default.createElement(
                    'div',
                    { className: 'fr' },
                    remote ? _react2.default.createElement(_Pagination2.default, {
                        dataSize: dataSize,
                        current: options.page,
                        sizePerPage: options.sizePerPage,
                        onPageChange: options.onPageChange
                    }) : _react2.default.createElement(_Pagination2.default, {
                        current: this.state.crtPage,
                        sizePerPage: options.sizePerPage,
                        dataSize: this.state.dictionary.length,
                        onPageChange: this.handleClick.bind(this)
                    })
                );
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props4 = this.props;
            var width = _props4.width;
            var height = _props4.height;
            var children = _props4.children;

            return _react2.default.createElement(
                'div',
                { style: { padding: "10px", margin: "10px", width: width || '100%' } },
                _react2.default.createElement(
                    'div',
                    { className: 'table-tree' },
                    _react2.default.createElement(
                        'div',
                        { className: 'table-container', style: { overflow: 'hidden' }, ref: 'header' },
                        _react2.default.createElement(
                            'table',
                            { className: 'table table-bordered' },
                            _react2.default.createElement(
                                'thead',
                                null,
                                _react2.default.createElement(
                                    'tr',
                                    { ref: 'thead' },
                                    children
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'table-container', style: { height: height || 'auto' }, ref: 'container' },
                        _react2.default.createElement(
                            'table',
                            { className: 'table table-bordered table-striped table-hover' },
                            _react2.default.createElement(
                                'tbody',
                                { ref: 'tbody' },
                                this.bodyRender()
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        this.paginationTotalRender()
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'col-sm-6' },
                        this.pagingRender()
                    )
                )
            );
        }
    }]);

    return TreeTable;
}(_react.Component);

exports.default = TreeTable;


TreeTable.defaultProps = {
    data: [],
    headRow: [],
    options: {
        sizePerPage: 10
    },
    dataSize: 0,
    handleClick: function handleClick(opened, data, callback) {
        callback(data);
    }
};