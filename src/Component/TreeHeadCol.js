import React, {Component} from 'react';
import PropTypes          from 'prop-types';

const SortGroup = () => {
    return (
        <span className="order" key="sort-group">
            <span className="dropdown">
                <span className="caret" style={{margin: '10px 0 10px 5px', color: '#ccc'}}/>
            </span>
            <span className="dropup">
                <span className="caret" style={{margin: '10px 0', color: '#ccc'}}/>
            </span>
        </span>
    );
};

const SingleSort = (sortOrder) => {
    return (
        <span className={"order " + (sortOrder === 'desc' ? '' : 'dropup')} key="single-sort">
            <span className="caret" style={{margin: '10px 0 10px 5px'}}/>
        </span>
    );
};

class TreeHeadCol extends Component {
    constructor(props) {
        super(props);
    }

    caretRender(dataField, sortName, sortOrder) {
        return dataField === sortName && sortOrder ? SingleSort(sortOrder) : SortGroup();
    }

    render() {
        const {
            width,
            hidden,
            onSort,
            colSpan,
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
            <th style={style} colSpan={colSpan || null}
                onClick={dataSort ? () => onSort(dataField, sortOrder === 'asc' ? 'desc' : 'asc') : () => {
                    return false;
                }}>
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
    colSpan: PropTypes.number,
    dataFormat: PropTypes.func,
    dataFixed: PropTypes.oneOf(['left', 'right', 'auto']),
    dataAlign: PropTypes.oneOf(['left', 'right', 'center']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showArrow: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
};

export default TreeHeadCol;