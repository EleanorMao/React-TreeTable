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

let noKeyData = [{
    "a": 0,
    "b": 0,
    "c": 3,
    "d": 4,
    "list": [{
        "a": 11,
        "b": 21,
        "c": 31,
        "d": 41,
        "list": [{
            "a": 111,
            "b": 222,
            "c": 333,
            "d": 444,
            "list": [{
                "a": 1111,
                "b": 2222,
                "c": 3333,
                "d": 4444
            }, {
                "a": 1112,
                "b": 2222,
                "c": 3333,
                "d": 4444
            }]
        }]
    }, {
        "a": 12,
        "b": 22,
        "c": 32,
        "d": 42
    }]
}, {
    "a": 2,
    "b": 3,
    "c": 4,
    "d": 5,
    "list": [{
        "a": 22,
        "b": 32,
        "c": 42,
        "d": 52,
        "list": []
    }]
}, {
    "a": 3,
    "b": 2,
    "c": 3,
    "d": 4,
    "list": [{
        "a": 31,
        "b": 21,
        "c": 31,
        "d": 41,
        "list": [{
            "a": 311,
            "b": 222,
            "c": 333,
            "d": 444,
            "list": [{
                "a": 3111,
                "b": 2222,
                "c": 3333,
                "d": 4444
            }, {
                "a": 3112,
                "b": 2222,
                "c": 3333,
                "d": 4444
            }]
        }]
    }, {
        "a": 32,
        "b": 22,
        "c": 32,
        "d": 42
    }]
}, {
    "a": 4,
    "b": 3,
    "c": 4,
    "d": 5,
    "list": [{
        "a": 42,
        "b": 32,
        "c": 42,
        "d": 52,
        "list": []
    }]
}]

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
            onPageChange: function(page, sizePerPage) {

            }
        };

        return (
            <div>
                <div style={{margin: "20px"}}>
                    <TreeTable data={data} iskey="a" pagination={false} options={options}>
                        <TreeHeadCol dataField="a" dataFormat={dataFormat.a} showArrow={this.showArrow}>第一列</TreeHeadCol> 
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
