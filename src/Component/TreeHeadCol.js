import React, {
    Component,
    PropTypes
} from 'react';

class TreeHeadCol extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            width,
            hidden,
            children
        } = this.props;
        let style = {
            minWidth: width,
            width: width,
        };
        if (hidden) {
            style.width = 0;
            style.display = 'none';
        }
        return (
            <th style={style}><span>{children}</span></th>
        );
    }
}

TreeHeadCol.defaultProps = {
    showArrow: () => {
        return true
    }
}

export default TreeHeadCol;
