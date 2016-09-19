import React, {
    Component,
    PropTypes
} from 'react';

class TreeHeadCol extends Component {
    constructor(props) {
        super(props);
    }

    caretRender(dataField, sortName, sortOrder) {
        const SortGroup =
            <span className="order">
                <span className="dropdown">
                    <span className="caret" onClick={()=>this.props.onSort(dataField, 'desc')}
                          style={{margin: '10px 0 10px 5px', color: '#ccc'}}/>
                </span>
                <span className="dropup">
                    <span className="caret" onClick={()=>this.props.onSort(dataField, 'asc')}
                          style={{margin: '10px 0', color: '#ccc'}}/>
                </span>
           </span>;
        const AscCaret = <span className="caret"
                               onClick={()=>this.props.onSort(sortName, sortOrder === 'desc' ? 'asc' : 'desc')}
                               style={{margin: '10px 0 10px 5px'}}/>;
        if (dataField === sortName && sortOrder) {
            return <span className={"order " + (sortOrder === 'desc' ? '' : 'dropup')}>{AscCaret}</span>;
        } else {
            return SortGroup;
        }

    }

    render() {
        const {
            width,
            hidden,
            children,
            dataSort,
            sortName,
            sortOrder,
            dataField,
            dataAlign
        } = this.props;
        const style = {
            width: width,
            minWidth: width,
            textAlign: dataAlign,
            display: hidden && 'none'
        };
        return (
            <th style={style}>
                <span>{children}</span>{dataSort && this.caretRender(dataField, sortName, sortOrder)}
            </th>
        );
    }
}

TreeHeadCol.defaultProps = {
    dataSort: false,
    showArrow: () => {
        return true
    }
};

TreeHeadCol.propTypes = {
    hidden: PropTypes.bool,
    dataSort: PropTypes.bool,
    dataFormat: PropTypes.func,
    dataAlign: PropTypes.oneOf(['left', 'right', 'center']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default TreeHeadCol;