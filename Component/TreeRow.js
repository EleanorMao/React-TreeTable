/**
 * Created by Elly on 2016/5/27.
 */
import React from 'react';

const Component = React.Component;

var _extends = function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
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
    }

    handleToggle(event) {
        let target = event.target;
        let rotate = target.style.transform;
        if (rotate) {
            target.style.transform = ''; 
        } else {
            target.style.transform = 'rotate(-90deg)'; 
        }
        let data = _extends({}, {display: rotate ? 1 : 0}, {data: this.props.data});
        this.props.onClick(data);
    }

    cellRender() {
        let output = [];
        let data = this.props.data;
        let iskey = this.props.iskey;
        this.props.cols.forEach((key, i) => {
            output.push(
                <div className="table-cell"
                     style={{width: this.props.width}}
                     key={data[iskey] + i}
                >
                    <span style={{marginLeft: this.props.level * 10 + 'px'}}>
                        {data[key.id || key]}
                        {(data.list || data.chdatalist || data.children) && !i ?
                            <i
                                className="table-arrow glyphicon glyphicon-menu-down"
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
            <div
                className={!!this.props.level ? "table-row clearfix" : "table-row ancestor clearfix"}
                id={this.props.data[this.props.iskey]}
            >
                {this.cellRender()}
            </div>
        )
    }
}

TreeRow.defaultProps = {
    level: 0
};
