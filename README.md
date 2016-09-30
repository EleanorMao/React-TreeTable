# React-TreeTable
    A kind of Table _(┐「ε:)_❤
    将树形结构数据渲染成表格形式

## api
[中文API](./README_zh-CN.md)
### TreeTable
* **data[Array]**   data you want display on table (default leaf node property name is `list`)
* **childrenPropertyName[String]** customize leaf node property, default is `list`
* **iskey[String]** key of column
* **hashKey[Boolean]**   default is `fasle`, if data not have a unique key, then set it to `true`, `react-treetable` will init a `uid` default property name is `__uid`
* **uid[String]** default is `__uid`, property for init `uid`
* **isTree[Boolean]**  default is `true`, tell table is data a tree. If you set it to `false`, when you want to render a normal table , to some extent, can save performance , but please don't set `hashKey` to `true`
* **remote[Boolean]** if set `true` , which means you want to handle data change, `react-treetable` will give control of `onPageChange`, `onSortChange`, `sortName`, `sortOrder` to parent component
* **dataSize[Number]** total size of data, only useful when remote `enabled`
* **sortOrder[String]** sort order, `asc` or `desc`
* **sortName[String]** sort field in table
* **onSortChange[Function(sortName, sortOrder)]** sort function, `sortOrder` will be `asc` or `desc`
* **expandAll[Boolean]** default is `false`, expand all rows initially
* **expandRowKeys[Array]** expanded rows keys
* **clickToCloseAll[Boolean]** collapse all leaf when click to collapse, default is `true`
* **startArrowCol[Number]** set expand arrow button show start from `startArrowCol` column, default is `0`
* **arrowRender[Function(open)]** render function of expand arrow button
* **onArrowClick[Function(collapse, data，parent)]** function when click expand arrow button, arguments -> `collapse`,`data`, `parent`, and one callback `callback`, be sure `callback(data)`(since I should deal width async😢. ps: if you want add leaf when expand like me, please use references of data)。`collapse` means whether or not you are collapsing the row ?
* **pagination[Boolean]** default is `false`, set `true` to enable pagination
* **options[Object]** configuration of pagination
    * **page[Number]** means the page you want to show as default
    * **prevLabel[String | Number | Node]** customize previous page button
    * **nextLabel[String | Number | Node]** customize next page button
    * **startLabel[String | Number | Node]** customize page button of back to first page
    * **endLabel[String | Number | Node]** customize page button of back to last page
    * **sizePerPage[Number]** size per page, default is `10`
    * **paginationSize[Number]** pagination bar length, default is `6`
    * **onPageChange[Function(page, sizePerPage)]** callback when page changed
    * **paginationShowsTotal[Boolean | Function(start, to , total)]** display a text that the total number and current lines displayed, default is `false`
* **selectRow[Object]** configuration of row selection (be sure `isTree` is `false`）
    * **mode['none', 'radio', 'checkbox']** type of selector, default is `none`
    * **bgColor[String]** background color of tag `tr` when selected
    * **selected[Array]** selected row keys
    * **hideSelectColumn[Boolean]** hide select column or not default is `false`
    * **onSelect[Function(isSelected, row)]** callback when select
    * **onSelectAll[Function(isSelected, data)]** callback when select all
* **hover[Boolean]** default is `true`
* **hoverStyle[Object]** default is `{backgroundColor: '#f5f5f5'}`, will effect tag `tr`
* **width[Number | String]** width
* **height[Number | String]** height
* **title[Function(data) | String | Number | Node]** table title
* **footer[Function(data) | String | Number | Node]** table footer
* **nestedHead[Array]** nestedHead([[],[]]), `string` or `{label: '', colspan: 1, rowspan: 1}`

### TreeHeadCol
* **dataField[String]** key of column
* **dataAlign[String]** text align of column
* **dataFixed[String]** this column will be fixed when table scroll, `left`, `right` or `auto`, default is `auto`
* **dataSort[Boolean]** enable table sorting, default is `false`(only sort the first level of data when isTree)
* **dataFormat[Function(cell, level, row, index, col)]** customize format function
* **hidden[Boolean]** hide this column or not, default is `false`
* **width[Number | String]** width of column
* **showArrow[Function(cell, level, row, index, col) | Boolean]** force to show expand arrow button(on startArrowCol basis)

## example code⬇

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

## run example

```
    npm install
    npm run mock
    npm run dev
```

then open
```
    localhost:9010
```

## ps
really tired to  calculate column width _(:з」∠)_
