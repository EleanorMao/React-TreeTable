/**
 * Created by Elly on 2016/5/26.
 * Tree Table
 * @version 3.0
 * Author: Eleanor Mao
 * require bootstrap.css
 * data: JSON Format Array,
 * iskey: required,
 * headRow: [key, key, ...] || [{id: , name: }, ...]
 */
import React from 'react';
import TreeHead from './TreeHead.js';
import TreeRow from './TreeRow.js';

require('../stylesheets/treetable.css');

const Component = React.Component;

export default class TreeTable extends Component {
    constructor(props) {
        super(props);
        let data = props.data,
            key = props.iskey,
            dictionary = [];
        data.forEach(item => {
            item.level = 0;
            dictionary.push(item[key])
        })
        this.state = {
            width: 1 / (props.headRow.length) * 100 + '%',
            dictionary: dictionary,
            renderedList: data
        }
    }

    //update width, when headRow changed;
    componentWillReceiveProps(nextProps) {
        this.setState(old => {
            old.width = 1 / nextProps.headRow.length * 100 + '%';
            return old;
        })
    }

    flatten(data) {
        var output = [], index = 0;
        data.forEach((item, i, list) => {
            let children = item.list || item.chdatalist || item.children;
            if (children) {
                output[index++] = item;
                item = this.flatten(children);
                var j = 0, len = item.length;
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
        let childList = data.list || data.chdatalist || data.children;
        if (!display) {
            let target = data[iskey];
            let index = this.state.dictionary.indexOf(target) + 1;
            this.setState(old => {
                childList.forEach(item => {
                    item.parent = data;
                    item.level = data.level + 1;
                    old.dictionary.splice(index, 0, item[iskey]);
                    old.renderedList.splice(index++, 0, item);
                })
                return old;
            })
        } else {
            childList = this.flatten(childList);
            this.setState(old => {
                childList.forEach(item => {
                    let i = old.dictionary.indexOf(item[iskey]);
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
            iskey
        } = this.props;

        if (renderedList.length < 1) {
            return <div className="table-row text-center clearfix"><span>暂无数据</span></div>;
        }

        let output = [];
        renderedList.forEach(node => {
            output.push(<TreeRow
                key={node[iskey]}
                level={node.level}
                iskey={iskey}
                cols={headRow}
                width={width}
                parent={node.parent}
                data={node}
                onClick={this.handleToggle.bind(this)}
            />);
        })
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
    data: []
};

