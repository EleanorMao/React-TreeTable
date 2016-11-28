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
import TreeRow          from './TreeRow';
import TreeHeader       from './TreeHeader';
import NestedTreeHeader from './NestedTreeHeader';
import Paging           from './Pagination/Pagination';
import Dropdown         from './Pagination/DropdownList';
import {empty, sort, uniqueID, diff, getScrollBarWidth} from './Util';

require('../style/treetable.css');

export default class TreeTable extends Component {
    constructor(props) {
        super(props);
        let data = this._initDictionary(props);
        this.state = {
            isHover: null,
            order: undefined,
            sortField: undefined,
            renderedList: data.data,
            dictionary: data.dictionary,
            crtPage: props.pagination && props.options.page || 1,
            length: props.pagination && props.options.sizePerPage || 0
        }
    }

    _initDictionary(props) {
        let dictionary = [], data = props.data.slice();
        const {
            uid,
            iskey,
            isTree,
            hashKey,
            expandAll,
            expandRowKeys,
            childrenPropertyName
        } = props;
        let keyName = hashKey ? uid : iskey;
        if (isTree) {
            if (expandAll) {
                dictionary = this._recursion(data, hashKey, keyName, childrenPropertyName);
            } else if (expandRowKeys && expandRowKeys.length) {
                dictionary = expandRowKeys.slice();
            }
        }
        return {data, dictionary};
    }

