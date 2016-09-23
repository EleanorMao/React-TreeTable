/**
 * Created by Elly on 2016/5/26.
 * Tree Table
 * @version 4.0
 * Author: Eleanor Mao
 * require bootstrap.css
 */
import React, {
    Component,
    PropTypes
} from 'react';
import TreeRow  from './TreeRow';
import TreeHead from './TreeHead';
import Paging   from './Pagination/Pagination';
import Dropdown from './Pagination/DropdownList';
import {empty, sort, uniqueID, isUndefined, diff, getScrollBarWidth} from './Util'

require('../style/treetable.css');

export default class TreeTable extends Component {
    constructor(props) {
        super(props);
        let data = this._initDictionary(props);
        this.state = {
            order: undefined,
            sortField: undefined,
            renderedList: data.data,
            dictionary: data.dictionary,
            length: props.pagination && props.options.sizePerPage || 0,
            crtPage: props.pagination && props.options.page || 1
        }
    }

    _initDictionary(props) {
        let data = props.data.slice(),
            key = props.iskey,
            hashKey = props.hashKey,
            dictionary = [];
        if (props.isTree) {
            data.forEach(item => {
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
        return {data, dictionary};
    }

    _sortDictionary(data, key) {
        let dictionary = [];
        data.map(item=> {
            dictionary.push(item[key]);
        });
        return dictionary;
    }

    _initColumnData() {
        let columnData = [];
        React.Children.map(this.props.children, function (column) {
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
        let sortedData = sort(columnData);
        this.columnData = sortedData.sorted;
        this.leftColumnData = sortedData.left;
        this.rightColumnData = sortedData.right;
    }

    _getAllValue(data, iskey) {
        let output = [];
        for (let i = 0, len = data.length; i < len; i++) {
            output.push(data[i][iskey]);
        }
        return output;
    }

    _getLastChild(data) {
        let unvaild = [],
            list = [];
        for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].hidden) {
                unvaild.push(i);
            }
            list.push(i);
        }
        let diffList = diff(list, unvaild);
        return diffList[diffList.length - 1];
    }

    _sliceData(data, page, length) {
        return data.slice((page - 1) * length, page * length);
    }

    _adjustWidth() {
        const cells = this.refs.thead.refs.thead.childNodes;
        const firstRow = this.refs.colgroup.childNodes;
        const length = cells.length;

        if (firstRow.length !== length) return;

        const scrollBarWidth = getScrollBarWidth();
        const haveScrollBar = this.refs.tbody.parentNode.offsetWidth !== this.refs.header.offsetWidth;

        let lastChild = this._getLastChild(this.columnData);
        lastChild = this.props.selectRow.mode !== 'none' ? lastChild + 1 : lastChild;

        for (let i = 0; i < length; i++) {
            const cell = cells[i];
            const computedStyle = getComputedStyle(cell);
            let width = parseFloat(computedStyle.width.replace('px', ''));
            if (!-[1,]) {
                const paddingLeftWidth = parseFloat(computedStyle.paddingLeft.replace('px', ''));
                const paddingRightWidth = parseFloat(computedStyle.paddingRight.replace('px', ''));
                const borderRightWidth = parseFloat(computedStyle.borderRightWidth.replace('px', ''));
                const borderLeftWidth = parseFloat(computedStyle.borderLeftWidth.replace('px', ''));
                width = width + paddingLeftWidth + paddingRightWidth + borderRightWidth + borderLeftWidth;
            }
            const lastPaddingWidth = -(lastChild === i && haveScrollBar ? scrollBarWidth : 0);
            if (!width) {
                width = 120;
                cell.width = width + lastPaddingWidth + 'px';
            }
            const result = width + lastPaddingWidth + 'px';
            firstRow[i].style.width = result;
            firstRow[i].style.minWidth = result;
            if (fixedRow && fixedRow[i]) {
                fixedRow[i].style.width = result;
                fixedRow[i].style.minWidth = result;
            }
        }
    }

    _scrollHeader(e) {
        this.refs.header.scrollLeft = e.currentTarget.scrollLeft;
    }

    componentWillMount() {
        this._initColumnData();
    }

    componentDidMount() {
        this._adjustWidth();
        window.addEventListener('resize', this._adjustWidth.bind(this));
        this.refs.container.addEventListener('scroll', this._scrollHeader.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._adjustWidth.bind(this));
        this.refs.container.removeEventListener('scroll', this._scrollHeader.bind(this));
    }

    componentDidUpdate() {
        this._adjustWidth();
    }

    componentWillReceiveProps(nextProps) {
        this._initColumnData();
        let data = this._initDictionary(nextProps);
        this.setState({
            renderedList: data.data,
            dictionary: data.dictionary,
            length: nextProps.options.sizePerPage || 0,
            crtPage: nextProps.pagination && nextProps.options.page || this.state.crtPage
        })
    }

    flatten(data) { //处理子节点数据
        let output = [],
            index = 0;
        data.forEach(item => {
            let children = item.list || item.chdatalist || item.children;
            if (children) {
                output[index++] = item;
                item = this.flatten(children);
                let j = 0,
                    len = item.length;
                output.length += len;
                while (j < len) {
                    output[index++] = item[j++]
                }
            } else {
                output[index++] = item;
            }
        });
        return output;
    }

    handleToggle(option) {
        const {
            opened,
            data
        } = option;
        let that = this;
        let iskey = this.props.iskey;
        let hashKey = this.props.hashKey;
        let callback = function () {
            let childList = data.list || data.chdatalist || data.children;
            data.__opened = !data.__opened;
            if (!opened) {
                let target = hashKey ? data.__uid : data[iskey];
                let index = that.state.dictionary.indexOf(target) + 1;
                that.setState(old => {
                    childList && childList.forEach(item => {
                        item.__parent = data;
                        item.__opened = false;
                        item.__level = data.__level + 1;
                        let id = item[iskey];
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
                })
            } else { //close
                childList = that.flatten(childList);
                that.setState(old => {
                    childList && childList.forEach(item => {
                        item.__opened = true;
                        let id = that.props.hashKey ? item.__uid : item[iskey];
                        let i = old.dictionary.indexOf(id);
                        if (i > -1) {
                            old.dictionary.splice(i, 1);
                            old.renderedList.splice(i, 1);
                        }
                    });
                    return old;
                })
            }
        };
        this.props.onArrowClick(opened, data, callback);
    }

    handleSelectAll(checked) {
        if (checked) {
            this.props.selectRow.onSelectAll(checked, this.state.renderedList.slice())
        } else {
            this.props.selectRow.onSelectAll(checked, [])
        }
    }

    handleSort(sortField, order) {
        const {hashKey, iskey, remote, onSortChange} = this.props;
        if (remote) {
            onSortChange(sortField, order)
        } else {
            const {dictionary, renderedList} = this.state;

            let dic = dictionary.slice();
            let list = renderedList.slice();

            list.sort((a, b) => {
                if (order === 'asc') {
                    return a[sortField] - b[sortField];
                } else {
                    return b[sortField] - a[sortField];
                }
            });

            const key = hashKey ? '__uid' : iskey;
            dic = this._sortDictionary(list, key);

            this.setState(old=> {
                old.dictionary = dic;
                old.sortField = sortField;
                old.renderedList = list;
                old.order = order;
                return old;
            });

            onSortChange(sortField, order);
        }
    }

    handleClick(page, sizePerPage) {
        this.setState(old => {
            old.crtPage = page;
            return old;
        });
        this.props.options.onPageChange(page, sizePerPage);
    }

    handleFlip(length) {
        const {remote, options} = this.props;
        const page = remote ? options.page : this.state.crtPage;
        if (!remote) {
            this.setState(old=> {
                old.length = length;
                return old;
            });
        }

        options.onPageChange && options.onPageChange(page, length);
        options.onSizePageChange && options.onSizePageChange(length);
    }

    colgroupRender(data) {
        let output = [];
        data.map((item, index) => {
            let style = {
                width: item.width,
                minWidth: item.width,
                textAlign: item.dataAlign,
                display: item.hidden && 'none'
            };
            output.push(
                <col style={style} key={index}/>
            )
        });
        return output;
    }

    bodyRender() {
        let {
            length,
            crtPage,
            renderedList
        } = this.state;
        let {
            iskey,
            isTree,
            remote,
            hashKey,
            selectRow,
            pagination,
            startArrowCol
        } = this.props;
        const isSelect = selectRow.mode !== 'none';
        if (renderedList.length < 1) {
            return (
                <tr>
                    <td className="text-center" colSpan={this.columnData.length}><span>暂无数据</span></td>
                </tr>
            );
        }
        let output = [];
        if (pagination && !remote) {
            renderedList = this._sliceData(renderedList, crtPage, length);
        }
        renderedList.forEach(node => {
            const key = hashKey ? node.__uid : node[iskey];
            output.push(
                <TreeRow
                    key={key}
                    data={node}
                    iskey={iskey}
                    isTree={isTree}
                    hashKey={hashKey}
                    level={node.__level}
                    open={node.__opened}
                    selectRow={selectRow}
                    parent={node.__parent}
                    cols={this.columnData}
                    arrowCol={startArrowCol}
                    isSelect={!isTree && isSelect}
                    onClick={this.handleToggle.bind(this)}
                    checked={selectRow.mode === 'checkbox' ?
                        !!~selectRow.selected.indexOf(key) :
                    selectRow.selected[0] === key
                    }
                />
            );
        });
        return output;
    }

    paginationTotalRender() {
        const {
            data,
            remote,
            options,
            dataSize,
            pagination
        } = this.props;
        if (pagination && options.paginationShowsTotal) {
            const len = remote ? options.sizePerPage : this.state.length;
            const current = remote ? (options.page - 1) * len : (this.state.crtPage - 1) * len;
            const start = remote ? current + 1 : Math.min(data.length, current + 1);
            const to = remote ? current + data.length : Math.min(data.length, current + len);
            return (
                <div style={{margin: '20px 0 0 20px ', display: 'inline-block'}}>
                    {
                        options.paginationShowsTotal === true ?
                            <div>显示 {start} 至 {to}条 共{data.length}条</div> :
                            options.paginationShowsTotal(start, to, dataSize)
                    }
                </div>
            )
        }
    }

    dropDownListRender() {
        const {
            remote,
            options,
            pagination
        } = this.props;
        const sizePageList = options.sizePageList;
        const length = sizePageList && sizePageList.length;
        if (pagination && (length > 1 || length === 1 && sizePageList[0] !== options.sizePerPage)) {
            if (remote) {
                return (
                    <Dropdown list={sizePageList}
                              onClick={this.handleFlip.bind(this)}>
                        {options.sizePerPage}
                    </Dropdown>);
            } else {
                return (
                    <Dropdown list={sizePageList} onClick={this.handleFlip.bind(this)}>
                        {this.state.length}
                    </Dropdown>
                );
            }
        }
    }

    pagingRender() {
        const {
            remote,
            options,
            dataSize,
            pagination
        } = this.props;
        if (pagination) {
            return (
                <div className="fr">
                    {  remote ?
                        <Paging
                            dataSize={dataSize}
                            current={options.page}
                            endLabel={options.endLabel}
                            prevLabel={options.prevLabel}
                            nextLabel={options.nextLabel}
                            startLabel={options.startLabel}
                            sizePerPage={options.sizePerPage}
                            onPageChange={options.onPageChange}
                        />
                        :
                        <Paging
                            endLabel={options.endLabel}
                            current={this.state.crtPage}
                            prevLabel={options.prevLabel}
                            nextLabel={options.nextLabel}
                            sizePerPage={this.state.length}
                            startLabel={options.startLabel}
                            dataSize={this.state.dictionary.length}
                            onPageChange={this.handleClick.bind(this)}
                        />
                    }
                </div>
            )
        }
    }

    render() {
        const {
            width,
            iskey,
            isTree,
            remote,
            height,
            hashKey,
            children,
            sortName,
            lineWrap,
            selectRow,
            sortOrder,
            nestedHead,
            pagination
        } = this.props;
        const {
            order,
            length,
            crtPage,
            sortField,
            renderedList
        } = this.state;

        if (isTree && !(iskey || hashKey)) {
            throw new Error('You need choose one configuration to set key field: `iskey` or `hashkey`!!');
        }

        if (!isTree && hashKey) {
            throw new Error('If you set props `isTree` to `false`, `hashKey` need to be false and set props `iskey` instead!!');
        }


        let checked = false;
        if (selectRow.mode !== 'none') {
            if (isTree) {
                throw new Error('!Warning: You need set prop `isTree` to `false`, if not `TreeTable` will not render select rows');
            }
            if (selectRow.mode === 'radio' && selectRow.selected.length > 1) {
                throw new Error(
                    '!Warning: Since you set `selectRow.mode` to `radio`,' +
                    '`selectRow.selected` should only have one child, if not `TreeTable` will use the first child of `selectRow.selected`'
                );
            }

            const key = hashKey ? '__uid' : iskey;

            let renderList = renderedList.slice();

            if (pagination && !remote) {
                renderList = this._sliceData(renderList, crtPage, length);
            }

            checked = this._getAllValue(renderList.slice(), key).sort().toString() === selectRow.selected.slice().sort().toString();
        }
        return (
            <div style={{padding: "10px", margin: "10px", width: width || '100%'}}>
                <div className={"table-tree " + lineWrap}>
                    <div className="table-container" style={{overflow: 'hidden'}} ref="header">
                        <TreeHead selectRow={selectRow} nestedHead={nestedHead} ref="thead"
                                  checked={checked} sortName={remote ? sortName : sortField}
                                  sortOrder={remote ? sortOrder : order} isTree={isTree}
                                  onSelectAll={this.handleSelectAll.bind(this)}
                                  onSort={this.handleSort.bind(this)}
                        >{children}</TreeHead>
                    </div>
                    <div className="table-container" style={{height: height || 'auto'}} ref="container">
                        <table className="table table-bordered table-striped table-hover">
                            <colgroup ref="colgroup">{this.colgroupRender(this.columnData)}</colgroup>
                            <tbody ref="tbody">{this.bodyRender()}</tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        {this.dropDownListRender()}
                        {this.paginationTotalRender()}
                    </div>
                    <div className="col-sm-6">
                        {this.pagingRender()}
                    </div>
                </div>
            </div>
        )
    }
}

TreeTable.defaultProps = {
    data: [],
    isTree: true,
    remote: false,
    sortName: undefined,
    startArrowCol: 0,
    sortOrder: undefined,
    onSortChange: empty,
    lineWrap: 'break',
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
    onArrowClick: (opened, data, callback) => {
        callback(data);
    }
};

TreeTable.propTypes = {
    data: PropTypes.array,
    remote: PropTypes.bool,
    isTree: PropTypes.bool,
    hashKey: PropTypes.bool,
    iskey: PropTypes.string,
    dataSize: PropTypes.number,
    pagination: PropTypes.bool,
    onArrowClick: PropTypes.func,
    onSortChange: PropTypes.func,
    startArrowCol: PropTypes.number,
    lineWrap: PropTypes.oneOf(['ellipsis', 'break']),
    nestedHead: PropTypes.arrayOf(PropTypes.array),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectRow: PropTypes.shape({
        mode: PropTypes.oneOf([
            'none',
            'radio',
            'checkbox'
        ]),
        bgColor: PropTypes.string,
        selected: PropTypes.array,
        onSelect: PropTypes.func,
        onSelectAll: PropTypes.func
    }),
    options: PropTypes.shape({
        page: PropTypes.number,
        onPageChange: PropTypes.func,
        sizePerPage: PropTypes.number,
        sizePageList: PropTypes.array,
        onSizePageChange: PropTypes.func,
        paginationShowsTotal: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
    })
};