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
                    <span className="caret" style={{margin: '10px 0 10px 5px', color: '#ccc'}}/>
                </span>
                <span className="dropup">
                    <span className="caret" style={{margin: '10px 0', color: '#ccc'}}/>
                </span>
           </span>;
        const AscCaret = <span className="caret" style={{margin: '10px 0 10px 5px'}}/>;
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
            onSort,
            children,
            dataSort,
            sortName,
            sortOrder,
            dataField,
            dataAlign
        } = this.props;

        const style = {
            width: width,
            maxWidth: width,
            textAlign: dataAlign,
            display: hidden && 'none'
        };

        return (
            <th style={style}
                onClick={dataSort ? ()=>onSort(dataField,sortOrder === 'asc' ? 'desc': 'asc') : ()=>{return false;}}>
                <span>{children}</span>{dataSort && this.caretRender(dataField, sortName, sortOrder)}
            </th>
        );
    }
}

TreeHeadCol.defaultProps = {
    dataSort: false,
    dataFixed: 'auto',
    showArrow: undefined
};

TreeHeadCol.propTypes = {
    hidden: PropTypes.bool,
    dataSort: PropTypes.bool,
    dataFormat: PropTypes.func,
    dataFixed: PropTypes.oneOf(['left', 'right', 'auto']),
    dataAlign: PropTypes.oneOf(['left', 'right', 'center']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showArrow: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
};

export default TreeHeadCol;