    _recursion(data, hashKey, keyName, childrenPropertyName) {
        let dictionary = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (hashKey && !item[keyName]) item[keyName] = uniqueID(); //引用大法好
            if (item[childrenPropertyName] && item[childrenPropertyName].length) {
                dictionary.push(item[keyName]);
                data = data.concat(item[childrenPropertyName]);
            }
        }
        return dictionary;
    }

    _flatten(data, childrenPropertyName, hashKey, keyName) {
        let output = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (hashKey && !item[keyName]) item[keyName] = uniqueID();
            if (item[childrenPropertyName]) {
                output.push(item[keyName]);
                data = data.concat(item[childrenPropertyName]);
            }
        }
        return output;
    }

    _initColumnData(props) {
        let columnData = [];
        React.Children.map(props.children, function (column) {
            columnData.push({
                width: column.props.width,
                id: column.props.dataField,
                name: column.props.children,
                hidden: column.props.hidden,
                render: column.props.render,
                colSpan: column.props.colSpan,
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
        const {hashKey, iskey, uid} =this.props;
        return hashKey ? uid : iskey;
    }

    _adjustWidth() {
        const refs = this.refs,
            firstRow = refs.colgroup.childNodes,
            cells = refs.thead.refs.thead.childNodes,
            fixedLeftRow = refs.left && refs.left.childNodes,
            fixedRightRow = refs.right && refs.right.childNodes,
            nestedRow = refs.nested && refs.nested.refs.colgroup.childNodes,
            fixedLeftHeadRow = refs.lthead && refs.lthead.refs.colgroup.childNodes,
            fixedRightHeadRow = refs.rthead && refs.rthead.refs.colgroup.childNodes,
            isNoData = refs.tbody.firstChild.childElementCount === 1,
            length = cells.length,
            rightFixedLength = fixedRightRow ? length - fixedRightRow.length : 0;

        if (firstRow.length !== length)return;

        const scrollBarWidth = getScrollBarWidth(),
            haveScrollBar = refs.body.offsetWidth !== refs.thead.refs.header.offsetWidth;

        let lastChild = this._getLastChild(this.columnData), fixedRightWidth = 0;
        lastChild = this.props.selectRow.mode !== 'none' ? lastChild + 1 : lastChild;

        for (let i = 0; i < length; i++) {
            const cell = cells[i];
            const rightIndex = i - rightFixedLength;
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

            if (!isNoData) {
                firstRow[i].style.width = result;
                firstRow[i].style.maxWidth = result;
            }

            if (nestedRow && nestedRow[i]) {
                const display = computedStyle.display;
                nestedRow[i].style.width = width.toFixed(2) + 'px';
                nestedRow[i].style.maxWidth = width.toFixed(2) + 'px';
                if (display === 'none') nestedRow[i].style.display = display;
            }

            if (fixedLeftRow && fixedLeftRow[i]) {
                fixedLeftRow[i].style.width = result;
                fixedLeftRow[i].style.maxWidth = result;
                fixedLeftHeadRow[i].style.width = result;
                fixedLeftHeadRow[i].style.maxWidth = result;
            }

            if (fixedRightRow && fixedRightRow[rightIndex] && !cell.dataset.input) {
                fixedRightWidth += width;
                fixedRightRow[rightIndex].style.width = result;
                fixedRightRow[rightIndex].style.maxWidth = result;
                fixedRightHeadRow[rightIndex].style.width = width.toFixed(2) + 'px';
                fixedRightHeadRow[rightIndex].style.maxWidth = width.toFixed(2) + 'px';
            }

        }

        if (fixedRightWidth) {
            refs.rightBody.style.width = fixedRightWidth - (haveScrollBar ? scrollBarWidth : 0) + 'px';
        }

        if (fixedLeftRow || fixedRightRow) {
            const tbody = refs.tbody.childNodes;
            const ltbody = refs.ltbody && refs.ltbody.childNodes;
            const rtbody = refs.rtbody && refs.rtbody.childNodes;
            const headHeight = getComputedStyle(refs.thead.refs.thead).height;
            if (refs.lthead)  refs.lthead.refs.thead.style.height = headHeight;
            if (refs.rthead)  refs.rthead.refs.thead.style.height = headHeight;
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

    _scrollHeight(e) {
        if (this.refs.leftContainer) {
            this.refs.leftContainer.scrollTop = e.currentTarget.scrollTop;
        }
        if (this.refs.rightContainer && this.refs.leftContainer) {
            this.refs.container.scrollTop = e.currentTarget.scrollTop;
        }
    }

    _tryRender() {
        const {isTree, iskey, hashKey, selectRow, nestedHead} = this.props;
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
            if (isTree) {
                console.warn('%c!Warning: You need set prop `isTree` to `false`, if not `TreeTable` will not render select rows', warning);
            }
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
        this._initColumnData(this.props);
        this._tryRender();
    }

    componentDidMount() {
        this._adjustWidth();
        window.addEventListener('resize', this._adjustWidth.bind(this));
        this.refs.container.addEventListener('scroll', this._scrollHeader.bind(this));
        if (this.refs.rightContainer) {
            this.refs.rightContainer.addEventListener('scroll', this._scrollHeight.bind(this));
        }
        if (this.refs.leftContainer && !this.refs.rightContainer) {
            this.refs.container.addEventListener('scroll', this._scrollHeight.bind(this));
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._adjustWidth.bind(this));
        this.refs.container.removeEventListener('scroll', this._scrollHeader.bind(this));
        if (this.refs.rightContainer) {
            this.refs.rightContainer.removeEventListener('scroll', this._scrollHeight.bind(this));
        }
        if (this.refs.leftContainer && !this.refs.rightContainer) {
            this.refs.container.removeEventListener('scroll', this._scrollHeight.bind(this));
        }
    }

    componentDidUpdate() {
        this._adjustWidth();
        this.refs.container.addEventListener('scroll', this._scrollHeader.bind(this));
        if (this.refs.rightContainer) {
            this.refs.rightContainer.addEventListener('scroll', this._scrollHeight.bind(this));
        }
        if (this.refs.leftContainer && !this.refs.rightContainer) {
            this.refs.container.addEventListener('scroll', this._scrollHeight.bind(this));
        }
    }

    componentWillReceiveProps(nextProps) {
        this._initColumnData(nextProps);
        let data = this._initDictionary(nextProps);
        this.setState({
            renderedList: data.data,
            dictionary: data.dictionary,
            length: nextProps.options.sizePerPage || 0,
            crtPage: nextProps.pagination && nextProps.options.page || this.state.crtPage
        });
    }


    handleToggle(option) {
        const {
            data,
            open,
            parent
        } = option;
        const that = this;
        const {hashKey, clickToCloseAll, childrenPropertyName} = this.props;
        const keyName = this._getKeyName();
        let callback = (data) => {
            let childList = data && data[childrenPropertyName] || [];
            if (clickToCloseAll) {
                childList = this._flatten(childList, childrenPropertyName, hashKey, keyName);
            }
            if (!open) {
                that.setState(old => {
                    if (hashKey && !data[keyName]) data[keyName] = uniqueID();
                    old.dictionary.push(data[keyName]);
                    return old;
                })
            } else {
                that.setState(old => {
                    old.dictionary.splice(old.dictionary.indexOf(data[keyName]), 1);
                    clickToCloseAll && childList && childList.forEach(item => {
                        let index = old.dictionary.indexOf(item);
                        if (~index) {
                            old.dictionary.splice(index, 1);
                        }
                    });
                    return old;
                })
            }
        };
        this.props.onArrowClick(open, data, callback, parent);
    }

    handleSelectAll(checked) {
        if (checked) {
            this.props.selectRow.onSelectAll(checked, this.state.renderedList.slice())
        } else {
            this.props.selectRow.onSelectAll(checked, [])
        }
    }

    handleSort(sortField, order) {
        const {remote, onSortChange} = this.props;
        if (remote) {
            onSortChange(sortField, order)
        } else {
            const {renderedList} = this.state;

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

            this.setState(old=> {
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
        const {remote, options} = this.props;
        const page = remote ? options.page : this.state.crtPage;
        if (!remote) {
            this.setState(old=> {
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

    rowsRender(data, cols, level, parent, hideSelectColumn, right) {
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

        if (data && data.length) {
            for (let i = 0; i < data.length; i++) {
                let node = data[i];
                if (hashKey && !node[keyName]) node[keyName] = uniqueID();
                let key = node[keyName];
                let opened = !!~dictionary.indexOf(key);
                output.push(
                    <TreeRow
                        key={key}
                        data={node}
                        cols={cols}
                        colIndex={i}
                        level={level}
                        iskey={iskey}
                        open={opened}
                        parent={parent}
                        isTree={isTree}
                        hashKey={hashKey}
                        selectRow={selectRow}
                        hover={isHover === key}
                        hoverStyle={hoverStyle}
                        arrowRender={arrowRender}
                        isSelect={!isTree && isSelect}
                        hideSelectColumn={hideSelectColumn}
                        onClick={this.handleToggle.bind(this)}
                        arrowCol={right ? null : startArrowCol}
                        childrenPropertyName={childrenPropertyName}
                        onMouseOut={hover ? this.handleHover.bind(this, null) : ()=> {
                        }}
                        onMouseOver={hover ? this.handleHover.bind(this, key) : ()=> {
                        }}
                        checked={selectRow.mode === 'checkbox' ?
                            !!~selectRow.selected.indexOf(key) : selectRow.selected[0] === key}
                    />
                );
                if (opened) {
                    output = output.concat(this.rowsRender(node[childrenPropertyName], cols, level + 1, node, hideSelectColumn, right));
                }
            }
        }
        return output;
    }

    blankRender(data, colSpan, showText) {
        if (data.length) return null;
        return (
            <tr>
                <td className="text-center" colSpan={colSpan}>{showText && this.props.noDataText}</td>
            </tr>
        );
    }

    bodyRender(data, height, selectRow) {
        return (
            <div className="table-container table-body-container" style={{height: height || 'auto'}}
                 ref="container">
                <table className="table table-bordered table-striped table-hover" ref="body">
                    <colgroup ref="colgroup">
                        {this.colgroupRender(this.columnData, selectRow.hideSelectColumn ? 'none' : selectRow.mode)}
                    </colgroup>
                    <tbody ref="tbody">
                    {this.blankRender(data, this.columnData.length, true)}
                    {this.rowsRender(data, this.columnData, 0, null, selectRow.hideSelectColumn)}
                    </tbody>
                </table>
            </div>
        )
    }

    leftBodyRender(data, height, selectRow) {
        if (this.leftColumnData.length) {
            return (
                <div className="table-container table-body-container" style={{height: height || 'auto'}}
                     ref="leftContainer">
                    <table className="table table-bordered table-striped table-hover">
                        <colgroup ref="left">
                            {this.colgroupRender(this.leftColumnData, selectRow.hideSelectColumn ? 'none' : selectRow.mode)}
                        </colgroup>
                        <tbody ref="ltbody">
                        {this.blankRender(data, this.leftColumnData.length)}
                        {this.rowsRender(data, this.leftColumnData, 0, null, selectRow.hideSelectColumn)}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    rightBodyRender(data, height) {
        if (this.rightColumnData.length) {
            return (
                <div className="table-container table-body-container" style={{height: height || 'auto'}}
                     ref="rightContainer">
                    <table className="table table-bordered table-striped table-hover" ref="rightBody">
                        <colgroup ref="right">
                            {this.colgroupRender(this.rightColumnData, 'none')}
                        </colgroup>
                        <tbody ref="rtbody">
                        {this.blankRender(data, this.rightColumnData.length)}
                        {this.rowsRender(data, this.rightColumnData, 0, null, true, true)}
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
                            <div>显示 {start} 至 {to}条 共{remote ? dataSize : data.length}条</div> :
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
                            paginationSize={options.paginationSize}
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
                            dataSize={this.props.data.length}
                            paginationSize={options.paginationSize}
                            onPageChange={this.handleClick.bind(this)}
                        />
                    }
                </div>
            )
        }
    }

    pagingRowRender() {
        if (!this.props.pagination || !this.props.data.length) return null;
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
            crtPage,
            sortField,
            renderedList
        } = this.state;

        let checked = false;
        const renderList = pagination && !remote ? this._sliceData(renderedList, crtPage, length) : renderedList.slice();
        if (selectRow.mode !== 'none') {
            checked = this._getAllValue(renderList.slice(), this._getKeyName()).sort().toString() === selectRow.selected.slice().sort().toString();
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
                        {this.bodyRender(renderList, height, selectRow)}
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
                            {this.leftBodyRender(renderList, height, selectRow)}
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
                            {this.rightBodyRender(renderList, height)}
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
    uid: '__uid',
    remote: false,
    nestedHead: [],
    startArrowCol: 0,
    expandAll: false,
    pagination: false,
    onSortChange: empty,
    sortName: undefined,
    sortOrder: undefined,
    lineWrap: 'ellipsis',
    clickToCloseAll: true,
    childrenPropertyName: 'list',
    noDataText: <span>暂无数据</span>,
    hoverStyle: {backgroundColor: '#f5f5f5'},
    selectRow: {
        mode: 'none',
        selected: [],
        onSelect: empty,
        onSelectAll: empty,
        bgColor: '#dff0d8',
        hideSelectColumn: false
    },
    options: {
        sizePerPage: 10,
        paginationSize: 6,
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
    uid: PropTypes.string,
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
    expandRowKeys: PropTypes.array,
    startArrowCol: PropTypes.number,
    clickToCloseAll: PropTypes.bool,
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
        hideSelectColumn: PropTypes.bool
    }),
    options: PropTypes.shape({
        page: PropTypes.number,
        onPageChange: PropTypes.func,
        sizePerPage: PropTypes.number,
        sizePageList: PropTypes.array,
        onSizePageChange: PropTypes.func,
        paginationSize: PropTypes.number,
        paginationShowsTotal: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
    })
};