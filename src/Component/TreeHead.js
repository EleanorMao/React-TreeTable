/**
 * Created by BG236557 on 2016/9/19.
 */
import React, {
    Component,
    PropTypes
} from 'react';

import {isObj, empty, sort} from './Util'


export default class TreeHead extends Component {
    constructor(props) {
        super(props);
    }

    nestedHeadRender(neseted, selectRow, isTree) {
        let output = [];
        const select = !isTree && selectRow.mode !== 'none';
        neseted.map((throws, index) => {
            let item =
                <tr key={'trow' + index}>
                    {select && <th key='trow-1'/>}
                    {throws.map((cell, i) => {
                        let obj = isObj(cell);
                        return <th colSpan={obj && cell.colspan || 1} rowSpan={obj && cell.rowspan || 1}
                                   key={i}>{obj ? cell.label : cell}</th>
                    })}
                </tr>;
            output.push(item);
        });
        return output;
    }

    selectRender(selectRow, onSelectAll, checked) {
        const mode = selectRow.mode;
        if (mode === 'checkbox') {
            return (
                <th onClick={()=>onSelectAll(!checked)} style={{textAlign: 'center', width: 30}}>
                    <input type={mode} checked={checked} readOnly={true}/>
                </th>
            )
        } else if (mode === 'radio') {
            return <th/>
        } else {
            return false;
        }
    }

    render() {
        const {
            onSort,
            isTree,
            checked,
            children,
            sortName,
            sortOrder,
            selectRow,
            nestedHead,
            onSelectAll
        } = this.props;
        let i = 0;
        let renderChildren = sort(children).sorted;
        return (
            <table className="table table-bordered">
                <thead>
                {!!nestedHead.length && this.nestedHeadRender(nestedHead, selectRow, isTree)}
                <tr ref="thead">
                    {!isTree && this.selectRender(selectRow, onSelectAll, checked)}
                    {  React.Children.map(renderChildren, (elm)=> {
                        return React.cloneElement(elm, {key: i++, onSort, sortName, sortOrder});
                    })}
                </tr>
                </thead>
            </table>
        )
    }
}

TreeHead.defaultProps = {
    selectRow: {
        mode: 'none',
        bgColor: '#dff0d8',
        selected: [],
        onSelect: empty,
        onSelectAll: empty
    }
};
