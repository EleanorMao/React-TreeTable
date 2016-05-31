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

class Main extends Component{
    constructor(){
        super();
        this.state = {a: 0}
    }

    render(){
        let headRow = [
            {id: "a", name: "RowA"},
            {id: "b", name: "RowB"},
            {id: "c", name: "RowC"},
            {id: "d", name: "RowD"}
        ];
        return (
            <div>
                <TreeTable data={data} iskey="a" headRow={headRow}/>
            </div>
        )
    }
}

ReactDOM.render(<Main/>, document.querySelector('.main'));
