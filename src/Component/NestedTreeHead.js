/**
 * Created by elly on 16/9/26.
 */
import React, {
    Component,
    PropTypes
} from 'react';

import {isObj} from './Util';

export default class NestedTreeHead extends Component {
    constructor(props) {
        super(props);
    }

    nestedHeadRender() {
        let output = [];
        const {nestedHead, isTree, selectRow} = this.props;
        const select = !isTree && selectRow.mode !== 'none';
        nestedHead.map((throws, index) => {
            let item =
                <tr key={'trow' + index}>
                    {select && <th key='trow-1'/>}
                    {throws.map((cell, i) => {
                        let obj = isObj(cell);
                        return <th colSpan={obj && cell.colspan || null}
                                   rowSpan={obj && cell.rowspan || null}
                                   key={i}>{obj ? cell.label : cell}</th>
                    })}
                </tr>;
            output.push(item);
        });
        return output;
    }

    colgroupRender() {
        const cols = this.props.cols;
        let output = [];
        for (let i = 0; i < cols; i++) {
            output.push(<col key={i}/>)
        }
        return output;
    }

    render() {
        return (
            <table className="table table-bordered table-striped table-hover">
                <colgroup ref="colgroup">{this.colgroupRender()}</colgroup>
                <thead>{this.nestedHeadRender()}</thead>
            </table>
        )
    }
}

NestedTreeHead.defaultProps = {
    nestedHead: PropTypes.arrayOf(PropTypes.array)
};