# React-TreeTable
将树形结构数据渲染成表格形式

## 参数提供
### TreeTable
* data[Array]   数据入口, 子节点可命名为children 或者 list 或者 chdatalist
* iskey[String]   作为key用的那个字段的名字
* hashKey[Boolean]   默认是`fasle`, 如果没有唯一的id, 那就传`true`, 本表格会帮你造一个uid
* width[number | string] 宽度
* height[number | string] 高度
* remote[boolean] 如果是true则将翻页的控制权交给父组件
* dataSize 数据总条数，仅在开启remote后有用
* pagination[boolean] 默认是`false`, 是否开启分页器
* options[Object] 分页器配置
    * page[int] 默认显示的当前页, 默认是第一页
    * sizePerPage[int] 每页多长, 默认是十条
    * onPageChange(page, sizePerPage) 点击分页器时调用
    * paginationShowsTotal[boolean | function(start, to , total)] 显示条数导航
* handleClick[function] 点击展开按钮的时候会把数据丢给你可以处理，会返回`opened`,`data`两个参数和一个callback`callback`，务必要`callback(data)`(为了处理异步的情况暂别无他法)。`opened`为`false`的时候意味着叶子节点是关闭状态，如果是`true`说明叶子节点是展开的

### TreeHeadCol
* dataField[string] 数据的key值
* dataFormat[function(cell, level, row, index, col)] 自定义渲染方法
* hidden[boolean] 是否隐藏
* width[number | string] 宽度
* showArraw[function(cell, level, row, index, col)] 是否显示箭头

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
            a: 0
        }
    }

    handleClick(display, data, callback) {
        if (!display) {
            fetch('http://localhost:3000/get?a=5').then(res => {
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
        let dataFormat = {
            "a": function(cell, level, row) {
                if (level != 0) {
                    return '';
                } else {
                    return cell + ' I am row a'
                }
            },
            "b": function(cell, level, row, index, col) {
                if (row.level != 0) {
                    let key = col[index - 1];
                    return row[key.id || key];
                } else {
                    return cell + ' I am row b'
                }
            },
            "c": function(cell, level, row, index, col) {
                if (row.level != 0) {
                    let key = col[index - 1];
                    return row[key.id || key];
                } else {
                    return cell
                }
            },
            "d": function(cell, level, row, index, col) {
                if (row.level != 0) {
                    let key = col[index - 1];
                    return row[key.id || key];
                } else {
                    return cell + 1
                }
            }
        };

        let options = {
            page: 1,
            sizePerPage: 2,
            paginationShowsTotal: true,
            onPageChange: function(page, sizePerPage) {}
        };

        return (
            <div>
                <div style={{margin: "20px"}}>
                    <TreeTable data={data} iskey="a" pagination={false} options={options}>
                        <TreeHeadCol dataField="a" dataFormat={dataFormat.a}>第一列</TreeHeadCol> 
                        <TreeHeadCol dataField="b" dataFormat={dataFormat.b}>第二列</TreeHeadCol> 
                        <TreeHeadCol dataField="c" width={300}>第三列</TreeHeadCol> 
                        <TreeHeadCol dataField="d" hidden={true}>第四列</TreeHeadCol> 
                    </TreeTable>
                </div>
                 <div style={{margin: "20px"}}>
                    <TreeTable data={noKeyData} hashKey={true} pagination={true} options={options}>
                        <TreeHeadCol dataField="a" >第一列</TreeHeadCol> 
                        <TreeHeadCol dataField="b" dataFormat={dataFormat.b}>第二列</TreeHeadCol> 
                        <TreeHeadCol dataField="c" >第三列</TreeHeadCol> 
                        <TreeHeadCol dataField="d" >第四列</TreeHeadCol> 
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
    npm run example
```

最后访问
```
    localhost:9010
```

## 另外
算宽度好累_(:з」∠)_
