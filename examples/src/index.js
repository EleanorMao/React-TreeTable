import React from 'react';
import ReactDOM from 'react-dom';
import TreeTable from '../../lib/Index.js';

const Component = React.Component;

let data = [{
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    list: [{
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
            }, {
                a: 1112,
                b: 2222,
                c: 3333,
                d: 4444
            }]
        }]
    }, {
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
        this.state = {a: 0}
    }

    render() {
        let headRow = [
            {id: "a", name: "RowA", width: "200px"},
            {id: "b", name: "RowB", width: "200px"},
            {id: "c", name: "RowC", width: "300px"},
            {id: "d", name: "RowD", width: "400px"}
        ];
        let dataFormat = {
            "a": function (cell, level, row) {
                if (level != 0) {
                    return '';
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
