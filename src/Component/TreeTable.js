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
            dictionary = [];
        data.forEach(item => {
            item.level = 0;
            if(hashKey){
                item.uid = uniqueID();
                dictionary.push(item.uid);
                return;
            }
            dictionary.push(item[key]);
        });
        this.state = {
            width: 1 / props.headRow.length * 100 + '%',
            dictionary: dictionary,
            renderedList: data
        }
    }

    componentWillReceiveProps(nextProps) {
        let data = props.data,
            key = props.iskey,
            hashKey = props.hashKey,
            dictionary = [];
        data.forEach(item => {
            item.level = 0;
            if(hashKey){
                item.uid = uniqueID();
                dictionary.push(item.uid);
                return;
            }
            dictionary.push(item[key])
        });
        this.setState(old => {
            old.renderedList = data;
            old.dictionary = dictionary;
            old.width = 1 / nextProps.headRow.length * 100 + '%';
            return old;
        })
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
            display,
            data
        } = option;
        let iskey = this.props.iskey;
        let hashKey = this.props.hashKey;
        let childList = data.list || data.chdatalist || data.children;
        if (!display) {
            let target = hashKey ? data.uid : data[iskey];
            let index = this.state.dictionary.indexOf(target) + 1;
            this.setState(old => {
                childList.forEach(item => {
                    item.parent = data;
                    item.level = data.level + 1;
                    let id = item[iskey];
                    if(this.props.hashKey){
                        if(!item.uid){
                            item.uid = uniqueID();
                        } 
                        id = item.uid;
                    }
                    old.dictionary.splice(index, 0, id);
                    old.renderedList.splice(index++, 0, item);
                });
                return old;
            })
        } else {
            childList = this.flatten(childList);
            this.setState(old => {
                childList.forEach(item => {
                    let id = this.props.hashKey ? item.uid : item[iskey];
                    let i = old.dictionary.indexOf(id);
                    if (i > -1) {
                        old.dictionary.splice(i, 1);
                        old.renderedList.splice(i, 1);
                    }
                })
            })
        }
    }

    bodyRender() {
        let {
            width,
            renderedList
        } = this.state;
        let {
            headRow,
            iskey,
            hashKey
        } = this.props;

        if (renderedList.length < 1) {
            return <div className="table-row text-center clearfix"><span>暂无数据</span></div>;
        }

        let output = [];
        renderedList.forEach(node => {
            output.push(<TreeRow
                key={hashKey? node.uid : node[iskey]}
                level={node.level}
                iskey={iskey}
                hashKey={hashKey}
                cols={headRow}
                width={width}
                parent={node.parent}
                data={node}
                dataFormat={this.props.dataFormat}
                onClick={this.handleToggle.bind(this)}
            />);
        });
        return output;
    }

    render() {
        return (
            <div style={{padding: "10px", margin: "10px"}}>
                <div className="table-tree table">
                    <TreeHead headRow={this.props.headRow} width={this.state.width}/>

                    <div className="table-body clearfix">
                        {this.bodyRender()}
                    </div>
                </div>
            </div>
        )
    }
}

TreeTable.defaultProps = {
    data: [],
    headRow: []
};

