/**
 * Created by BG236557 on 2016/5/27.
 */
import React from 'react';

const Component = React.Component;

let _extends = function (target) {
    for (let i = 1; i < arguments.length; i++) {
        let source = arguments[i];
        for (let key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

export default class TreeRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        }
    }

    handleToggle(event) {
        let data = _extends({}, {display: this.state.open}, {data: this.props.data});
        this.setState(old => {
            old.open = !old.open;
            return old;
        });
        this.props.onClick(data);
    }

    cellRender() {
        let output = [];
        let data = this.props.data;
        let iskey = this.props.iskey;
        let hashKey = this.props.hashKey;
        let dataFormat = this.props.dataFormat;
        let open = this.state.open;
        let arrow = -1;
        this.props.cols.map((key, i, col) => {
            let children = data.list || data.chdatalist || data.children;
            let cell = data[key.id || key];
            if (dataFormat && dataFormat[key.id || key]) {
                cell = dataFormat[key.id || key].call(null, data[key.id || key], data.level, data, i, col)
            }
            if (cell) {
                arrow++;
            }
            output.push(
                <div className="table-cell"
                     style={{width: key.width || this.props.width}}
                     key={hashKey ? data.uid + i : data[iskey] + i}
                >
                    <span style={{marginLeft: this.props.level * 10 + 'px'}}>
                        {cell}
                        {children && children.length > 0 && !!!arrow ?
                            <i
                                className="table-arrow fa fa-chevron-down"
                                style={open ? {transform: 'rotate(-90deg)'} : {}}
                                onClick={this.handleToggle.bind(this)}
                            > </i> : '' }
                    </span>
                </div>
            )
        });
        return output;
    }

    render() {
        return (
            <div className={!!this.props.level ? "table-row clearfix" : "table-row ancestor clearfix"} ref="row">
                {this.cellRender()}
            </div>
        )
    }
}

TreeRow.defaultProps = {
    level: 0
};
