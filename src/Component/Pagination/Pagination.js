import React, {
    Component,
    PropTypes
} from 'react';
import PageButton from './PageButton';

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        this.startPage = 1;
        this.finalStartPage = Math.ceil(props.dataSize / props.sizePerPage) - props.paginationSize + 1;
        this.lastPage = props.paginationSize;
        this.center = Math.floor(props.paginationSize / 2);
    }

    componentWillReceiveProps(props) {
        this.finalStartPage = Math.ceil(props.dataSize / props.sizePerPage) - props.paginationSize + 1;
        this.lastPage = props.paginationSize;
        this.center = Math.floor(props.paginationSize / 2);
    }

    render() {
        const {
            current,
            dataSize,
            endLabel,
            nextLabel,
            prevLabel,
            startLabel,
            sizePerPage,
            onPageChange,
            paginationSize
        } = this.props;
        const totalPages = Math.ceil(dataSize / sizePerPage);
        if (current > paginationSize - 1) {
            this.lastPage = Math.min(totalPages, current + paginationSize - this.center - 1);
            if (current > this.finalStartPage) {
                this.startPage = this.finalStartPage;
            }
            if (this.lastPage - this.startPage !== paginationSize - 1) {
                this.startPage = current - this.center;
            }
        } else {
            this.startPage = 1;
            this.lastPage = Math.min(totalPages, paginationSize);
        }
        let PageButtons = [
            <PageButton
                label={startLabel} hidden={this.startPage === 1}
                key='start' onClick={() =>onPageChange(1, sizePerPage)}/>,
            <PageButton
                label={prevLabel} hidden={current === 1}
                key='prev' onClick={() =>onPageChange(current - 1, sizePerPage)}/>
        ];
        for (let i = this.startPage; i < this.lastPage + 1; i++) {
            PageButtons.push(<PageButton label={i} active={current === i} key={i}
                                         onClick={() =>onPageChange(i, sizePerPage)}/>);
        }
        PageButtons.push(
            <PageButton
                label={nextLabel} hidden={current === totalPages || totalPages < 1}
                key='next' onClick={() =>onPageChange(current + 1, sizePerPage)}/>
        );
        PageButtons.push(
            <PageButton
                label={endLabel} hidden={this.lastPage === totalPages}
                key='end' onClick={() =>onPageChange(totalPages, sizePerPage)}/>
        );

        return (
            <ul className="pagination">
                {PageButtons}
            </ul>
        )
    }
}

Pagination.propTypes = {
    current: PropTypes.number,
    dataSize: PropTypes.number,
    sizePerPage: PropTypes.number,
    paginationSize: PropTypes.number
}

Pagination.defaultProps = {
    current: 10,
    sizePerPage: 10,
    paginationSize: 6,
    prevLabel: <span>&lt;</span>,
    nextLabel: <span>&gt;</span>,
    startLabel: <span>&lt;&lt;</span>,
    endLabel: <span>&gt;&gt;</span>
}