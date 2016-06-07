'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TreeHead = require('./TreeHead.js');

var _TreeHead2 = _interopRequireDefault(_TreeHead);

var _TreeRow = require('./TreeRow.js');

var _TreeRow2 = _interopRequireDefault(_TreeRow);

var _Paging = require('./Paging.js');

var _Paging2 = _interopRequireDefault(_Paging);

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

var Component = _react2.default.Component;

var idCounter = 0;

function uniqueID() {
    return idCounter++ + new Date().getTime() + Math.random();
}

var TreeTable = function (_Component) {
    _inherits(TreeTable, _Component);

    function TreeTable(props) {
        _classCallCheck(this, TreeTable);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TreeTable).call(this, props));

        var data = props.data,
            key = props.iskey,
            hashKey = props.hashKey,
            dictionary = [],
            crtPage = 1;
        data.forEach(function (item) {
            item.__level = 0;
            if (hashKey) {
                item.__uid = uniqueID();
                dictionary.push(item.__uid);
                return;
            }
            dictionary.push(item[key]);
        });
        if (props.pagination && props.options.page) {
            crtPage = props.options.page;
        }
        _this.state = {
            width: 1 / props.headRow.length * 100 + '%',
            dictionary: dictionary,
            renderedList: data,
            crtPage: crtPage
        };
        return _this;
    }

    _createClass(TreeTable, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var data = nextProps.data,
                key = nextProps.iskey,
                hashKey = nextProps.hashKey,
                dictionary = [],
                crtPage = 1;
            data.forEach(function (item) {
                item.__level = 0;
                if (hashKey) {
                    item.__uid = uniqueID();
                    dictionary.push(item.__uid);
                    return;
                }
                dictionary.push(item[key]);
            });
            if (nextProps.pagination && nextProps.options.page) {
                crtPage = nextProps.options.page;
            }
            this.state = {
                width: 1 / nextProps.headRow.length * 100 + '%',
                dictionary: dictionary,
                renderedList: data,
                crtPage: crtPage
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
            var _this3 = this;

            var opened = option.opened;
            var data = option.data;

            this.props.handleClick(opened, data) || data;
            var iskey = this.props.iskey;
            var hashKey = this.props.hashKey;
            var childList = data.list || data.chdatalist || data.children;
            data.__opened = !data.__opened;
            if (!opened) {
                (function () {
                    var target = hashKey ? data.__uid : data[iskey];
                    var index = _this3.state.dictionary.indexOf(target) + 1;
                    _this3.setState(function (old) {
                        childList.forEach(function (item) {
                            item.__parent = data;
                            item.__opened = false;
                            item.__level = data.__level + 1;
                            var id = item[iskey];
                            if (_this3.props.hashKey) {
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
                childList = this.flatten(childList);
                this.setState(function (old) {
                    childList.forEach(function (item) {
                        item.__opened = true;
                        var id = _this3.props.hashKey ? item.__uid : item[iskey];
                        var i = old.dictionary.indexOf(id);
                        if (i > -1) {
                            old.dictionary.splice(i, 1);
                            old.renderedList.splice(i, 1);
                        }
                    });
                    return old;
                });
            }
        }
    }, {
        key: 'handleClick',
        value: function handleClick(event, nextPage) {
            this.setState(function (old) {
                old.crtPage = nextPage;
                return old;
            });
            this.props.options.onPageChange(event, this.state.crtPage, nextPage);
        }
    }, {
        key: 'bodyRender',
        value: function bodyRender() {
            var _this4 = this;

            var _state = this.state;
            var width = _state.width;
            var renderedList = _state.renderedList;
            var crtPage = _state.crtPage;
            var _props = this.props;
            var headRow = _props.headRow;
            var iskey = _props.iskey;
            var hashKey = _props.hashKey;
            var pagination = _props.pagination;
            var options = _props.options;


            if (renderedList.length < 1) {
                return _react2.default.createElement(
                    'div',
                    { className: 'table-row text-center clearfix' },
                    _react2.default.createElement(
                        'span',
                        null,
                        '暂无数据'
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
                    key: hashKey ? node.__uid : node[iskey],
                    level: node.__level,
                    iskey: iskey,
                    hashKey: hashKey,
                    cols: headRow,
                    width: width,
                    parent: node.__parent,
                    data: node,
                    open: node.__opened,
                    dataFormat: _this4.props.dataFormat,
                    onClick: _this4.handleToggle.bind(_this4)
                }));
            });
            return output;
        }
    }, {
        key: 'pagingRender',
        value: function pagingRender() {
            if (this.props.pagination) {
                return _react2.default.createElement(
                    'div',
                    { className: 'paging' },
                    _react2.default.createElement(_Paging2.default, { size: this.state.dictionary.length, length: this.props.options.sizePerPage, num: this.state.crtPage, click: this.handleClick.bind(this) })
                );
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { style: { padding: "10px", margin: "10px" } },
                _react2.default.createElement(
                    'div',
                    { className: 'table-tree table' },
                    _react2.default.createElement(_TreeHead2.default, { headRow: this.props.headRow, width: this.state.width }),
                    _react2.default.createElement(
                        'div',
                        { className: 'table-body clearfix' },
                        this.bodyRender()
                    )
                ),
                this.pagingRender()
            );
        }
    }]);

    return TreeTable;
}(Component);

exports.default = TreeTable;


TreeTable.defaultProps = {
    data: [],
    headRow: [],
    options: {
        sizePerPage: 10
    },
    handleClick: function handleClick(opened, data) {
        return data;
    }
};