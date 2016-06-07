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
import React from 'react';
import TreeHead from './TreeHead.js';
import TreeRow from './TreeRow.js';
import Paging from './Paging.js';

require('../style/treetable.css');

const Component = React.Component;

let idCounter = 0;

function uniqueID() {
    return idCounter++ + new Date().getTime() + Math.random();
}

export default class TreeTable extends Component {
    constructor(props) {
        super(props);
        let data = props.data,
            key = props.iskey,
            hashKey = props.hashKey,
            dictionary = [],
            crtPage = 1;
        data.forEach(item => {
            item.__level = 0;
            if(hashKey){
                item.__uid = uniqueID();
                dictionary.push(item.__uid);
                return;
            }
            dictionary.push(item[key]);
        });
        if(props.pagination && props.options.page){
            crtPage = props.options.page;
        }
        this.state = {
            width: 1 / props.headRow.length * 100 + '%',
            dictionary: dictionary,
            renderedList: data,
            crtPage: crtPage
        }
    }

    componentWillReceiveProps(nextProps) {
        let data = nextProps.data,
            key = nextProps.iskey,
            hashKey = nextProps.hashKey,
            dictionary = [],
            crtPage = 1;
        data.forEach(item => {
            item.__level = 0;
            if(hashKey){
                item.__uid = uniqueID();
                dictionary.push(item.__uid);
                return;
            }
            dictionary.push(item[key]);
        });
        if(nextProps.pagination && nextProps.options.page){
            crtPage = nextProps.options.page;
        }
        this.state = {
            width: 1 / nextProps.headRow.length * 100 + '%',
            dictionary: dictionary,
            renderedList: data,
            crtPage: crtPage
        }
    }

    flatten(data) { //处理子节点数据
        let output = [], index = 0;
        data.forEach(item => {
            let children = item.list || item.chdatalist || item.children;
            if (children) {
                output[index++] = item;
                item = this.flatten(children);
                let j = 0, len = item.length;
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
        this.props.handleClick(opened, data) || data;
        let iskey = this.props.iskey;
        let hashKey = this.props.hashKey;
        let childList = data.list || data.chdatalist || data.children;
        data.__opened = !data.__opened;
        if (!opened) {
            let target = hashKey ? data.__uid : data[iskey];
            let index = this.state.dictionary.indexOf(target) + 1;
            this.setState(old => {
                childList.forEach(item => {
                    item.__parent = data;
                    item.__opened = false;
                    item.__level = data.__level + 1;
                    let id = item[iskey];
                    if(this.props.hashKey){
                        if(!item.__uid){
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
            childList = this.flatten(childList);
            this.setState(old => {
                childList.forEach(item => {
                    item.__opened = true;
                    let id = this.props.hashKey ? item.__uid : item[iskey];
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

    handleClick(event, nextPage){
        this.setState(old =>{
            old.crtPage = nextPage;
            return old;
        });
        this.props.options.onPageChange(event, this.state.crtPage, nextPage);
    }

    bodyRender() {
        let {
            width,
            renderedList,
            crtPage
        } = this.state;
        let {
            headRow,
            iskey,
            hashKey,
            pagination,
            options
        } = this.props;

        if (renderedList.length < 1) {
            return <div className="table-row text-center clearfix"><span>暂无数据</span></div>;
        }
        let output = [];
        if(pagination){
            let len = options.sizePerPage;
            renderedList = renderedList.slice((crtPage - 1)*len, crtPage*len);
        }
        renderedList.forEach(node => {
            output.push(<TreeRow
                key={hashKey? node.__uid : node[iskey]}
                level={node.__level}
                iskey={iskey}
                hashKey={hashKey}
                cols={headRow}
                width={width}
                parent={node.__parent}
                data={node}
                open={node.__opened}
                dataFormat={this.props.dataFormat}
                onClick={this.handleToggle.bind(this)}
            />);
        });
        return output;
    }

    pagingRender(){
        if(this.props.pagination){
            return (
                <div className="paging">
                    <Paging size={this.state.dictionary.length} length={this.props.options.sizePerPage} num={this.state.crtPage} click={this.handleClick.bind(this)}/>
                </div>
            )
        }
    }

    render() {
        return (
            <div style={{padding: "10px", margin: "10px"}}>
                <div className="table-tree table" >
                    <TreeHead headRow={this.props.headRow} width={this.state.width}/>

                    <div className="table-body clearfix">
                        {this.bodyRender()}
                    </div>
                </div>
                {this.pagingRender()}
            </div>
        )
    }
}

TreeTable.defaultProps = {
    data: [],
    headRow: [],
    options: {
        sizePerPage: 10
    },
    handleClick: function (opened, data) {
        return data;
    }
};

