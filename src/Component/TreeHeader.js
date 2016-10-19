/**
 * Created by BG236557 on 2016/9/19.
 */
import React, {
    Component,
    PropTypes
} from 'react';

import {empty, sort, isArr} from './Util';

export default class TreeHeader extends Component {
    constructor(props) {
        super(props);
    }

    selectRender(mode, onSelectAll, checked) {
        if (mode === 'checkbox') {
            return (
                <th onClick={()=>onSelectAll(!checked)} style={{textAlign: 'center', width: 30}} data-input={mode}>
                    <input type={mode} checked={checked} readOnly={true}/>
                </th>
            )
        } else if (mode === 'radio') {
            return <th data-input={mode}/>
        } else {
            return false;
        }
    }

    colgroupRender(renderChildren, selectRow, isTree, left, right) {
        let i = 0;
        return (
            <colgroup ref="colgroup">
                {selectRow.mode !== 'none' && !selectRow.hideSelectColumn && !isTree &&
                <col key="select" style={{textAlign: 'center', width: 30}}/>}
                {  React.Children.map(renderChildren, (elm)=> {
                    if (left && elm.props.dataFixed !== 'left') return;
                    if (right && elm.props.dataFixed !== 'right') return;
                    let style = {
                        width: elm.props.width,
                        maxWidth: elm.props.width,
                        textAlign: elm.props.dataAlign,
                        display: elm.props.hidden && 'none'
                    };
                    return <col key={i} style={style}/>
                })}
            </colgroup>
        )
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
            onSelectAll
        } = this.props;
        let i = 0, colSpan, target;
        let renderChildren = isArr(children) ? children : [children];
        renderChildren = sort(renderChildren, 123).sorted;
        return (
            <div className="table-container table-header-container" ref="header">
                <table className="table table-bordered">
                    {this.colgroupRender(renderChildren, selectRow, isTree, left, right)}
                    <thead>
                    <tr ref="thead">
                        {!isTree && !selectRow.hideSelectColumn && this.selectRender(selectRow.mode, onSelectAll, checked)}
                        {  React.Children.map(renderChildren, (elm)=> {
                            if (left && elm.props.dataFixed !== 'left') return;
                            if (right && elm.props.dataFixed !== 'right') return;
                            if (colSpan && target < i && i < colSpan) {
                                i++;
                                return;
                            }
                            if (elm.props.colSpan) {
                                target = i;
                                colSpan = elm.props.colSpan + i;
                            }
                            return React.cloneElement(elm, {key: i++, onSort, sortName, sortOrder});
                        })}
                    </tr>
                    </thead>
                </table>
            </div>
        )
    }
}

TreeHeader.defaultProps = {
    left: 0,
    right: 0,
    selectRow: {
        mode: 'none',
        bgColor: '#dff0d8',
        selected: [],
        onSelect: empty,
        onSelectAll: empty
    }
};
