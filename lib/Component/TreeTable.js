'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TreeRow = require('./TreeRow');

var _TreeRow2 = _interopRequireDefault(_TreeRow);

var _TreeHeader = require('./TreeHeader');

var _TreeHeader2 = _interopRequireDefault(_TreeHeader);

var _NestedTreeHeader = require('./NestedTreeHeader');

var _NestedTreeHeader2 = _interopRequireDefault(_NestedTreeHeader);

var _Pagination = require('./Pagination/Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _DropdownList = require('./Pagination/DropdownList');

var _DropdownList2 = _interopRequireDefault(_DropdownList);

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
            isHover: null,
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
                data = props.data.slice();
            var uid = props.uid;
            var iskey = props.iskey;
            var isTree = props.isTree;
            var hashKey = props.hashKey;
            var expandAll = props.expandAll;
            var expandRowKeys = props.expandRowKeys;
            var childrenPropertyName = props.childrenPropertyName;

            var keyName = hashKey ? uid : iskey;
            if (isTree) {
                if (expandAll) {
                    dictionary = this._recursion(data, hashKey, keyName, childrenPropertyName);
                } else if (expandRowKeys && expandRowKeys.length) {
                    dictionary = expandRowKeys.slice();
                }
            }
            return { data: data, dictionary: dictionary };
        }
    }, {
        key: '_recursion',
        value: function _recursion(data, hashKey, keyName, childrenPropertyName) {
            var dictionary = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (hashKey && !item[keyName]) item[keyName] = (0, _Util.uniqueID)(); //引用大法好
                if (item[childrenPropertyName] && item[childrenPropertyName].length) {
                    dictionary.push(item[keyName]);
                    data = data.concat(item[childrenPropertyName]);
                }
            }
            return dictionary;
        }
    }, {
        key: '_flatten',
        value: function _flatten(data, childrenPropertyName, hashKey, keyName) {
            var output = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (hashKey && !item[keyName]) item[keyName] = (0, _Util.uniqueID)();
                if (item[childrenPropertyName]) {
                    output.push(item[keyName]);
                    data = data.concat(item[childrenPropertyName]);
                }
            }
            return output;
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
            var uid = _props.uid;

            return hashKey ? uid : iskey;
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
                if (fixedRightRow && fixedRightRow[i] && !cell.dataset.input) {
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
        key: 'handleToggle',
        value: function handleToggle(option) {
            var _this2 = this;

            var data = option.data;
            var open = option.open;
            var parent = option.parent;

            var that = this;
            var _props3 = this.props;
            var hashKey = _props3.hashKey;
            var clickToCloseAll = _props3.clickToCloseAll;
            var childrenPropertyName = _props3.childrenPropertyName;

            var keyName = this._getKeyName();
            var callback = function callback(data) {
                var childList = data && data[childrenPropertyName] || [];
                if (clickToCloseAll) {
                    childList = _this2._flatten(childList, childrenPropertyName, hashKey, keyName);
                }
                if (!open) {
                    that.setState(function (old) {
                        if (hashKey && !data[keyName]) data[keyName] = (0, _Util.uniqueID)();
                        old.dictionary.push(data[keyName]);
                        return old;
                    });
                } else {
                    that.setState(function (old) {
                        old.dictionary.splice(old.dictionary.indexOf(data[keyName]), 1);
                        clickToCloseAll && childList && childList.forEach(function (item) {
                            var index = old.dictionary.indexOf(item);
                            if (~index) {
                                old.dictionary.splice(index, 1);
                            }
                        });
                        return old;
                    });
                }
            };
            this.props.onArrowClick(open, data, callback, parent);
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
                    var renderedList = _this3.state.renderedList;


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

                    _this3.setState(function (old) {
                        old.order = order;
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
                old.isHover = hover;
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
        value: function rowsRender(data, cols, level, parent, hideSelectRow, right) {
            var _state = this.state;
            var isHover = _state.isHover;
            var dictionary = _state.dictionary;
            var _props6 = this.props;
            var hover = _props6.hover;
            var iskey = _props6.iskey;
            var isTree = _props6.isTree;
            var hashKey = _props6.hashKey;
            var selectRow = _props6.selectRow;
            var hoverStyle = _props6.hoverStyle;
            var arrowRender = _props6.arrowRender;
            var startArrowCol = _props6.startArrowCol;
            var childrenPropertyName = _props6.childrenPropertyName;

            var isSelect = selectRow.mode !== 'none';
            var keyName = this._getKeyName();
            var output = [];

            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    var node = data[i];
                    if (hashKey && !node[keyName]) node[keyName] = (0, _Util.uniqueID)();
                    var key = node[keyName];
                    var opened = !!~dictionary.indexOf(key);
                    output.push(_react2.default.createElement(_TreeRow2.default, {
                        key: key,
                        data: node,
                        cols: cols,
                        level: level,
                        iskey: iskey,
                        open: opened,
                        parent: parent,
                        isTree: isTree,
                        hashKey: hashKey,
                        selectRow: selectRow,
                        hover: isHover === key,
                        hoverStyle: hoverStyle,
                        arrowRender: arrowRender,
                        hideSelectRow: hideSelectRow,
                        isSelect: !isTree && isSelect,
                        onClick: this.handleToggle.bind(this),
                        arrowCol: right ? null : startArrowCol,
                        childrenPropertyName: childrenPropertyName,
                        onMouseOut: hover ? this.handleHover.bind(this, null) : function () {},
                        onMouseOver: hover ? this.handleHover.bind(this, key) : function () {},
                        checked: selectRow.mode === 'checkbox' ? !!~selectRow.selected.indexOf(key) : selectRow.selected[0] === key
                    }));
                    if (opened) {
                        output = output.concat(this.rowsRender(node[childrenPropertyName], cols, level + 1, node, hideSelectRow, right));
                    }
                }
            }
            return output;
        }
    }, {
        key: 'blankRender',
        value: function blankRender(data, colSpan, showText) {
            if (data.length) return null;
            return _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                    'td',
                    { className: 'text-center', colSpan: colSpan },
                    showText && this.props.noDataText
                )
            );
        }
    }, {
        key: 'bodyRender',
        value: function bodyRender(data, height, selectRow) {
            return _react2.default.createElement(
                'div',
                { className: 'table-container table-body-container', style: { height: height || 'auto' },
                    ref: 'container' },
                _react2.default.createElement(
                    'table',
                    { className: 'table table-bordered table-striped table-hover', ref: 'body' },
                    _react2.default.createElement(
                        'colgroup',
                        { ref: 'colgroup' },
                        this.colgroupRender(this.columnData, selectRow.hideSelectRow ? 'none' : selectRow.mode)
                    ),
                    _react2.default.createElement(
                        'tbody',
                        { ref: 'tbody' },
                        this.blankRender(data, this.columnData.length, true),
                        this.rowsRender(data, this.columnData, 0, null, selectRow.hideSelectRow)
                    )
                )
            );
        }
    }, {
        key: 'leftBodyRender',
        value: function leftBodyRender(data, height, selectRow) {
            if (this.leftColumnData.length) {
                return _react2.default.createElement(
                    'div',
                    { className: 'table-container table-body-container', style: { height: height || 'auto' } },
                    _react2.default.createElement(
                        'table',
                        { className: 'table table-bordered table-striped table-hover' },
                        _react2.default.createElement(
                            'colgroup',
                            { ref: 'left' },
                            this.colgroupRender(this.leftColumnData, selectRow.hideSelectRow ? 'none' : selectRow.mode)
                        ),
                        _react2.default.createElement(
                            'tbody',
                            { ref: 'ltbody' },
                            this.blankRender(data, this.leftColumnData.length),
                            this.rowsRender(data, this.leftColumnData, 0, null, selectRow.hideSelectRow)
                        )
                    )
                );
            }
        }
    }, {
        key: 'rightBodyRender',
        value: function rightBodyRender(data, height) {
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
                            this.blankRender(data, this.rightColumnData.length),
                            this.rowsRender(data, this.rightColumnData, 0, null, true, true)
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
                        remote ? dataSize : data.length,
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
                        paginationSize: options.paginationSize,
                        onPageChange: options.onPageChange
                    }) : _react2.default.createElement(_Pagination2.default, {
                        endLabel: options.endLabel,
                        current: this.state.crtPage,
                        prevLabel: options.prevLabel,
                        nextLabel: options.nextLabel,
                        sizePerPage: this.state.length,
                        startLabel: options.startLabel,
                        dataSize: this.props.data.length,
                        paginationSize: options.paginationSize,
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
            var _state2 = this.state;
            var order = _state2.order;
            var length = _state2.length;
            var crtPage = _state2.crtPage;
            var sortField = _state2.sortField;
            var renderedList = _state2.renderedList;


            var checked = false;
            var renderList = pagination && !remote ? this._sliceData(renderedList, crtPage, length) : renderedList.slice();
            if (selectRow.mode !== 'none') {
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
                        this.bodyRender(renderList, height, selectRow)
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
                        this.leftBodyRender(renderList, height, selectRow)
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
                        this.rightBodyRender(renderList, height)
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
    uid: '__uid',
    remote: false,
    nestedHead: [],
    startArrowCol: 0,
    expandAll: false,
    pagination: false,
    onSortChange: _Util.empty,
    sortName: undefined,
    sortOrder: undefined,
    lineWrap: 'ellipsis',
    clickToCloseAll: true,
    childrenPropertyName: 'list',
    noDataText: _react2.default.createElement(
        'span',
        null,
        '暂无数据'
    ),
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
        paginationSize: 6,
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
    uid: _react.PropTypes.string,
    isTree: _react.PropTypes.bool,
    hashKey: _react.PropTypes.bool,
    iskey: _react.PropTypes.string,
    expandAll: _react.PropTypes.bool,
    dataSize: _react.PropTypes.number,
    pagination: _react.PropTypes.bool,
    arrowRender: _react.PropTypes.func,
    onArrowClick: _react.PropTypes.func,
    onSortChange: _react.PropTypes.func,
    hoverStyle: _react.PropTypes.object,
    expandRowKeys: _react.PropTypes.array,
    startArrowCol: _react.PropTypes.number,
    clickToCloseAll: _react.PropTypes.bool,
    childrenPropertyName: _react.PropTypes.string,
    nestedHead: _react.PropTypes.arrayOf(_react.PropTypes.array),
    lineWrap: _react.PropTypes.oneOf(['ellipsis', 'break']),
    width: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    height: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    title: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.node, _react.PropTypes.func, _react.PropTypes.element]),
    footer: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.node, _react.PropTypes.func, _react.PropTypes.element]),
    noDataText: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.node, _react.PropTypes.func, _react.PropTypes.element]),
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
        paginationSize: _react.PropTypes.number,
        paginationShowsTotal: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func])
    })
};