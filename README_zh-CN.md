# React-TreeTable
A kind of Table _(┐「ε:)_❤
将树形结构数据渲染成表格形式

## 参数提供
### TreeTable
* iskey[String] 作为key用的那个字段的名字
* data[Array]   数据入口, 子节点默认为`list`
* hover[Boolean] 默认是`true`， 开启就有hover效果
* hoverStyle[Object] 默认是`{backgroundColor: '#f5f5f5'}`
* isTree[Boolean]  是否是树形结构，开启后不能是有hashKey模式，一定程度上节省了性能
* hashKey[Boolean]   默认是`fasle`, 如果没有唯一的id, 那就传`true`, 本表格会帮你造一个`uid`
* uid[String] hashKey时候的uid的key值，默认是`__uid`
* width[Number | String] 宽度
* height[Number | String] 高度
* title[Function(data) | String | Number | Node] 头部
* footer[Function(data) | String | Number | Node] 脚部
* remote[Boolean] 如果是true则将翻页`onPageChange`的控制权和排序`onSortChange`,`sortName`,`sortOrder`交给父组件
* dataSize[Number] 数据总条数，仅在开启remote后有用
* sortName[String] 排序的列名
* sortOrder[String] `asc`或`desc`
* pagination[Boolean] 默认是`false`, 是否开启分页器
* expandAll[Boolean] 是否默认展开所有的数据
* expandRowKeys[Array] 展开的节点key名
* clickToCloseAll[Boolean] 点击关闭时是否关闭所有子节点，默认`true`
* childrenPropertyName[String] 自定义子节点的名字，默认`list`
* startArrowCol[Number] 设置后展开箭头将从第`startArrowCol`开始出现(从0开始), 默认是`0`
* nestedHead[Array] 套头，是[[],[]]格式， 里面的数组设置套头的格式，可以是字符串或是对象，对象的话可用参数为colspan和label还有rowspan
* options[Object] 分页器配置
    * page[Number] 默认显示的当前页, 默认是第一页
    * prevLabel 分页器的上一页
    * startLabel 分页器的下一页
    * startLabel 分页器的回到第一页
    * endLabel 分页器的回到最后一页
    * sizePerPage[Number] 每页多长, 默认是十条
    * paginationSize[Number] 分页器每次显示几个页码
    * onPageChange(page, sizePerPage) 点击分页器时调用
    * paginationShowsTotal[Boolean | Function(start, to , total)] 显示条数导航
* selectRow[Object] 选择框（仅能在`isTree`是`false`的情况下使用）
    * mode['none', 'radio', 'checkbox'] 选择框的类型
    * bgColor[String] 选中后的背景色
    * selected[Array] 选中的由每行key值组成的数组
    * hideSelectColumn[Boolean] 是否隐藏选中框
    * onSelect[Function(isSelected, row)] 选中单行时的回调函数
    * onSelectAll[Function(isSelected, data)] 选中全部时的回调函数
* arrowRender[Function(open)] 自定义展开按钮样式
* onSortChange[Function(sortName, sortOrder)] 排序时候调用, `sortOrder`是`asc`或`desc`
* onArrowClick[Function(collapse, data，parent)] 点击展开按钮的时候会把数据丢给你可以处理，会返回`collapse`,`data`, `parent`三个参数和一个callback`callback`，务必要`callback(data)`(为了处理异步的情况)。`collapse`为`false`的时候意味着操作是打开(当前叶子节点是关闭状态)，如果是`true`说明操作是关闭(当前叶子节点是展开的)。如果有子节点的数据是通过异步请求搞进去的这种需求，请通过引用的原理来处理。

### TreeHeadCol
* dataField[String] 数据的key值
* dataAlign[String] textAlign的姿势
* dataFixed[String] 固定的位置, `left` 或者 `right` 或者 `auto`
* dataSort[Boolean] 是否开启排序(默认只排序最外层数据<-产品说的) 
* dataFormat[Function(cell, level, row, index, col)] 自定义渲染方法
* hidden[Boolean] 是否隐藏
* width[Number | String] 宽度
* showArrow[Function(cell, level, row, index, col) | Boolean] 强制该列是否显示展开箭头(在startArrowCol的基础上)

