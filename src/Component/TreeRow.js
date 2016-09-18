/**
 * Created by BG236557 on 2016/5/27.
 */
import React from 'react';

const Component = React.Component;

let _extends = function(target) {
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
        let data = _extends({}, {
            opened: this.state.open
        }, {
            data: this.props.data
        });
        this.setState(old => {
            old.open = !old.open;
            return old;
        });
        this.props.onClick(data);
    }

    cellRender() {
        let output = [];
        let arrow = -1;
        let {
            open,
            data,
            cols,
            iskey,
            level,
            hashKey
        } = this.props;
        cols.map((key, i, col) => {
            let cell = data[key.id];
            let dataFormat = key.dataFormat;
            let children = data.list || data.chdatalist || data.children;
            children = children && children.length > 0;
            let style = {
                minWidth: key.width,
                width: key.width,
            };
            if (key.hidden) {
                style.display = 'none';
            }
            if (dataFormat) {
                cell = dataFormat.call(null, data[key.id], level, data, i, col)
            }
            if (cell !== "") {
                arrow++;
            }
            const showArrow = key.showArrow.call(null, data[key.id], level, data, i, col);
            output.push(
                <td  style={style}
                     key={hashKey ? data.__uid + i : data[iskey] + i}
                >
                    <span style={{marginLeft: level * 10 + 'px'}}>
                        {cell}
                        {showArrow && !!children && !arrow &&
                            <i
                                className="table-arrow fa fa-chevron-down"
                                style={open ? {transform: 'rotate(-90deg)'} : {}}
                                onClick={this.handleToggle.bind(this)}
                            > </i>
                        }
                    </span>
                </td>
            )
        });
        return output;
    }

    render() {
        return (
            <tr className={!this.props.level && "ancestor"}>
                {this.cellRender()}
            </tr>
        )
    }
}

TreeRow.defaultProps = {
    level: 0
};