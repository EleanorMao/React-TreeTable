# React-TreeTable
将树形结构数据渲染成表格形式

## 参数提供
### TreeTable
* iskey[String]   作为key用的那个字段的名字
* data[Array]   数据入口, 子节点可命名为`children` 或者 `list` 或者 `chdatalist`
* hover[Boolean] 默认是`true`， 开启就有hover效果
* hoverStyle[Object] 默认是`{backgroundColor: '#f5f5f5'}`
* isTree[Boolean]  是否是树形结构，开启后不能是有hashKey模式，一定程度上节省了性能
* hashKey[Boolean]   默认是`fasle`, 如果没有唯一的id, 那就传`true`, 本表格会帮你造一个`uid`
* width[Number | String] 宽度
* height[Number | String] 高度
* remote[Boolean] 如果是true则将翻页`onPageChange`的控制权和排序`onSortChange`,`sortName`,`sortOrder`交给父组件
* dataSize[Number] 数据总条数，仅在开启remote后有用
* sortName[String] 排序的列名
* sortOrder[String] `asc`或`desc`
* pagination[Boolean] 默认是`false`, 是否开启分页器
* startArrowCol[Number] 设置后展开箭头将从第`startArrowCol`开始出现(从0开始), 默认是`0`
* nestedHead[Array] 套头，是[[],[]]格式， 里面的数组设置套头的格式，可以是字符串或是对象，对象的话可用参数为colspan和label还有rowspan
* options[Object] 分页器配置
    * page[Number] 默认显示的当前页, 默认是第一页
    * prevLabel 分页器的上一页
    * startLabel 分页器的下一页
    * startLabel 分页器的回到第一页
    * endLabel 分页器的回到最后一页
    * sizePerPage[Number] 每页多长, 默认是十条
    * onPageChange(page, sizePerPage) 点击分页器时调用
    * paginationShowsTotal[Boolean | Function(start, to , total)] 显示条数导航
* selectRow[Object] 选择框（仅能在`isTree`是`false`的情况下使用）
    * mode['none', 'radio', 'checkbox'] 选择框的类型
    * bgColor[String] 选中后的背景色
    * selected[Array] 选中的由每行key值组成的数组
    * onSelect[Function(isSelected, row)] 选中单行时的回调函数
    * onSelectAll[Function(isSelected, data)] 选中全部时的回调函数
* onArrowClick[Function] 点击展开按钮的时候会把数据丢给你可以处理，会返回`opened`,`data`两个参数和一个callback`callback`，务必要`callback(data)`(为了处理异步的情况暂别无他法)。`opened`为`false`的时候意味着叶子节点是关闭状态，如果是`true`说明叶子节点是展开的
* onSortChange[Function(sortName, sortOrder)] 排序时候调用, `sortOrder`是`asc`或`desc`

### TreeHeadCol
* dataField[String] 数据的key值
* dataAlign[String] textAlign的姿势
* dataSort[Boolean] 是否开启排序 
* dataFormat[Function(cell, level, row, index, col)] 自定义渲染方法
* hidden[Boolean] 是否隐藏
* width[Number | String] 宽度
* showArrow[Function(cell, level, row, index, col) | Boolean] 强制该列是否显示展开箭头

## 让我们用代码说话⬇
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {
    TreeTable,
    TreeHeadCol
} from '../../lib/Index.js';

const Component = React.Component;

let data = [{
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    list: [{ //子节点可以命名为children || list || chdatalist
        a: 11,
        b: 21,
        c: 31,
        d: 41,
        list: [{
            a: 111,
            b: 222,
            c: 333,
            d: 444,
            list: [{
                a: 1111,
                b: 2222,
                c: 3333,
                d: 4444
            },{
                a: 1112,
                b: 2222,
                c: 3333,
                d: 4444
            }]
        }]
    },{
        a: 12,
        b: 22,
        c: 32,
        d: 42
    }]
}, {
    a: 2,
    b: 3,
    c: 4,
    d: 5,
    list: [{
        a: 22,
        b: 32,
        c: 42,
        d: 52,
        list: []
    }]
}];

let noKeyData = [
    {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        list: [{
            a: 1,
            b: 2,
            c: 3,
            d: 4
        }]
    },{
        a: 1,
        b: 2,
        c: 3,
        d: 4
    }
];

class Main extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            length: 10,
            selected: []
        }
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

    showArrow(cell, level, row, index, col) {
        if (row.a == 1) {
            return false
        }
        return true;
    }

    render() {
        const dataFormat = {
            "a": function (cell, level, row) {
                if (level != 0) {
                    return '';
                } else {
                    return cell + ' I am row a'
                }
            },
            "b": function (cell, level, row, index, col) {
                if (row.level != 0) {
                    let key = col[index - 1];
                    return row[key.id || key];
                } else {
                    return cell + ' I am row b'
                }
            },
            "c": function (cell, level, row, index, col) {
                if (row.level != 0) {
                    let key = col[index - 1];
                    return row[key.id || key];
                } else {
                    return cell
                }
            },
            "d": function (cell, level, row, index, col) {
                if (row.level != 0) {
                    let key = col[index - 1];
                    return row[key.id || key];
                } else {
                    return cell + 1
                }
            }
        };
        const nestedHead = [
            ['第一列', {
                colspan: 2,
                label: '喵呜'
            }]
        ];
        const options = {
            page: 1,
            sizePerPage: 2,
            sizePageList: [10, 20, 30],
            paginationShowsTotal: true,
            onPageChange: function (page, sizePerPage) {

            }
        };

        return (
            <div>
                <div style={{margin: "20px"}}>
                    <TreeTable
                        iskey="a"
                        data={data}
                        pagination={false}
                        isTree={false}
                        nestedHead={nestedHead}
                        selectRow={{
                            mode: "checkbox",
                            bgColor: "rgb(238, 193, 213)",
                            selected: this.state.selected,
                            onSelectAll: (checked, currentSelected)=> {
                                if (checked) {
                                    let checkedList = currentSelected.map(item => {
                                        return item.a;
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
                                        old.selected.push(row.a);
                                        return old
                                    })
                                } else {
                                    this.setState(old => {
                                        old.selected.splice(old.selected.indexOf(row.a), 1);
                                        return old;
                                    })
                                }
                            }
                        }}
                    >
                        <TreeHeadCol dataField="a" width={700} dataFormat={dataFormat.a}
                                     showArrow={this.showArrow}>第一列</TreeHeadCol>
                        <TreeHeadCol dataField="b" dataSort={true} dataFormat={dataFormat.b}>第二列</TreeHeadCol>
                        <TreeHeadCol dataField="c" dataSort={true} width={300}>第三列</TreeHeadCol>
                        <TreeHeadCol dataField="d" hidden={true}>第四列</TreeHeadCol>
                    </TreeTable>
                </div>
                <div style={{margin: "20px"}}>
                    <TreeTable
                        height="40px"
                        hashKey={true}
                        data={noKeyData}
                        pagination={true}
                        options={options}
                    >
                        <TreeHeadCol dataField="a" dataAlign="center">第一列</TreeHeadCol>
                        <TreeHeadCol dataField="b">第二列</TreeHeadCol>
                        <TreeHeadCol dataField="c">第三列</TreeHeadCol>
                        <TreeHeadCol dataField="d">第四列</TreeHeadCol>
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
    npm run dev
```

最后访问
```
    localhost:9010
```

## 另外
算宽度好累_(:з」∠)_
