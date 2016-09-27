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
import TreeRow from './TreeRow';
import TreeHeader from './TreeHeader';
import Paging from './Pagination/Pagination';
import Dropdown from './Pagination/DropdownList';
import NestedTreeHeader from './NestedTreeHeader';
import {
    empty,
    sort,
    uniqueID,
    diff,
    getScrollBarWidth
} from './Util'

require('../style/treetable.css');

export default class TreeTable extends Component {
    constructor(props) {
        super(props);
        let data = this._initDictionary(props);
        this.state = {
            isHover: null,
            order: undefined,
            sortField: undefined,
            dictionary: data.dictionary,
            allKeys: data.allKeys,
            renderedList: props.data.slice(),
            crtPage: props.pagination && props.options.page || 1,
            length: props.pagination && props.options.sizePerPage || 0
        }
    }

    _initDictionary(props) {
        let dictionary = [];
        let data = props.data.slice();
        const {
            iskey,
            hashKey,
            selectRow,
            expandAll,
            childrenPropertyName
        } = props;
        let keyName = hashKey ? '__uid' : iskey;
        let isSelect = selectRow.mode && selectRow.mode !== 'none';
        let initData, allKeys;
        if (hashKey || isSelect || expandAll) {
            initData = this._recursion(data, hashKey, keyName, childrenPropertyName, isSelect, expandAll);
        }
        if (expandAll) {
            dictionary = initData && initData.dictionary || [];
        } else {
            dictionary = props.expandRowKeys.slice();
        }
        allKeys = initData.allKeys;
        return {dictionary, allKeys};
    }

    _recursion(data, hashKey, keyName, childrenPropertyName, getAllValue, getDic) {
        let dictionary = [];
        let allKeys = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (hashKey && !item[keyName]) item.__uid = uniqueID();
            if (getAllValue) {
                allKeys.push(item[keyName]);
            }
            if (item[childrenPropertyName] && item[childrenPropertyName].length) {
                if (getDic) {
                    dictionary.push(item[keyName]);
                }
                data = data.concat(item[childrenPropertyName]);
            }
        }
        return {dictionary, allKeys};
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

