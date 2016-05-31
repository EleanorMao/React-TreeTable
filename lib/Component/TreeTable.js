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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


require('../style/treetable.css');

var Component = _react2.default.Component;

var TreeTable = function (_Component) {
    _inherits(TreeTable, _Component);

    function TreeTable(props) {
        _classCallCheck(this, TreeTable);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TreeTable).call(this, props));

        var data = props.data,
            key = props.iskey,
            dictionary = [];
        data.forEach(function (item) {
            item.level = 0;
            dictionary.push(item[key]);
        });
        _this.state = {
            width: 1 / props.headRow.length * 100 + '%',
            dictionary: dictionary,
            renderedList: data
        };
        return _this;
    }

    //update width, when headRow changed;


    _createClass(TreeTable, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var data = props.data,
                key = props.iskey,
                dictionary = [];
            data.forEach(function (item) {
                item.level = 0;
                dictionary.push(item[key]);
            });
            this.setState(function (old) {
                old.renderedList = data;
                old.dictionary = dictionary;
                old.width = 1 / nextProps.headRow.length * 100 + '%';
                return old;
            });
        }
    }, {
        key: 'flatten',
        value: function flatten(data) {
            var _this2 = this;

            var output = [],
                index = 0;
            data.forEach(function (item, i, list) {
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

            var display = option.display;
            var data = option.data;

            var iskey = this.props.iskey;
            var childList = data.list || data.chdatalist || data.children;
            if (!display) {
                (function () {
                    var target = data[iskey];
                    var index = _this3.state.dictionary.indexOf(target) + 1;
                    _this3.setState(function (old) {
                        childList.forEach(function (item) {
                            item.parent = data;
                            item.level = data.level + 1;
                            old.dictionary.splice(index, 0, item[iskey]);
                            old.renderedList.splice(index++, 0, item);
                        });
                        return old;
                    });
                })();
            } else {
                childList = this.flatten(childList);
                this.setState(function (old) {
                    childList.forEach(function (item) {
                        var i = old.dictionary.indexOf(item[iskey]);
                        if (i > -1) {
                            old.dictionary.splice(i, 1);
                            old.renderedList.splice(i, 1);
                        }
                    });
                });
            }
        }
    }, {
        key: 'bodyRender',
        value: function bodyRender() {
            var _this4 = this;

            var _state = this.state;
            var width = _state.width;
            var renderedList = _state.renderedList;
            var _props = this.props;
            var headRow = _props.headRow;
            var iskey = _props.iskey;


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
            renderedList.forEach(function (node) {
                output.push(_react2.default.createElement(_TreeRow2.default, {
                    key: node[iskey],
                    level: node.level,
                    iskey: iskey,
                    cols: headRow,
                    width: width,
                    parent: node.parent,
                    data: node,
                    onClick: _this4.handleToggle.bind(_this4)
                }));
            });
            return output;
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
                )
            );
        }
    }]);

    return TreeTable;
}(Component);

exports.default = TreeTable;


TreeTable.defaultProps = {
    data: []
};