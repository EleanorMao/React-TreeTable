import React from 'react';
import ReactDOM from 'react-dom';
import {
    TreeTable,
    TreeHeadCol
} from '../../lib/Index.js';

const Component = React.Component;

const data = [{
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

const noKeyData = [{
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
}, {
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
            selected: []
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
                        options={options}
                        pagination={false}
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