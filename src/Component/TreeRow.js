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

    handleToggle(e) {
        e.stopPropagation();
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
            isTree,
            hashKey,
            checked,
            isSelect,
            selectRow
        } = this.props;
        const key = hashKey ? data.__uid : data[iskey];
        if (isSelect) {
            output.push(
                <td key={key} style={{backgroundColor: checked && selectRow.bgColor,textAlign: 'center'}}>
                    <input type={selectRow.mode} checked={checked} readOnly={true}/>
                </td>
            )
        }
        cols.map((key, i, col) => {

            let cell = data[key.id];
            let dataFormat = key.dataFormat;
            let children = data.list || data.chdatalist || data.children;
            children = children && children.length > 0;

            const style = {
                width: key.width,
                minWidth: key.width,
                textAlign: key.dataAlign,
                display: key.hidden && 'none',
                backgroundColor: isSelect && checked && selectRow.bgColor
            };

            if (dataFormat) {
                cell = dataFormat.call(null, data[key.id], level, data, i, col)
            }

            if (cell !== "") {
                arrow++;
            }

            const showArrow = isTree && key.showArrow.call(null, data[key.id], level, data, i, col);
            output.push(
                <td style={style}
                    key={'' + key + i}
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
        let {
            data,
            level,
            isTree,
            checked,
            isSelect,
            selectRow
        } = this.props;
        return (
            <tr className={isTree && !level && "ancestor"}
                onClick={isSelect ? ()=>selectRow.onSelect(!checked, data) : ()=> {
                    return false;
                }}
            >
                {this.cellRender()}
            </tr>
        )
    }
}

TreeRow.defaultProps = {
    level: 0,
    hashKey: false
};