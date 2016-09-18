/**
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
import React, {
    Component,
    PropTypes
} from 'react';
import TreeRow from './TreeRow.js';
import Paging from './Pagination/Pagination.js';

require('../style/treetable.css');

let idCounter = 0;

function uniqueID() {
    return idCounter++ + new Date().getTime() + Math.random();
}

export default class TreeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderedList: props.data.slice(),
            dictionary: this._initDictionary(props),
            crtPage: props.pagination && props.options.page || 1
        }
    }

    _initDictionary(props) {
        let data = props.data,
            key = props.iskey,
            hashKey = props.hashKey,
            dictionary = [];
        data.forEach(item => {
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

    _initColumnDate() {
        let columnDate = [];
        React.Children.map(this.props.children, function(column) {
            columnDate.push({
                id: column.props.dataField,
                name: column.props.children,
                hidden: column.props.hidden,
                showArrow: column.props.showArrow,
                dataFormat: column.props.dataFormat,
                width: column.props.width
            });
        })
        this.columnDate = columnDate;
    }

    _adjustWidth() {
        const tbody = this.refs.tbody;
        const firstRow = tbody.childNodes[0].childNodes;
        const cells = this.refs.thead.childNodes;
        for (let i = 0, len = cells.length; i < len; i++) {
            const cell = cells[i];
            const target = firstRow[i];
            const computedStyle = getComputedStyle(cell);
            let width = parseFloat(computedStyle.width.replace('px', ''));
            if (!-[1, ]) {
                const paddingLeftWidth = parseFloat(computedStyle.paddingLeft.replace('px', ''));
                const paddingRightWidth = parseFloat(computedStyle.paddingRight.replace('px', ''));
                const borderRightWidth = parseFloat(computedStyle.borderRightWidth.replace('px', ''));
                const borderLeftWidth = parseFloat(computedStyle.borderLeftWidth.replace('px', ''));
                width = width + paddingLeftWidth + paddingRightWidth + borderRightWidth + borderLeftWidth;
            }
            const result = width + 'px';
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

    componentWillReceiveProps(nextProps) {
        this._initColumnDate();

        this.state = {
            renderedList: nextProps.data.slice(),
            dictionary: this._initDictionary(nextProps),
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
        let callback = function() {
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
        }
        this.props.handleClick(opened, data, callback);
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
            options,
            headRow,
            hashKey,
            pagination
        } = this.props;

        if (renderedList.length < 1) {
            return <tr><td className="text-center"><span>暂无数据</span></td></tr>;
        }
        let output = [];
        if (pagination) {
            let len = options.sizePerPage;
            renderedList = renderedList.slice((crtPage - 1) * len, crtPage * len);
        }
        renderedList.forEach(node => {
            output.push(<TreeRow
                data={node}
                iskey={iskey}
                hashKey={hashKey}
                level={node.__level}
                open={node.__opened}
                parent={node.__parent}
                cols={this.columnDate}
                onClick={this.handleToggle.bind(this)}
                key={hashKey? node.__uid : node[iskey]}
            />);
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
                            <div>当前第{start}条 至 第{to}条 共{data.length}条</div> : 
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
            height,
            children
        } = this.props;
        return (
            <div style={{padding: "10px", margin: "10px",width: width || '100%'}}>
                <div className="table-tree">
                    <div className="table-container" style={{overflow: 'hidden'}} ref="header">
                        <table className="table table-bordered">
                            <thead><tr ref="thead">{children}</tr></thead>
                        </table>
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
    options: {
        sizePerPage: 10
    },
    dataSize: 0,
    handleClick: (opened, data, callback) => {
        callback(data);
    }
};