'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TreeRow = require('./TreeRow.js');

var _TreeRow2 = _interopRequireDefault(_TreeRow);

var _TreeHead = require('./TreeHead.js');

var _TreeHead2 = _interopRequireDefault(_TreeHead);

var _Pagination = require('./Pagination/Pagination.js');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _DropdownList = require('./Pagination/DropdownList');

var _DropdownList2 = _interopRequireDefault(_DropdownList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Elly on 2016/5/26.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Tree Table
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 4.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Author: Eleanor Mao
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * require bootstrap.css
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


require('../style/treetable.css');

var idCounter = 0;

function empty() {}

function uniqueID() {
    return idCounter++ + new Date().getTime() + Math.random();
}

function isUndefined(input) {
    return Object.prototype.toString.call(input) === "[object Undefined]";
}

function diff(a, b) {
    return a.filter(function (x) {
        return b.indexOf(x) === -1;
    });
}

function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';

    var outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 === w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return w1 - w2;
}

var TreeTable = function (_Component) {
    _inherits(TreeTable, _Component);

    function TreeTable(props) {
        _classCallCheck(this, TreeTable);

        var _this = _possibleConstructorReturn(this, (TreeTable.__proto__ || Object.getPrototypeOf(TreeTable)).call(this, props));

        var data = _this._initDictionary(props);
        _this.state = {
            order: undefined,
            sortField: undefined,
            renderedList: data.data,
            dictionary: data.dictionary,
            length: props.pagination && props.options.sizePerPage || 0,
            crtPage: props.pagination && props.options.page || 1
        };
        return _this;
    }

    _createClass(TreeTable, [{
        key: '_initDictionary',
        value: function _initDictionary(props) {
            var data = props.data.slice(),
                key = props.iskey,
                hashKey = props.hashKey,
                dictionary = [];
            if (props.isTree) {
                data.forEach(function (item) {
                    if (isUndefined(item.__level)) {
                        item.__level = 0;
                    }
                    if (hashKey) {
                        if (!item.__uid) {
                            item.__uid = uniqueID();
                        }
                        dictionary.push(item.__uid);
                        return;
                    }
                    dictionary.push(item[key]);
                });
            }
            return { data: data, dictionary: dictionary };
        }
    }, {
        key: '_sortDictionary',
        value: function _sortDictionary(data, key) {
            var dictionary = [];
            data.map(function (item) {
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
                    width: column.props.width,
                    id: column.props.dataField,
                    name: column.props.children,
                    hidden: column.props.hidden,
                    showArrow: column.props.showArrow,
                    dataAlign: column.props.dataAlign,
                    dataFormat: column.props.dataFormat
                });
            });
            this.columnDate = columnDate;
        }
    }, {
        key: '_getAllValue',
        value: function _getAllValue(data, iskey) {
            var output = [];
            for (var i = 0, len = data.length; i < len; i++) {
                output.push(data[i][iskey]);
            }
            return output;
        }
    }, {
        key: '_getLastChild',
        value: function _getLastChild(data) {
            var unvaild = [],
                list = [];
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].hidden) {
                    unvaild.push(i);
                }
                list.push(i);
            }
            var diffList = diff(list, unvaild);
            return diffList[diffList.length - 1];
        }
    }, {
        key: '_sliceData',
        value: function _sliceData(data, page, length) {
            return data.slice((page - 1) * length, page * length);
        }
    }, {
        key: '_adjustWidth',
        value: function _adjustWidth() {
            var tbody = this.refs.tbody;
            var scrollBarWidth = getScrollBarWidth();
            var firstRow = tbody.childNodes[0].childNodes;
            var cells = this.refs.thead.refs.thead.childNodes;
            var lastChild = this._getLastChild(this.columnDate);
            lastChild = this.props.selectRow.mode !== 'none' ? lastChild + 1 : lastChild;
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
                var lastPaddingWidth = -(lastChild === i ? scrollBarWidth : 0);
                var result = width + lastPaddingWidth + 'px';
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
            this.refs.container.removeEventListener('scroll', this._scrollHeader.bind(this));
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this._adjustWidth();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this._initColumnDate();
            var data = this._initDictionary(nextProps);
            this.setState({
                renderedList: data.data,
                dictionary: data.dictionary,
                length: nextProps.options.sizePerPage || 0,
                crtPage: nextProps.pagination && nextProps.options.page || this.state.crtPage
            });
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
        key: 'handleSelectAll',
        value: function handleSelectAll(checked) {
            if (checked) {
                this.props.selectRow.onSelectAll(checked, this.state.renderedList.slice());
            } else {
                this.props.selectRow.onSelectAll(checked, []);
            }
        }
    }, {
        key: 'handleSort',
        value: function handleSort(sortField, order) {
            var _this3 = this;

            var _props = this.props;
            var hashKey = _props.hashKey;
            var iskey = _props.iskey;
            var remote = _props.remote;
            var onSortChange = _props.onSortChange;

            if (remote) {
                onSortChange(sortField, order);
            } else {
                (function () {
                    var _state = _this3.state;
                    var dictionary = _state.dictionary;
                    var renderedList = _state.renderedList;


                    var dic = dictionary.slice();
                    var list = renderedList.slice();

                    list.sort(function (a, b) {
                        if (order === 'asc') {
                            return a[sortField] - b[sortField];
                        } else {
                            return b[sortField] - a[sortField];
                        }
                    });

                    var key = hashKey ? '__uid' : iskey;
                    dic = _this3._sortDictionary(list, key);

                    _this3.setState(function (old) {
                        old.dictionary = dic;
                        old.sortField = sortField;
                        old.renderedList = list;
                        old.order = order;
                        return old;
                    });

                    onSortChange(sortField, order);
                })();
            }
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
        key: 'handleFlip',
        value: function handleFlip(length) {
            var _props2 = this.props;
            var remote = _props2.remote;
            var options = _props2.options;

            var page = remote ? options.page : this.state.crtPage;
            if (!remote) {
                this.setState(function (old) {
                    old.length = length;
                    return old;
                });
            }

            options.onPageChange && options.onPageChange(page, length);
            options.onSizePageChange && options.onSizePageChange(length);
        }
    }, {
        key: 'bodyRender',
        value: function bodyRender() {
            var _this4 = this;

            var _state2 = this.state;
            var length = _state2.length;
            var crtPage = _state2.crtPage;
            var renderedList = _state2.renderedList;
            var _props3 = this.props;
            var iskey = _props3.iskey;
            var isTree = _props3.isTree;
            var remote = _props3.remote;
            var hashKey = _props3.hashKey;
            var selectRow = _props3.selectRow;
            var pagination = _props3.pagination;

            var isSelect = selectRow.mode !== 'none';
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
            if (pagination && !remote) {
                renderedList = this._sliceData(renderedList, crtPage, length);
            }
            renderedList.forEach(function (node) {
                var key = hashKey ? node.__uid : node[iskey];
                output.push(_react2.default.createElement(_TreeRow2.default, {
                    key: key,
                    data: node,
                    iskey: iskey,
                    isTree: isTree,
                    hashKey: hashKey,
                    isSelect: !isTree && isSelect,
                    level: node.__level,
                    open: node.__opened,
                    selectRow: selectRow,
                    parent: node.__parent,
                    cols: _this4.columnDate,
                    onClick: _this4.handleToggle.bind(_this4),
                    checked: selectRow.mode === 'checkbox' ? !!~selectRow.selected.indexOf(key) : selectRow.selected[0] === key
                }));
            });
            return output;
        }
    }, {
        key: 'paginationTotalRender',
        value: function paginationTotalRender() {
            var _props4 = this.props;
            var data = _props4.data;
            var remote = _props4.remote;
            var options = _props4.options;
            var dataSize = _props4.dataSize;
            var pagination = _props4.pagination;

            if (pagination && options.paginationShowsTotal) {
                var len = remote ? options.sizePerPage : this.state.length;
                var current = remote ? (options.page - 1) * len : (this.state.crtPage - 1) * len;
                var start = remote ? current + 1 : Math.min(data.length, current + 1);
                var to = remote ? current + data.length : Math.min(data.length, current + len);
                return _react2.default.createElement(
                    'div',
                    { style: { margin: '20px 0 0 20px ', display: 'inline-block' } },
                    options.paginationShowsTotal === true ? _react2.default.createElement(
                        'div',
                        null,
                        '显示 ',
                        start,
                        ' 至 ',
                        to,
                        '条 共',
                        data.length,
                        '条'
                    ) : options.paginationShowsTotal(start, to, dataSize)
                );
            }
        }
    }, {
        key: 'dropDownListRender',
        value: function dropDownListRender() {
            var _props5 = this.props;
            var remote = _props5.remote;
            var options = _props5.options;
            var pagination = _props5.pagination;

            var sizePageList = options.sizePageList;
            var length = sizePageList && sizePageList.length;
            if (pagination && (length > 1 || length === 1 && sizePageList[0] !== options.sizePerPage)) {
                if (remote) {
                    return _react2.default.createElement(
                        _DropdownList2.default,
                        { list: sizePageList,
                            onClick: this.handleFlip.bind(this) },
                        options.sizePerPage
                    );
                } else {
                    return _react2.default.createElement(
                        _DropdownList2.default,
                        { list: sizePageList, onClick: this.handleFlip.bind(this) },
                        this.state.length
                    );
                }
            }
        }
    }, {
        key: 'pagingRender',
        value: function pagingRender() {
            var _props6 = this.props;
            var remote = _props6.remote;
            var options = _props6.options;
            var dataSize = _props6.dataSize;
            var pagination = _props6.pagination;

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
                        sizePerPage: this.state.length,
                        dataSize: this.state.dictionary.length,
                        onPageChange: this.handleClick.bind(this)
                    })
                );
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props7 = this.props;
            var width = _props7.width;
            var iskey = _props7.iskey;
            var isTree = _props7.isTree;
            var remote = _props7.remote;
            var height = _props7.height;
            var hashKey = _props7.hashKey;
            var children = _props7.children;
            var sortName = _props7.sortName;
            var selectRow = _props7.selectRow;
            var sortOrder = _props7.sortOrder;
            var nestedHead = _props7.nestedHead;
            var pagination = _props7.pagination;
            var _state3 = this.state;
            var order = _state3.order;
            var length = _state3.length;
            var crtPage = _state3.crtPage;
            var sortField = _state3.sortField;
            var renderedList = _state3.renderedList;


            if (isTree && !(iskey || hashKey)) {
                throw new Error('You need choose one configuration to set key field: `iskey` or `hashkey`!!');
            }

            if (!isTree && hashKey) {
                throw new Error('If you set props `isTree` to `false`, `hashKey` need to be false and set props `iskey` instead!!');
            }

            var checked = false;
            if (selectRow.mode !== 'none') {
                if (isTree) {
                    throw new Error('!Warning: You need set prop `isTree` to `false`, if not `TreeTable` will not render select rows');
                }
                if (selectRow.mode === 'radio' && selectRow.selected.length > 1) {
                    throw new Error('!Warning: Since you set `selectRow.mode` to `radio`,' + '`selectRow.selected` should only have one child, if not `TreeTable` will use the first child of `selectRow.selected`');
                }

                var key = hashKey ? '__uid' : iskey;

                var renderList = renderedList.slice();

                if (pagination && !remote) {
                    renderList = this._sliceData(renderList, crtPage, length);
                }

                checked = this._getAllValue(renderList.slice(), key).sort().toString() === selectRow.selected.slice().sort().toString();
            }

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
                            _TreeHead2.default,
                            { selectRow: selectRow, nestedHead: nestedHead, ref: 'thead',
                                checked: checked, sortName: remote ? sortName : sortField,
                                sortOrder: remote ? sortOrder : order, isTree: isTree,
                                onSelectAll: this.handleSelectAll.bind(this),
                                onSort: this.handleSort.bind(this)
                            },
                            children
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
                        this.dropDownListRender(),
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
    isTree: true,
    remote: false,
    sortName: undefined,
    sortOrder: undefined,
    onSortChange: empty,
    selectRow: {
        mode: 'none',
        selected: [],
        onSelect: empty,
        onSelectAll: empty,
        bgColor: '#dff0d8'
    },
    nestedHead: [],
    options: {
        sizePerPage: 10,
        sizePageList: [10],
        onPageChange: empty,
        onSizePageChange: empty
    },
    dataSize: 0,
    pagination: false,
    handleClick: function handleClick(opened, data, callback) {
        callback(data);
    }
};

TreeTable.propTypes = {
    data: _react.PropTypes.array,
    remote: _react.PropTypes.bool,
    isTree: _react.PropTypes.bool,
    hashKey: _react.PropTypes.bool,
    iskey: _react.PropTypes.string,
    dataSize: _react.PropTypes.number,
    pagination: _react.PropTypes.bool,
    handleClick: _react.PropTypes.func,
    onSortChange: _react.PropTypes.func,
    nestedHead: _react.PropTypes.arrayOf(_react.PropTypes.array),
    width: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    height: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    selectRow: _react.PropTypes.shape({
        mode: _react.PropTypes.oneOf(['none', 'radio', 'checkbox']),
        bgColor: _react.PropTypes.string,
        selected: _react.PropTypes.array,
        onSelect: _react.PropTypes.func,
        onSelectAll: _react.PropTypes.func
    }),
    options: _react.PropTypes.shape({
        page: _react.PropTypes.number,
        onPageChange: _react.PropTypes.func,
        sizePerPage: _react.PropTypes.number,
        sizePageList: _react.PropTypes.array,
        onSizePageChange: _react.PropTypes.func,
        paginationShowsTotal: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func])
    })
};