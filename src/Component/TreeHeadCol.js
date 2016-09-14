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
            minWidth: width || this.context.width || 100
        };
        if (hidden) {
            style.display = 'none';
        }
        return (
            <div style={style} className="thead"><span>{children}</span></div>
        );
    }
}

TreeHeadCol.defaultProps = {
    showArrow: () => {
        return true
    }
}

TreeHeadCol.contextTypes = {
    width: React.PropTypes.string
};

export default TreeHeadCol;