    _getLastChild(data) {
        let unavail = [],
            list = [];
        for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].hidden) {
                unavail.push(i);
            }
            list.push(i);
        }
        let diffList = diff(list, unavail);
        return diffList[diffList.length - 1];
    }

    _sliceData(data, page, length) {
        return data.slice((page - 1) * length, page * length);
    }

    _getKeyName() {
        const {
            hashKey,
            iskey
        } = this.props;
        return hashKey ? '__uid' : iskey;
    }

    _adjustWidth() {
        const firstRow = this.refs.colgroup.childNodes;
        const cells = this.refs.thead.refs.thead.childNodes;
        const fixedLeftRow = this.refs.left && this.refs.left.childNodes;
        const fixedRightRow = this.refs.right && this.refs.right.childNodes;
        const nestedRow = this.refs.nested && this.refs.nested.refs.colgroup.childNodes;
        const fixedLeftHeadRow = this.refs.lthead && this.refs.lthead.refs.colgroup.childNodes;
        const fixedRightHeadRow = this.refs.rthead && this.refs.rthead.refs.colgroup.childNodes;
        const length = cells.length;

        if (firstRow.length !== length) return;

        const scrollBarWidth = getScrollBarWidth();
        const haveScrollBar = this.refs.body.offsetWidth !== this.refs.thead.refs.header.offsetWidth;
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
            const result = (width + lastPaddingWidth).toFixed(2) + 'px';
            firstRow[i].style.width = result;
            firstRow[i].style.maxWidth = result;
            if (nestedRow && nestedRow[i]) {
                const display = computedStyle.display;
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
            const tbody = this.refs.tbody.childNodes;
            const ltbody = this.refs.ltbody && this.refs.ltbody.childNodes;
            const rtbody = this.refs.rtbody && this.refs.rtbody.childNodes;
            const headHeight = getComputedStyle(this.refs.thead.refs.thead).height;
            if (this.refs.lthead) this.refs.lthead.refs.thead.style.height = headHeight;
            if (this.refs.rthead) this.refs.rthead.refs.thead.style.height = headHeight;
            for (let i = 0; i < tbody.length; i++) {
                let row = tbody[i];
                let height = getComputedStyle(row).height;
                if (ltbody && ltbody[i]) {
                    ltbody[i].style.height = height;
                    ltbody[i].style.maxHeight = height;
                }
                if (rtbody && rtbody[i]) {
                    rtbody[i].style.height = height;
                    rtbody[i].style.maxHeight = height;
                }
            }
        }
    }

    _scrollHeader(e) {
        this.refs.thead.refs.header.scrollLeft = e.currentTarget.scrollLeft;
        if (this.refs.nested) this.refs.nested.refs.header.scrollLeft = e.currentTarget.scrollLeft;
    }

    _tryRender() {
        const {
            isTree,
            iskey,
            hashKey,
            selectRow,
            nestedHead
        } = this.props;
        const warning = 'color:red';
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
            // if (isTree) {
            //     console.warn('%c!Warning: You need set prop `isTree` to `false`, if not `TreeTable` will not render select rows', warning);
            // }
            if (selectRow.mode === 'radio' && selectRow.selected.length > 1) {
                console.warn(
                    '%c!Warning: Since you set `selectRow.mode` to `radio`,' +
                    '`selectRow.selected` should only have one child, if not `TreeTable` will use the first child of `selectRow.selected`',
                    warning
                );
            }
        }
    }

    componentWillMount() {
        this._initColumnData();
        this._tryRender();
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
            dictionary: data.dictionary,
            allKeys: data.allKeys,
            renderedList: nextProps.data.slice(),
            length: nextProps.options.sizePerPage || 0,
            crtPage: nextProps.pagination && nextProps.options.page || this.state.crtPage
        })
    }

    _flatten(data, childrenPropertyName) {
        let output = [],
            index = 0;
        data.forEach(item => {
            let children = item[childrenPropertyName];
            if (children) {
                output[index++] = item;
                item = this._flatten(children, childrenPropertyName);
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
            data,
            opened
        } = option;
        const that = this;
        const key = this._getKeyName();
        const {
            clickToCloseAll,
            childrenPropertyName
        } = this.props;
        let childList = data[childrenPropertyName];
        if (clickToCloseAll) {
            childList = this._flatten(childList, childrenPropertyName);
        }
        let callback = function () {
            if (!opened) {
                that.setState(old => {
                    old.dictionary.push(data[key]);
                    return old;
                })
            } else {
                that.setState(old => {
                    old.dictionary.splice(old.dictionary.indexOf(data[key]), 1);
                    clickToCloseAll && childList && childList.forEach(item => {
                        let index = old.dictionary.indexOf(item[key]);
                        if (~index) {
                            old.dictionary.splice(index, 1);
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
        const {
            remote,
            onSortChange
        } = this.props;
        if (remote) {
            onSortChange(sortField, order)
        } else {
            const {
                renderedList
            } = this.state;

            let list = renderedList.slice();

            list.sort((a, b) => {
                let ValueA = a[sortField];
                let ValueB = b[sortField];
                if (order === 'asc') {
                    if (typeof ValueA === 'string') {
                        return ValueA.localeCompare(ValueB);
                    } else {
                        return ValueA < ValueB ? -1 : (ValueA > ValueB ? 1 : 0);
                    }
                } else {
                    if (typeof ValueB === 'string') {
                        return ValueB.localeCompare(ValueA);
                    } else {
                        return ValueB < ValueA ? -1 : (ValueB > ValueA ? 1 : 0);
                    }
                }
            });

            this.setState(old => {
                old.order = order;
                old.renderedList = list;
                old.sortField = sortField;
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
        const {
            remote,
            options
        } = this.props;
        const page = remote ? options.page : this.state.crtPage;
        if (!remote) {
            this.setState(old => {
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

    handleHover(hover) {
        this.setState(old => {
            old.isHover = hover;
            return old;
        })
    }

    colgroupRender(data, mode) {
        let output = [];
        if (mode !== 'none') {
            output.push(<col key="select" style={{textAlign: 'center', width: 30}}/>)
        }
        data.map((item, index) => {
            let style = {
                width: item.width,
                maxWidth: item.width,
                textAlign: item.dataAlign,
                display: item.hidden && 'none'
            };
            output.push(
                <col style={style} key={index}/>
            )
        });
        return output;
    }

    rowsRender(renderedList, cols, level, hideSelectRow, right) {
        const {
            isHover,
            dictionary
        } = this.state;
        const {
            hover,
            iskey,
            isTree,
            hashKey,
            selectRow,
            hoverStyle,
            arrowRender,
            startArrowCol,
            childrenPropertyName
        } = this.props;
        const isSelect = selectRow.mode !== 'none';
        const keyName = this._getKeyName();
        let output = [];

        if (renderedList.length) {
            for (let i = 0; i < renderedList.length; i++) {
                let node = renderedList[i];
                let key = node[keyName];
                let opened = !!~dictionary.indexOf(key);
                output.push(
                    < TreeRow
                        key={key}
                        data={node}
                        cols={cols}
                        level={level}
                        iskey={iskey}
                        open={opened}
                        isTree={isTree}
                        hashKey={hashKey}
                        selectRow={selectRow}
                        hoverStyle={hoverStyle}
                        arrowRender={arrowRender}
                        hideSelectRow={hideSelectRow}
                        isSelect={!isTree && isSelect}
                        hover={isHover === key}
                        onClick={this.handleToggle.bind(this)}
                        arrowCol={right ? null : startArrowCol}
                        onMouseOut={hover ? this.handleHover.bind(this, null) : ()=> {
                        }}
                        onMouseOver={hover ? this.handleHover.bind(this, key) : ()=> {
                        }}
                        checked={selectRow.mode === 'checkbox' ?
                            !!~selectRow.selected.indexOf(key) : selectRow.selected[0] === key}
                    />
                );
                if (opened) {
                    output = output.concat(this.rowsRender(node[childrenPropertyName], cols, level + 1, hideSelectRow, right));
                }
            }
        }
        return output;
    }

    blankRender(renderedList, colSpan, showText) {
        if (renderedList.length) return null;
        return (
            <tr>
                <td className="text-center" colSpan={colSpan}>{showText && this.props.noDataText}</td>
            </tr>
        );
    }

    bodyRender(renderedList, height, selectRow, slice, page, length) {
        let rows = this.rowsRender(renderedList, this.columnData, 0, selectRow.hideSelectRow);
        if (slice) {
            rows = this._sliceData(rows, page, length)
        }
        return (
            <div className="table-container table-body-container" style={{height: height || 'auto'}}
                 ref="container">
                <table className="table table-bordered table-striped table-hover" ref="body">
                    <colgroup ref="colgroup">
                        {this.colgroupRender(this.columnData, selectRow.hideSelectRow ? 'none' : selectRow.mode)}
                    </colgroup>
                    <tbody ref="tbody">
                    {this.blankRender(renderedList, this.columnData.length, true)}
                    {rows}
                    </tbody>
                </table>
            </div>
        )
    }

    leftBodyRender(renderedList, height, selectRow) {
        if (this.leftColumnData.length) {
            return (
                <div className="table-container table-body-container" style={{height: height || 'auto'}}>
                    <table className="table table-bordered table-striped table-hover">
                        <colgroup ref="left">
                            {this.colgroupRender(this.leftColumnData, selectRow.hideSelectRow ? 'none' : selectRow.mode)}
                        </colgroup>
                        <tbody ref="ltbody">
                        {this.blankRender(renderedList, this.leftColumnData.length)}
                        {this.rowsRender(renderedList, this.leftColumnData, selectRow.hideSelectRow)}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    rightBodyRender(renderedList, height) {
        if (this.rightColumnData.length) {
            return (
                <div className="table-container table-body-container" style={{height: height || 'auto'}}>
                    <table className="table table-bordered table-striped table-hover">
                        <colgroup ref="right">
                            {this.colgroupRender(this.rightColumnData, 'none')}
                        </colgroup>
                        <tbody ref="rtbody">
                        {this.blankRender(renderedList, this.rightColumnData.length)}
                        {this.rowsRender(renderedList, this.rightColumnData, true, true)}
                        </tbody>
                    </table>
                </div>
            )
        }
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
            isTree,
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
                            dataSize={isTree ?
                                this.state.dictionary.length :
                                this.props.data.length
                            }
                            onPageChange={this.handleClick.bind(this)}
                        />
                    }
                </div>
            )
        }
    }

    pagingRowRender() {
        if (!this.props.pagination) return null;
        return (
            <div className="row">
                <div className="col-sm-6">
                    {this.dropDownListRender()}
                    {this.paginationTotalRender()}
                </div>
                <div className="col-sm-6">
                    {this.pagingRender()}
                </div>
            </div>
        )
    }

    titleRender() {
        const title = this.props.title;
        if (!title) return null;
        return (
            <div className="table-tree-title">
                {typeof title === 'function' ? title(this.props.data.slice()) : title}
            </div>
        );
    }

    footerRender() {
        const footer = this.props.footer;
        if (!footer) return null;
        return (
            <div className="table-tree-footer">
                {typeof footer === 'function' ? footer(this.props.data.slice()) : footer}
            </div>
        );
    }

    render() {
        const {
            width,
            isTree,
            remote,
            height,
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
            allKeys,
            crtPage,
            sortField,
            renderedList
        } = this.state;

        let checked = false;
        const slice = pagination && !remote;
        const allDataKeys = pagination && !remote ? this._sliceData(allKeys, crtPage, length) : allKeys.slice();
        if (selectRow.mode !== 'none') {
            checked = allDataKeys.slice().sort().toString() === selectRow.selected.slice().sort().toString();
        }
        return (
            <div className={"react-tree " + lineWrap}>
                {this.titleRender()}
                {
                    !!nestedHead.length &&
                    <NestedTreeHeader
                        ref="nested" isTree={isTree} nestedHead={nestedHead}
                        selectRow={selectRow} lineWrap={lineWrap}
                        cols={this.columnData}
                    />
                }
                <div className="table-tree-wrapper" style={{width: width || '100%'}}>
                    <div className="table-tree">
                        <TreeHeader
                            ref="thead" isTree={isTree}
                            onSelectAll={this.handleSelectAll.bind(this)}
                            selectRow={selectRow} checked={checked}
                            sortOrder={remote ? sortOrder : order}
                            sortName={remote ? sortName : sortField}
                            onSort={this.handleSort.bind(this)}
                        >
                            {children}
                        </TreeHeader>
                        {this.bodyRender(renderedList, height, selectRow, slice, crtPage, length)}
                    </div>
                    {
                        !!this.leftColumnData.length &&
                        <div className="table-tree table-fixed table-left-fixed">
                            <TreeHeader
                                ref="lthead" isTree={isTree} left={this.leftColumnData.length}
                                onSelectAll={this.handleSelectAll.bind(this)}
                                selectRow={selectRow} checked={checked}
                                sortName={remote ? sortName : sortField}
                                sortOrder={remote ? sortOrder : order}
                                onSort={this.handleSort.bind(this)}
                            >
                                {children}
                            </TreeHeader>
                            {this.leftBodyRender(renderedList, height, selectRow, slice, crtPage, length)}
                        </div>
                    }
                    {
                        !!this.rightColumnData.length &&
                        <div className="table-tree table-fixed table-right-fixed">
                            <TreeHeader
                                ref="rthead" isTree={isTree} right={this.rightColumnData.length}
                                sortName={remote ? sortName : sortField}
                                sortOrder={remote ? sortOrder : order}
                                onSort={this.handleSort.bind(this)}
                            >
                                {children}
                            </TreeHeader>
                            {this.rightBodyRender(renderedList, height, slice, crtPage, length)}
                        </div>
                    }
                    {this.footerRender()}
                </div>
                {this.pagingRowRender()}
            </div>
        )

    }
}

TreeTable.defaultProps = {
    data: [],
    dataSize: 0,
    hover: true,
    isTree: true,
    remote: false,
    nestedHead: [],
    expandAll: true,
    startArrowCol: 0,
    expandRowKeys: [],
    pagination: false,
    onSortChange: empty,
    sortName: undefined,
    sortOrder: undefined,
    lineWrap: 'ellipsis',
    clickToCloseAll: false,
    childrenPropertyName: 'list',
    noDataText: <span>暂无数据</span>,
    hoverStyle: {
        backgroundColor: '#f5f5f5'
    },
    selectRow: {
        mode: 'none',
        selected: [],
        onSelect: empty,
        onSelectAll: empty,
        bgColor: '#dff0d8',
        hideSelectRow: false
    },
    options: {
        sizePerPage: 10,
        sizePageList: [10],
        onPageChange: empty,
        onSizePageChange: empty
    },
    onArrowClick: (opened, data, callback) => {
        callback(data);
    }
};

TreeTable.propTypes = {
    data: PropTypes.array,
    remote: PropTypes.bool,
    hover: PropTypes.bool,
    isTree: PropTypes.bool,
    hashKey: PropTypes.bool,
    iskey: PropTypes.string,
    expandAll: PropTypes.bool,
    dataSize: PropTypes.number,
    pagination: PropTypes.bool,
    arrowRender: PropTypes.func,
    onArrowClick: PropTypes.func,
    onSortChange: PropTypes.func,
    hoverStyle: PropTypes.object,
    startArrowCol: PropTypes.number,
    expandRowKeys: PropTypes.array,
    childrenPropertyName: PropTypes.string,
    nestedHead: PropTypes.arrayOf(PropTypes.array),
    lineWrap: PropTypes.oneOf(['ellipsis', 'break']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node, PropTypes.func, PropTypes.element]),
    footer: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node, PropTypes.func, PropTypes.element]),
    noDataText: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node, PropTypes.func, PropTypes.element]),
    selectRow: PropTypes.shape({
        mode: PropTypes.oneOf([
            'none',
            'radio',
            'checkbox'
        ]),
        onSelect: PropTypes.func,
        bgColor: PropTypes.string,
        selected: PropTypes.array,
        onSelectAll: PropTypes.func,
        hideSelectRow: PropTypes.bool
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

/*
 * TODO: colSpan && rowSpan =>spanRender(index){return {colSpan:2, rowSpan:2}}
 * TODO: 排序和全选没法搞了，结果还是要把所有渲染的data放出来
 */