## 让我们用代码说话⬇

```javascript
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
    TreeTable,
    TreeHeadCol
} from 'react-treetable';

import {
    noKeyData,
    data,
    list
} from './fackData';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            list: [],
            length: 10,
            data: data,
            selected: [],
            expandRowKeys: []
        }
    }

    componentWillMount() {
        fetch('http://localhost:3000/list').then(res => {
            return res.json();
        }).then(json => {
            this.setState({
                list: json
            })
        })
    }

    handleClick(display, data, callback) {
        if (!display) {
            fetch('http://localhost:3000/get?a=8').then(res => {
                return res.json();
            }).then(json => {
                data.list.push(json[0]);
                callback(data);
            })
        } else {
            callback(data);
        }
    }

    handleArrowClick(collapse, data, cb) {
        if (!collapse && data.chdatalist && !data.chdatalist.length) {
            this.setState(old => {
                old.loading = true;
                return old;
            });
            fetch(`http://localhost:3000/detail?year=${data.year}&time=${data.time}&datatype=0`).then(res => {
                return res.json();
            }).then(json => {
                data.chdatalist = json;
                cb(data);
                this.setState(old => {
                    old.loading = false;
                    old.expandRowKeys.push(data.uniqueKey);
                    return old;
                });
            });
        } else {
            cb(data);
            if (collapse) {
                this.setState(old => {
                    old.expandRowKeys.push(data.uniqueKey);
                    return old;
                });
            } else {
                this.setState(old => {
                    old.expandRowKeys.splice(old.expandRowKeys.indexOf(data.uniqueKey), 1);
                    return old;
                });
            }
        }
    }

    headRender() {
        return [{
            id: 'columnName',
            name: ' '
        }, {
            id: 'rate',
            name: '提货费率'
        }, {
            id: 'averageCost',
            name: '提货单均成本'
        }, {
            id: 'cost',
            name: '提货成本'
        }, {
            id: 'orderMoney',
            name: '提货订单金额'
        }, {
            id: 'orderNum',
            name: '提货订单量'
        }, {
            id: 'customerNum',
            name: '提货客户数'
        }, {
            id: 'volume',
            name: '提货体积'
        }, {
            id: 'weight',
            name: '提货重量'
        }];
    }

    showArrow(cell, level, row, index, col) {
        if (row.a == 1) {
            return false
        }
        return true;
    }

    render() {
        const dataFormat = {
            "a": function (cell, level, row) {
                return cell + ' I am level ' + level
            },
            "b": function (cell, level, row, index, col) {
                if (level != 0) {
                    // let key = col[index - 1];
                    // return row[key.id || key];
                    return '';
                } else {
                    return cell + ' I am row b'
                }
            },
            "c": function (cell, level, row, index, col) {
                if (level != 0) {
                    let key = col[index - 2];
                    return row[key.id || key];
                } else {
                    return cell
                }
            },
            "d": function (cell, level, row, index, col) {
                if (level != 0) {
                    let key = col[index - 1];
                    return row[key.id || key];
                } else {
                    return cell + 1
                }
            }
        };
        const options = {
            page: 1,
            sizePerPage: 1,
            sizePageList: [10, 20, 30],
            paginationShowsTotal: true,
            onPageChange: function (page, sizePerPage) {

            }
        };

        const selectRow = {
            mode: "checkbox",
            bgColor: "rgb(238, 193, 213)",
            selected: this.state.selected,
            hideSelectColumn: false,
            onSelectAll: (checked, currentSelected) => {
                if (checked) {
                    let checkedList = currentSelected.map(item => {
                        return item.id;
                    });
                    this.setState(old => {
                        old.selected = checkedList;
                        return old;
                    })
                } else {
                    this.setState(old => {
                        old.selected = [];
                        return old;
                    })
                }
            },
            onSelect: (checked, row) => {
                if (checked) {
                    this.setState(old => {
                        old.selected.push(row.id);
                        return old
                    })
                } else {
                    this.setState(old => {
                        old.selected.splice(old.selected.indexOf(row.id), 1);
                        return old;
                    })
                }
            }
        };
        const style = {
            margin: "20px",
            background: "#fff"
        };
        return (
            <div>
                <div style={style}>
                    <TreeTable
                        iskey="a"
                        data={data}
                        nestedHead={[[{
                            label: '全国',
                            colspan: 4,
                            rowspan: 2
                        }, 'a', 'a', 'a', 'a'], ['b', 'b', 'b', 'b']]}
                    >
                        <TreeHeadCol width={200} dataField="a" dataFormat={dataFormat.a}>第一列</TreeHeadCol>
                        <TreeHeadCol dataField="b" dataSort={true} width={200}
                                     dataFormat={dataFormat.a}>第二列</TreeHeadCol>
                        <TreeHeadCol width={200} dataField="c" dataSort={true}
                                     dataFormat={dataFormat.a}>第三列</TreeHeadCol>
                        <TreeHeadCol width={200} dataField="d" hidden={false}>第四列</TreeHeadCol>
                        <TreeHeadCol width={200} dataField="d" hidden={false}>第五列</TreeHeadCol>
                        <TreeHeadCol dataField="d" hidden={false}>第六列</TreeHeadCol>
                        <TreeHeadCol dataField="d" hidden={true}>第七列</TreeHeadCol>
                        <TreeHeadCol width={150} dataFormat={()=> {
                            return <a href="#">freedom!</a>
                        }}>操作</TreeHeadCol>
                    </TreeTable>
                </div>
                <div style={style}>
                    <TreeTable
                        height="auto"
                        hashKey={true}
                        data={noKeyData}
                        pagination={true}
                        options={options}
                        onArrowClick={this.handleClick.bind(this)}
                    >
                        <TreeHeadCol dataField="a">第一列</TreeHeadCol>
                        <TreeHeadCol dataField="b">第二列</TreeHeadCol>
                        <TreeHeadCol dataField="c">第三列</TreeHeadCol>
                        <TreeHeadCol dataField="d">第四列</TreeHeadCol>
                    </TreeTable>
                </div>
                <div style={style}>
                    <TreeTable
                        iskey="id"
                        data={list}
                        isTree={false}
                        pagination={false}
                        selectRow={selectRow}
                    >
                        <TreeHeadCol dataField="id" dataAlign="center" dataFixed="left">id</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='regionRoleName'
                                     dataFixed="left">区域角色</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='systemRoleName'>系统角色</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='systemRoleName'>系统角色</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='systemRoleName'>系统角色</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='systemRoleName'>系统角色</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='systemRoleName'>系统角色</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataSort={true}
                                     dataField='systemRoleName'>系统角色</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='systemRoleName'>系统角色</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='systemRoleName'>系统角色</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='region'
                                     dataFixed="left">区域</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='createTime'>创建时间</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataField='description'
                                     dataFixed="right">描述</TreeHeadCol>
                        <TreeHeadCol dataAlign='center' width="150px" dataFormat={()=> {
                            return <a href="#">freedom!</a>
                        }}>操作</TreeHeadCol>
                    </TreeTable>
                </div>
                <div style={style}>
                    <TreeTable iskey='uniqueKey'
                               childrenPropertyName='chdatalist' expandRowKeys={this.state.expandRowKeys}
                               data={this.state.list} hover={false} onArrowClick={this.handleArrowClick.bind(this)}
                    >
                        {
                            this.headRender().map((item, index)=> {
                                return <TreeHeadCol key={index} dataAlign='center' showArrow={true}
                                                    dataField={item.id}>{item.name}</TreeHeadCol>
                            })
                        }
                    </TreeTable>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Main/>, document.querySelector('.main'));

```

## 如何跑example
到 github 克隆一份, 然后

```
    npm install
    npm run mock
    npm run dev
```

最后访问
```
    localhost:9010
```

## 另外
算宽度好累_(:з」∠)_
