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
import TreeRow from './TreeRow.js';
import TreeHead from './TreeHead.js';
import Paging from './Pagination/Pagination.js';

require('../style/treetable.css');

let idCounter = 0;

function uniqueID() {
    return idCounter++ + new Date().getTime() + Math.random();
}

function diff(a, b) {
    return a.filter(x => {
        return b.indexOf(x) === -1
    });
}

function getScrollBarWidth() {
    const inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.appendChild(inner);

    document.body.appendChild(outer);
    const w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let w2 = inner.offsetWidth;
    if (w1 === w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return w1 - w2;
}

export default class TreeTable extends Component {
    constructor(props) {
        super(props);
        let data = this._initDictionary(props);
        this.state = {
            sortField: undefined,
            order: undefined,
            renderedList: data.data,
            dictionary: data.dictionary,
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
                item.__level = 0;
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

    _initColumnDate() {
        let columnDate = [];
        React.Children.map(this.props.children, function (column) {
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


    _adjustWidth() {
        const tbody = this.refs.tbody;
        const scrollBarWidth = getScrollBarWidth();
        const firstRow = tbody.childNodes[0].childNodes;
        const cells = this.refs.thead.refs.thead.childNodes;
        let lastChild = this._getLastChild(this.columnDate);
        lastChild = this.props.selectRow.mode !== 'none' ? lastChild + 1 : lastChild;
        for (let i = 0, len = cells.length; i < len; i++) {
            const cell = cells[i];
            const target = firstRow[i];
            const computedStyle = getComputedStyle(cell);
            let width = parseFloat(computedStyle.width.replace('px', ''));
            if (!-[1,]) {
                const paddingLeftWidth = parseFloat(computedStyle.paddingLeft.replace('px', ''));
                const paddingRightWidth = parseFloat(computedStyle.paddingRight.replace('px', ''));
                const borderRightWidth = parseFloat(computedStyle.borderRightWidth.replace('px', ''));
                const borderLeftWidth = parseFloat(computedStyle.borderLeftWidth.replace('px', ''));
                width = width + paddingLeftWidth + paddingRightWidth + borderRightWidth + borderLeftWidth;
            }
            const lastPaddingWidth = -(lastChild === i ? scrollBarWidth : 0);
            const result = width + lastPaddingWidth + 'px';
            target.style.width = result;
            target.style.minWidth = result;
        }
    }

    _scrollHeader(e) {
        this.refs.header.scrollLeft = e.currentTarget.scrollLeft;
    }

    componentWillMount() {
        this._initColumnDate();
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
        this._initColumnDate();

        let data = this._initDictionary(nextProps);
        this.state = {
            renderedList: data.data,
            dictionary: data.dictionary,
            crtPage: nextProps.pagination && nextProps.options.page || this.state.crtPage
        }
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
                    childList.forEach(item => {
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
                    childList.forEach(item => {
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
        this.props.handleClick(opened, data, callback);
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

    bodyRender() {
        let {
            crtPage,
            renderedList
        } = this.state;
        let {
            iskey,
            isTree,
            remote,
            options,
            hashKey,
            selectRow,
            pagination
        } = this.props;
        const isSelect = selectRow.mode !== 'none';
        if (renderedList.length < 1) {
            return (
                <tr>
                    <td className="text-center"><span>暂无数据</span></td>
                </tr>
            );
        }
        let output = [];
        if (pagination && !remote) {
            let len = options.sizePerPage;
            renderedList = renderedList.slice((crtPage - 1) * len, crtPage * len);
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
                    isSelect={isSelect}
                    level={node.__level}
                    open={node.__opened}
                    selectRow={selectRow}
                    parent={node.__parent}
                    cols={this.columnDate}
                    onClick={this.handleToggle.bind(this)}
                    checked={selectRow.mode === 'checkbox' ? !!~selectRow.selected.indexOf(key) : selectRow.selected[0] === key}
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
            const len = options.sizePerPage;
            const current = remote ? (options.page - 1) * len : (this.state.crtPage - 1) * len;
            const start = remote ? current + 1 : Math.min(data.length, current + 1);
            const to = remote ? current + data.length : Math.min(data.length, current + len);
            return (
                <div style={{marginTop: 20}}>
                    {
                        options.paginationShowsTotal === true ?
                            <div>显示 {start} 至 {to}条 共{data.length}条</div> :
                            options.paginationShowsTotal(start, to, dataSize)
                    }
                </div>
            )
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
                            sizePerPage={options.sizePerPage}
                            onPageChange={options.onPageChange}
                        />
                        : <Paging
                        current={this.state.crtPage}
                        sizePerPage={options.sizePerPage}
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
            options,
            children,
            sortName,
            selectRow,
            sortOrder,
            nestedHead,
            pagination
        } = this.props;

        const {
            order,
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
        if (selectRow.mode !== 'node') {

            if (selectRow.mode === 'radio' && selectRow.selected.length > 1) {
                throw new Error(
                    '!Warning: Since you set `selectRow.mode` to `radio`,' +
                    '`selectRow.selected` should only have one child, if not `TreeTable` will use the first child of `selectRow.selected`'
                );
            }

            const key = hashKey ? '__uid' : iskey;

            let renderList = renderedList.slice();

            if (pagination && !remote) {
                let len = options.sizePerPage;
                renderList = renderList.slice((crtPage - 1) * len, crtPage * len);
            }

            checked = this._getAllValue(renderList.slice(), key).sort().toString() === selectRow.selected.slice().sort().toString();
        }

        return (
            <div style={{padding: "10px", margin: "10px", width: width || '100%'}}>
                <div className="table-tree">
                    <div className="table-container" style={{overflow: 'hidden'}} ref="header">
                        <TreeHead selectRow={selectRow} nestedHead={nestedHead} ref="thead"
                                  checked={checked} sortName={remote ? sortName : sortField}
                                  sortOrder={remote ? sortOrder : order}
                                  onSelectAll={this.handleSelectAll.bind(this)}
                                  onSort={this.handleSort.bind(this)}
                        >{children}</TreeHead>
                    </div>
                    <div className="table-container" style={{height: height || 'auto'}} ref="container">
                        <table className="table table-bordered table-striped table-hover">
                            <tbody ref="tbody">{this.bodyRender()}</tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
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
    sortOrder: undefined,
    onSortChange: ()=> {
    },
    selectRow: {
        mode: 'none',
        bgColor: '#dff0d8',
        selected: [],
        onSelect: ()=> {
        },
        onSelectAll: ()=> {
        },
    },
    nestedHead: [],
    options: {
        sizePerPage: 10
    },
    dataSize: 0,
    pagination: false,
    handleClick: (opened, data, callback) => {
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
    handleClick: PropTypes.func,
    onSortChange: PropTypes.func,
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
        paginationShowsTotal: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
    })
};