/**
 * Created by BG236557 on 2016/9/19.
 */
import React, {
    Component,
    PropTypes
} from 'react';

import {empty, sort} from './Util';

export default class TreeHeader extends Component {
    constructor(props) {
        super(props);
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

    colgroupRender(renderChildren, left, right) {
        let i = 0;
        return (
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
        let i = 0;
        let renderChildren = sort(children).sorted;
        return (
            <div className="table-container table-header-container" ref="header">
                <table className="table table-bordered">
                    {this.colgroupRender(renderChildren, left, right)}
                    <thead>
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
