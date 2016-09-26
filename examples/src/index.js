import React from 'react';
import ReactDOM from 'react-dom';
import {
    TreeTable,
    TreeHeadCol
} from '../../lib/Index.js';
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
        const nestedHead = [
            ['第一列', {
                colspan: 2,
                label: '喵呜'
            }]
        ];
        const options = {
            page: 1,
            sizePerPage: 1,
            sizePageList: [10, 20, 30],
            paginationShowsTotal: true,
            onPageChange: function (page, sizePerPage) {

            }
        };
        const that = this;
        const options2 = {
            page: this.state.page,
            sizePerPage: this.state.length,
            sizePageList: [10, 20, 30],
            paginationShowsTotal: true,
            onPageChange: function (page, sizePerPage) {
                fetch('http://localhost:3000/get').then(res => {
                    return res.json();
                }).then(json => {
                    that.setState({
                        page: page,
                        data: json,
                        length: sizePerPage
                    })
                })
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
                        dataSize={20}
                        remote={true}
                        nestedHead={[[{
                            label: '全国',
                            colspan: 4,
                            rowspan: 2
                        }, 'a', 'a', 'a', 'a'], ['b', 'b', 'b', 'b']]}
                        startArrowCol={1}
                        pagination={false}
                        arrowRender={(open)=>{return <a>{open ? '关闭' : '打开'}</a>}}
                    >
                        <TreeHeadCol width={200} dataField="a" dataFormat={dataFormat.a}>第一列</TreeHeadCol>
                        <TreeHeadCol dataField="b" dataSort={true} width={200}
                                     dataFormat={dataFormat.b}>第二列</TreeHeadCol>
                        <TreeHeadCol width={200} dataField="c" dataSort={true} dataFormat={dataFormat.c}
                        >第三列第三列第三列第三列第三列第三列第三列第三列第三列第三列第三列第三列第三列第三列第三列</TreeHeadCol>
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
                    >
                        <TreeHeadCol dataField="a" dataAlign="center">第一列</TreeHeadCol>
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
            </div>
        )
    }
}


ReactDOM.render(<Main/>, document.querySelector('.main'));