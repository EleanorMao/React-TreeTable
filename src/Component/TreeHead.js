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

    nestedHeadRender(neseted, selectRow, isTree, left) {
        let output = [];
        const select = !isTree && selectRow.mode !== 'none';
        neseted.map((throws, index) => {
            let item =
                <tr key={'trow' + index}>
                    {select && <th key='trow-1'/>}
                    {throws.map((cell, i) => {
                        let obj = isObj(cell);
                        let colspan = null;
                        if (obj && cell.colspan) {
                            colspan = left ? (cell.colspan < left ? cell.colspan : left) : cell.colspan;
                        }
                        return <th colSpan={colspan}
                                   rowSpan={obj && cell.rowspan || null}
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
            left,
            right,
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
                <colgroup ref="colgroup">
                    {  React.Children.map(renderChildren, (elm)=> {
                        if (left && elm.props.dataFixed !== 'left') return;
                        if (right && elm.props.dataFixed !== 'right') return;
                        let style = {
                            width: elm.props.width,
                            minWidth: elm.props.width,
                            textAlign: elm.props.dataAlign,
                            display: elm.props.hidden && 'none'
                        };
                        return <col key={i} style={style}/>
                    })}
                </colgroup>
                <thead>
                {!!nestedHead.length && this.nestedHeadRender(nestedHead, selectRow, isTree, left)}
                <tr ref="thead">
                    {!isTree && this.selectRender(selectRow, onSelectAll, checked)}
                    {  React.Children.map(renderChildren, (elm)=> {
                        if (left && elm.props.dataFixed !== 'left') return;
                        if (right && elm.props.dataFixed !== 'right') return;
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
