/**
 * Created by Elly on 2016/5/27.
 */
import React from 'react';
const Component = React.Component;

export default class TreeHead extends Component {
    constructor(props) {
        super(props);
    }

    headRowRender() {
        let output = [];
        let headRow = this.props.headRow;
        headRow.forEach((item, index) => {
            output.push(
                <div key={index} style={{width: item.width || this.props.width}} className="thead">
                    <span>{item.name || item.id || item }</span>
                </div>
            )
        });
        return output;
    }

    render() {
        return (
                <div className="table-head clearfix">
                    {this.headRowRender()}
                </div>
        )
    }
}
