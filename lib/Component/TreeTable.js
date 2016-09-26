'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TreeRow = require('./TreeRow');

var _TreeRow2 = _interopRequireDefault(_TreeRow);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _TreeHeader = require('./TreeHeader');

var _TreeHeader2 = _interopRequireDefault(_TreeHeader);

var _Pagination = require('./Pagination/Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _DropdownList = require('./Pagination/DropdownList');

var _DropdownList2 = _interopRequireDefault(_DropdownList);

var _NestedTreeHeader = require('./NestedTreeHeader');

var _NestedTreeHeader2 = _interopRequireDefault(_NestedTreeHeader);

var _Util = require('./Util');

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

var TreeTable = function (_Component) {
    _inherits(TreeTable, _Component);

    function TreeTable(props) {
        _classCallCheck(this, TreeTable);

        var _this = _possibleConstructorReturn(this, (TreeTable.__proto__ || Object.getPrototypeOf(TreeTable)).call(this, props));

        var data = _this._initDictionary(props);
        _this.state = {
            hover: null,
            order: undefined,
            sortField: undefined,
            renderedList: data.data,
            dictionary: data.dictionary,
            crtPage: props.pagination && props.options.page || 1,
            length: props.pagination && props.options.sizePerPage || 0
        };
        return _this;
    }

    _createClass(TreeTable, [{
        key: '_initDictionary',
        value: function _initDictionary(props) {
            var dictionary = [],
                key = props.iskey,
                hashKey = props.hashKey,
                data = props.data.slice();
            if (props.isTree) {
                data.forEach(function (item) {
                    if ((0, _Util.isUndefined)(item.__level)) item.__level = 0;
                    if (hashKey) {
                        if (!item.__uid) item.__uid = (0, _Util.uniqueID)();
                        dictionary.push(item.__uid);
                        return;
                    }
                    item.__opened = false;
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
        key: '_initColumnData',
        value: function _initColumnData() {
            var columnData = [];
            _react2.default.Children.map(this.props.children, function (column) {
                columnData.push({
                    width: column.props.width,
                    id: column.props.dataField,
                    name: column.props.children,
                    hidden: column.props.hidden,
                    showArrow: column.props.showArrow,
                    dataAlign: column.props.dataAlign,
                    dataFixed: column.props.dataFixed,
                    dataFormat: column.props.dataFormat
                });
            });
            var sortedData = (0, _Util.sort)(columnData);
            this.columnData = sortedData.sorted;
            this.leftColumnData = sortedData.left;
            this.rightColumnData = sortedData.right;
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
            var unavail = [],
                list = [];
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].hidden) {
                    unavail.push(i);
                }
                list.push(i);
            }
            var diffList = (0, _Util.diff)(list, unavail);
            return diffList[diffList.length - 1];
        }
    }, {
        key: '_sliceData',
        value: function _sliceData(data, page, length) {
            return data.slice((page - 1) * length, page * length);
        }
    }, {
        key: '_getKeyName',
        value: function _getKeyName() {
            var _props = this.props;
            var hashKey = _props.hashKey;
            var iskey = _props.iskey;

            return hashKey ? '__uid' : iskey;
        }
    }, {
        key: '_adjustWidth',
        value: function _adjustWidth() {
            var firstRow = this.refs.colgroup.childNodes;
            var cells = this.refs.thead.refs.thead.childNodes;
            var fixedLeftRow = this.refs.left && this.refs.left.childNodes;
            var fixedRightRow = this.refs.right && this.refs.right.childNodes;
            var nestedRow = this.refs.nested && this.refs.nested.refs.colgroup.childNodes;
            var fixedLeftHeadRow = this.refs.lthead && this.refs.lthead.refs.colgroup.childNodes;
            var fixedRightHeadRow = this.refs.rthead && this.refs.rthead.refs.colgroup.childNodes;
            var length = cells.length;

            if (firstRow.length !== length) return;

            var scrollBarWidth = (0, _Util.getScrollBarWidth)();
            var haveScrollBar = this.refs.body.offsetWidth !== this.refs.thead.refs.header.offsetWidth;
            var lastChild = this._getLastChild(this.columnData);
            lastChild = this.props.selectRow.mode !== 'none' ? lastChild + 1 : lastChild;

            for (var i = 0; i < length; i++) {
                var cell = cells[i];
                var computedStyle = getComputedStyle(cell);
                var width = parseFloat(computedStyle.width.replace('px', ''));
                if (!-[1]) {
                    var paddingLeftWidth = parseFloat(computedStyle.paddingLeft.replace('px', ''));
                    var paddingRightWidth = parseFloat(computedStyle.paddingRight.replace('px', ''));
                    var borderRightWidth = parseFloat(computedStyle.borderRightWidth.replace('px', ''));
                    var borderLeftWidth = parseFloat(computedStyle.borderLeftWidth.replace('px', ''));
                    width = width + paddingLeftWidth + paddingRightWidth + borderRightWidth + borderLeftWidth;
                }
                var lastPaddingWidth = -(lastChild === i && haveScrollBar ? scrollBarWidth : 0);
                if (!width) {
                    width = 120;
                    cell.width = width + lastPaddingWidth + 'px';
                }
                var result = (width + lastPaddingWidth).toFixed(2) + 'px';
                firstRow[i].style.width = result;
                firstRow[i].style.maxWidth = result;
                if (nestedRow && nestedRow[i]) {
                    var display = computedStyle.display;
                    nestedRow[i].style.width = result;
                    nestedRow[i].style.maxWidth = result;
                    if (display === 'none') nestedRow[i].style.display = display;
                }
                if (fixedLeftRow && fixedLeftRow[i]) {
                    fixedLeftRow[i].style.width = result;
                    fixedLeftRow[i].style.maxWidth = result;
                    fixedLeftHeadRow[i].style.width = result;
                    fixedLeftHeadRow[i].style.maxWidth = result;
                }
                if (fixedRightRow && fixedRightRow[i]) {
                    fixedRightRow[i].style.width = result;
                    fixedRightRow[i].style.maxWidth = result;
                    fixedRightHeadRow[i].style.width = result;
                    fixedRightHeadRow[i].style.maxWidth = result;
                }
            }

            if (fixedLeftRow || fixedRightHeadRow) {
                var tbody = this.refs.tbody.childNodes;
                var ltbody = this.refs.ltbody && this.refs.ltbody.childNodes;
                var rtbody = this.refs.rtbody && this.refs.rtbody.childNodes;
                var headHeight = getComputedStyle(this.refs.thead.refs.thead).height;
                if (this.refs.lthead) this.refs.lthead.refs.thead.style.height = headHeight;
                if (this.refs.rthead) this.refs.rthead.refs.thead.style.height = headHeight;
                for (var _i = 0; _i < tbody.length; _i++) {
                    var row = tbody[_i];
                    var height = getComputedStyle(row).height;
                    if (ltbody && ltbody[_i]) {
                        ltbody[_i].style.height = height;
                        ltbody[_i].style.maxHeight = height;
                    }
                    if (rtbody && rtbody[_i]) {
                        rtbody[_i].style.height = height;
                        rtbody[_i].style.maxHeight = height;
                    }
                }
            }
        }
    }, {
        key: '_scrollHeader',
        value: function _scrollHeader(e) {
            this.refs.thead.refs.header.scrollLeft = e.currentTarget.scrollLeft;
            if (this.refs.nested) this.refs.nested.refs.header.scrollLeft = e.currentTarget.scrollLeft;
        }
    }, {
        key: '_tryRender',
        value: function _tryRender() {
            var _props2 = this.props;
            var isTree = _props2.isTree;
            var iskey = _props2.iskey;
            var hashKey = _props2.hashKey;
            var selectRow = _props2.selectRow;
            var nestedHead = _props2.nestedHead;

            var warning = 'color:red';
            if (isTree && !(iskey || hashKey)) {
                throw new Error('You need choose one configuration to set key field: `iskey` or `hashkey`!!');
            }

            if (!isTree && hashKey) {
                console.warn('%c!Warning: If you set props `isTree` to `false`, `hashKey` need to be false and set props `iskey` instead!!', warning);
            }

            if (nestedHead.length && (this.leftColumnData.length || this.rightColumnData.length)) {
                console.warn('%c!Warning: Since you set props `nestedHead`, it\'s better not set `dataFixed` in `TreeHeadCol`', warning);
            }
            if (selectRow.mode !== 'none') {
                if (isTree) {
                    console.warn('%c!Warning: You need set prop `isTree` to `false`, if not `TreeTable` will not render select rows', warning);
                }
                if (selectRow.mode === 'radio' && selectRow.selected.length > 1) {
                    console.warn('%c!Warning: Since you set `selectRow.mode` to `radio`,' + '`selectRow.selected` should only have one child, if not `TreeTable` will use the first child of `selectRow.selected`', warning);
                }
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this._initColumnData();
            this._tryRender();
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
            this._initColumnData();
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
        value: function flatten(data, childrenPropertyName) {
            var _this2 = this;

            var output = [],
                index = 0;
            data.forEach(function (item) {
                var children = item[childrenPropertyName];
                if (children) {
                    output[index++] = item;
                    item = _this2.flatten(children, childrenPropertyName);
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
            var data = option.data;
            var opened = option.opened;

            var that = this;
            var _props3 = this.props;
            var iskey = _props3.iskey;
            var hashKey = _props3.hashKey;
            var childrenPropertyName = _props3.childrenPropertyName;

            var key = this._getKeyName();
            var callback = function callback() {
                var childList = data[childrenPropertyName];
                data.__opened = !data.__opened;
                if (!opened) {
                    (function () {
                        var target = data[key];
                        var index = that.state.dictionary.indexOf(target) + 1;
                        that.setState(function (old) {
                            childList && childList.forEach(function (item) {
                                item.__parent = data;
                                item.__opened = false;
                                item.__level = data.__level + 1;
                                var id = item[iskey];
                                if (hashKey) {
                                    if (!item.__uid) item.__uid = (0, _Util.uniqueID)();
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
                    childList = that.flatten(childList, childrenPropertyName);
                    that.setState(function (old) {
                        childList && childList.forEach(function (item) {
                            item.__opened = true;
                            var id = item[key];
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
            this.props.onArrowClick(opened, data, callback);
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

            var _props4 = this.props;
            var remote = _props4.remote;
            var onSortChange = _props4.onSortChange;

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
                        var ValueA = a[sortField];
                        var ValueB = b[sortField];
                        if (order === 'asc') {
                            if (typeof ValueA === 'string') {
                                return ValueA.localeCompare(ValueB);
                            } else {
                                return ValueA < ValueB ? -1 : ValueA > ValueB ? 1 : 0;
                            }
                        } else {
                            if (typeof ValueB === 'string') {
                                return ValueB.localeCompare(ValueA);
                            } else {
                                return ValueB < ValueA ? -1 : ValueB > ValueA ? 1 : 0;
                            }
                        }
                    });

                    dic = _this3._sortDictionary(list, _this3._getKeyName());
                    _this3.setState(function (old) {
                        old.order = order;
                        old.dictionary = dic;
                        old.renderedList = list;
                        old.sortField = sortField;
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
            var _props5 = this.props;
            var remote = _props5.remote;
            var options = _props5.options;

            var page = remote ? options.page : this.state.crtPage;
            if (!remote) {
                this.setState(function (old) {
                    old.length = length;
                    if (!remote && (page - 1) * length > old.renderedList.length) {
                        old.crtPage = 1;
                    }
                    return old;
                });
            }

            options.onPageChange && options.onPageChange(page, length);
            options.onSizePageChange && options.onSizePageChange(length);
        }
    }, {
        key: 'handleHover',
        value: function handleHover(hover) {
            this.setState(function (old) {
                old.hover = hover;
                return old;
            });
        }
    }, {
        key: 'colgroupRender',
        value: function colgroupRender(data, mode) {
            var output = [];
            if (mode !== 'none') {
                output.push(_react2.default.createElement('col', { key: 'select', style: { textAlign: 'center', width: 30 } }));
            }
            data.map(function (item, index) {
                var style = {
                    width: item.width,
                    maxWidth: item.width,
                    textAlign: item.dataAlign,
                    display: item.hidden && 'none'
                };
                output.push(_react2.default.createElement('col', { style: style, key: index }));
            });
            return output;
        }
    }, {
        key: 'rowsRender',
        value: function rowsRender(cols, hideSelectRow) {
            var _this4 = this;

            var _state2 = this.state;
            var hover = _state2.hover;
            var length = _state2.length;
            var crtPage = _state2.crtPage;
            var renderedList = _state2.renderedList;
            var _props6 = this.props;
            var iskey = _props6.iskey;
            var isTree = _props6.isTree;
            var remote = _props6.remote;
            var hashKey = _props6.hashKey;
            var selectRow = _props6.selectRow;
            var hoverStyle = _props6.hoverStyle;
            var pagination = _props6.pagination;
            var arrowRender = _props6.arrowRender;
            var startArrowCol = _props6.startArrowCol;

            var isSelect = selectRow.mode !== 'none';
            if (!renderedList.length) {
                return _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                        'td',
                        { className: 'text-center', colSpan: this.columnData.length },
                        _react2.default.createElement(
                            'span',
                            null,
                            '暂无数据'
                        )
                    )
                );
            }
            var output = [];
            if (pagination && !remote) renderedList = this._sliceData(renderedList, crtPage, length);
            var key = this._getKeyName();
            renderedList.forEach(function (node, i) {
                output.push(_react2.default.createElement(_TreeRow2.default, {
                    data: node,
                    cols: cols,
                    iskey: iskey,
                    key: node[key],
                    isTree: isTree,
                    hashKey: hashKey,
                    hover: hover === i,
                    level: node.__level,
                    open: node.__opened,
                    selectRow: selectRow,
                    parent: node.__parent,
                    hoverStyle: hoverStyle,
                    arrowCol: startArrowCol,
                    arrowRender: arrowRender,
                    hideSelectRow: hideSelectRow,
                    isSelect: !isTree && isSelect,
                    onClick: _this4.handleToggle.bind(_this4),
                    onMouseOver: _this4.handleHover.bind(_this4, i),
                    onMouseOut: _this4.handleHover.bind(_this4, null),
                    checked: selectRow.mode === 'checkbox' ? !!~selectRow.selected.indexOf(node[key]) : selectRow.selected[0] === node[key]
                }));
            });
            return output;
        }
    }, {
        key: 'bodyRender',
        value: function bodyRender(height, selectRow) {
            return _react2.default.createElement(
                'div',
                { className: 'table-container table-body-container', style: { height: height || 'auto' },
                    ref: 'container' },
                _react2.default.createElement(
                    'table',
                    { className: 'table table-bordered table-striped table-hover', ref: 'body' },
                    _react2.default.createElement(
                        'colgroup',
                        {
                            ref: 'colgroup' },
                        this.colgroupRender(this.columnData, selectRow.hideSelectRow ? 'none' : selectRow.mode)
                    ),
                    _react2.default.createElement(
                        'tbody',
                        { ref: 'tbody' },
                        this.rowsRender(this.columnData, selectRow.hideSelectRow)
                    )
                )
            );
        }
    }, {
        key: 'leftBodyRender',
        value: function leftBodyRender(height, selectRow) {
            if (this.leftColumnData.length) {
                return _react2.default.createElement(
                    'div',
                    { className: 'table-container table-body-container', style: { height: height || 'auto' } },
                    _react2.default.createElement(
                        'table',
                        { className: 'table table-bordered table-striped table-hover' },
                        _react2.default.createElement(
                            'colgroup',
                            {
                                ref: 'left' },
                            this.colgroupRender(this.leftColumnData, selectRow.hideSelectRow ? 'none' : selectRow.mode)
                        ),
                        _react2.default.createElement(
                            'tbody',
                            { ref: 'ltbody' },
                            this.rowsRender(this.leftColumnData, selectRow.hideSelectRow)
                        )
                    )
                );
            }
        }
    }, {
        key: 'rightBodyRender',
        value: function rightBodyRender(height) {
            if (this.rightColumnData.length) {
                return _react2.default.createElement(
                    'div',
                    { className: 'table-container table-body-container', style: { height: height || 'auto' } },
                    _react2.default.createElement(
                        'table',
                        { className: 'table table-bordered table-striped table-hover' },
                        _react2.default.createElement(
                            'colgroup',
                            { ref: 'right' },
                            this.colgroupRender(this.rightColumnData, 'none')
                        ),
                        _react2.default.createElement(
                            'tbody',
                            { ref: 'rtbody' },
                            this.rowsRender(this.rightColumnData, true)
                        )
                    )
                );
            }
        }
    }, {
        key: 'paginationTotalRender',
        value: function paginationTotalRender() {
            var _props7 = this.props;
            var data = _props7.data;
            var remote = _props7.remote;
            var options = _props7.options;
            var dataSize = _props7.dataSize;
            var pagination = _props7.pagination;

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
            var _props8 = this.props;
            var remote = _props8.remote;
            var options = _props8.options;
            var pagination = _props8.pagination;

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
            var _props9 = this.props;
            var remote = _props9.remote;
            var options = _props9.options;
            var dataSize = _props9.dataSize;
            var pagination = _props9.pagination;

            if (pagination) {
                return _react2.default.createElement(
                    'div',
                    { className: 'fr' },
                    remote ? _react2.default.createElement(_Pagination2.default, {
                        dataSize: dataSize,
                        current: options.page,
                        endLabel: options.endLabel,
                        prevLabel: options.prevLabel,
                        nextLabel: options.nextLabel,
                        startLabel: options.startLabel,
                        sizePerPage: options.sizePerPage,
                        onPageChange: options.onPageChange
                    }) : _react2.default.createElement(_Pagination2.default, {
                        endLabel: options.endLabel,
                        current: this.state.crtPage,
                        prevLabel: options.prevLabel,
                        nextLabel: options.nextLabel,
                        sizePerPage: this.state.length,
                        startLabel: options.startLabel,
                        dataSize: this.state.dictionary.length,
                        onPageChange: this.handleClick.bind(this)
                    })
                );
            }
        }
    }, {
        key: 'pagingRowRender',
        value: function pagingRowRender() {
            if (!this.props.pagination) return null;
            return _react2.default.createElement(
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
            );
        }
    }, {
        key: 'titleRender',
        value: function titleRender() {
            var title = this.props.title;
            if (!title) return null;
            return _react2.default.createElement(
                'div',
                { className: 'table-tree-title' },
                typeof title === 'function' ? title(this.props.data.slice()) : title
            );
        }
    }, {
        key: 'footerRender',
        value: function footerRender() {
            var footer = this.props.footer;
            if (!footer) return null;
            return _react2.default.createElement(
                'div',
                { className: 'table-tree-footer' },
                typeof footer === 'function' ? footer(this.props.data.slice()) : footer
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _props10 = this.props;
            var width = _props10.width;
            var isTree = _props10.isTree;
            var remote = _props10.remote;
            var height = _props10.height;
            var children = _props10.children;
            var sortName = _props10.sortName;
            var lineWrap = _props10.lineWrap;
            var selectRow = _props10.selectRow;
            var sortOrder = _props10.sortOrder;
            var nestedHead = _props10.nestedHead;
            var pagination = _props10.pagination;
            var _state3 = this.state;
            var order = _state3.order;
            var length = _state3.length;
            var crtPage = _state3.crtPage;
            var sortField = _state3.sortField;
            var renderedList = _state3.renderedList;


            var checked = false;

            if (selectRow.mode !== 'none') {
                var renderList = pagination && !remote ? this._sliceData(renderedList, crtPage, length) : renderedList.slice();
                checked = this._getAllValue(renderList.slice(), this._getKeyName()).sort().toString() === selectRow.selected.slice().sort().toString();
            }
            return _react2.default.createElement(
                'div',
                { className: "react-tree " + lineWrap },
                this.titleRender(),
                !!nestedHead.length && _react2.default.createElement(_NestedTreeHeader2.default, {
                    ref: 'nested', isTree: isTree, nestedHead: nestedHead,
                    selectRow: selectRow, lineWrap: lineWrap,
                    cols: this.columnData
                }),
                _react2.default.createElement(
                    'div',
                    { className: 'table-tree-wrapper', style: { width: width || '100%' } },
                    _react2.default.createElement(
                        'div',
                        { className: 'table-tree' },
                        _react2.default.createElement(
                            _TreeHeader2.default,
                            {
                                ref: 'thead', isTree: isTree,
                                onSelectAll: this.handleSelectAll.bind(this),
                                selectRow: selectRow, checked: checked,
                                sortOrder: remote ? sortOrder : order,
                                sortName: remote ? sortName : sortField,
                                onSort: this.handleSort.bind(this)
                            },
                            children
                        ),
                        this.bodyRender(height, selectRow)
                    ),
                    !!this.leftColumnData.length && _react2.default.createElement(
                        'div',
                        { className: 'table-tree table-fixed table-left-fixed' },
                        _react2.default.createElement(
                            _TreeHeader2.default,
                            {
                                ref: 'lthead', isTree: isTree, left: this.leftColumnData.length,
                                onSelectAll: this.handleSelectAll.bind(this),
                                selectRow: selectRow, checked: checked,
                                sortName: remote ? sortName : sortField,
                                sortOrder: remote ? sortOrder : order,
                                onSort: this.handleSort.bind(this)
                            },
                            children
                        ),
                        this.leftBodyRender(height, selectRow)
                    ),
                    !!this.rightColumnData.length && _react2.default.createElement(
                        'div',
                        { className: 'table-tree table-fixed table-right-fixed' },
                        _react2.default.createElement(
                            _TreeHeader2.default,
                            {
                                ref: 'rthead', isTree: isTree, right: this.rightColumnData.length,
                                sortName: remote ? sortName : sortField,
                                sortOrder: remote ? sortOrder : order,
                                onSort: this.handleSort.bind(this)
                            },
                            children
                        ),
                        this.rightBodyRender(height)
                    ),
                    this.footerRender()
                ),
                this.pagingRowRender()
            );
        }
    }]);

    return TreeTable;
}(_react.Component);

exports.default = TreeTable;


TreeTable.defaultProps = {
    data: [],
    dataSize: 0,
    hover: true,
    isTree: true,
    remote: false,
    nestedHead: [],
    startArrowCol: 0,
    lineWrap: 'ellipsis',
    pagination: false,
    onSortChange: _Util.empty,
    sortName: undefined,
    sortOrder: undefined,
    childrenPropertyName: 'list',
    hoverStyle: { backgroundColor: '#f5f5f5' },
    selectRow: {
        mode: 'none',
        selected: [],
        onSelect: _Util.empty,
        onSelectAll: _Util.empty,
        bgColor: '#dff0d8',
        hideSelectRow: false
    },
    options: {
        sizePerPage: 10,
        sizePageList: [10],
        onPageChange: _Util.empty,
        onSizePageChange: _Util.empty
    },
    onArrowClick: function onArrowClick(opened, data, callback) {
        callback(data);
    }
};

TreeTable.propTypes = {
    data: _react.PropTypes.array,
    remote: _react.PropTypes.bool,
    hover: _react.PropTypes.bool,
    isTree: _react.PropTypes.bool,
    hashKey: _react.PropTypes.bool,
    iskey: _react.PropTypes.string,
    dataSize: _react.PropTypes.number,
    pagination: _react.PropTypes.bool,
    arrowRender: _react.PropTypes.func,
    onArrowClick: _react.PropTypes.func,
    onSortChange: _react.PropTypes.func,
    hoverStyle: _react.PropTypes.object,
    startArrowCol: _react.PropTypes.number,
    childrenPropertyName: _react.PropTypes.string,
    lineWrap: _react.PropTypes.oneOf(['ellipsis', 'break']),
    nestedHead: _react.PropTypes.arrayOf(_react.PropTypes.array),
    width: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    height: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    title: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.node, _react.PropTypes.func, _react.PropTypes.element]),
    footer: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.node, _react.PropTypes.func, _react.PropTypes.element]),
    selectRow: _react.PropTypes.shape({
        mode: _react.PropTypes.oneOf(['none', 'radio', 'checkbox']),
        onSelect: _react.PropTypes.func,
        bgColor: _react.PropTypes.string,
        selected: _react.PropTypes.array,
        onSelectAll: _react.PropTypes.func,
        hideSelectRow: _react.PropTypes.bool
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