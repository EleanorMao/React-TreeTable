# React-TreeTable
将树形结构数据渲染成表格形式

## 参数提供
* data[Array]   数据入口, 子节点可命名为children 或者 list 或者 chdatalist
* headRow[Array]   表头数据, 会根据提供的表头数据作为渲染data的依据, 格式可以是`[key, key, key...]` 或者 `[{id: key, name: name, width: width}] `, `name` 和 `width` 不是必须的, 如果有 `name` 会把 `name` 作为对应的表头名, 如果有 `width`, 那会吧 `width` 作为对应每个单元格的宽, 不然就是按百分比计算宽度
* iskey[String]   作为key用的那个字段的名字
* hashKey[Boolean]   默认是`fasle`, 如果没有唯一的id, 那就传`true`, 本表格会帮你造一个uid
* dataFormat[Obeject]   格式化数据, 可以获取到 `cell`, `row`, `level`, `index`, `col` 5个参数, 分别是这个单元格是数据, 这一行的数据, 这行的等级, 当前单元格的角标, 还有headRow

## 让我们用代码说话⬇
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import TreeTable from 'react-treetable';

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

class Main extends Component{
    constructor(){
        super();
    }

    render(){
        let headRow = [
            {id: "a", name: "RowA", width: "200px"},
            {id: "b", name: "RowB"},
            {id: "c", name: "RowC"},
            {id: "d", name: "RowD"}
        ];
        let dataFormat = {
                    "a": function (cell, level, row) {
                        if (level != 0) {
                            return 'I AM CHILD' + level;
                        } else {
                            return cell + ' I am row a'
                        }
                    },
                    "b": function (cell, level ,row, index, col) {
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
                        if(row.level != 0){
                            let key = col[index - 1];
                            return row[key.id || key];
                        }else{
                            return cell + 1
                        }
                    }
                };
        //headRow可以是[key, key, ...] 或 [{id: '', name: '', width: ''}, ...]形式, name 和 width 不是必须
        return (
            <div>
                <div style={{margin: "20px"}}>
                    <TreeTable data={data} iskey="a" headRow={headRow} dataFormat={dataFormat}/>
                </div>
                <div style={{margin: "20px"}}>
                    <TreeTable data={noKeyData} hashKey={true} headRow={headRow}/>
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
本表格的样式除了单元格宽度以外都是用class控制的, 所以如果你看着不顺眼, 请自由的修改css
