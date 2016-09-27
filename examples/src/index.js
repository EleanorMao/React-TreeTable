import React from 'react';
import ReactDOM from 'react-dom';
import {
    TreeTable,
    TreeHeadCol
} from '../../src/Index.js';
import {noKeyData, data, list} from './fackData';

const Component = React.Component;

class Main extends Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            length: 10,
            selected: [],
            data: data
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
            hideSelectRow: false,
            onSelectAll: (checked, currentSelected)=> {
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
                    >
                        <TreeHeadCol width={200} dataField="a" dataFormat={dataFormat.a}>第一列</TreeHeadCol>
                        <TreeHeadCol dataField="b" dataSort={true} width={200}
                                     dataFormat={dataFormat.b}>第二列</TreeHeadCol>
                        <TreeHeadCol width={200} dataField="c" dataSort={true}
                                     dataFormat={dataFormat.c}>第三列</TreeHeadCol>
                        <TreeHeadCol width={200} dataField="d" hidden={false}>第四列</TreeHeadCol>
                        <TreeHeadCol width={200} dataField="d" hidden={false}>第五列</TreeHeadCol>
                        <TreeHeadCol dataField="d" hidden={true}>第六列</TreeHeadCol>
                        <TreeHeadCol dataField="d" hidden={true}>第七列</TreeHeadCol>
                        <TreeHeadCol width={150} dataFormat={()=> {
                            return <a href="#">freedom!</a>
                        }}>操作</TreeHeadCol>
                    </TreeTable>
                </div>
                {/*hashKey={true}*/}
                {/*data={noKeyData}*/}
                <div style={style}>
                    <TreeTable
                        height="auto"
                        hover={false}
                        iskey="a"
                        data={data}
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