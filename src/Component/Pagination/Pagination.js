import React, {
	Component,
	PropTypes
} from 'react';
import PageButton from './PageButton';

export default class Pagination extends Component {
	constructor(props) {
		super(props);
		this.startPage = 1;
		this.finalStartPage = props.dataSize - props.paginationSize + 1;
		this.lastPage = props.paginationSize;
		this.center = Math.ceil(props.paginationSize / 2);
	}

	render() {
		const {
			paginationSize,
			sizePageList,
			dataSize,
			current,
			prevLabel,
			nextLabel,
			onPageChange,
			sizePerPage
		} = this.props;
		const totalPages = Math.ceil(dataSize / sizePerPage);
		if (current > (paginationSize - 1)) {
			this.lastPage = Math.min(totalPages, current + paginationSize - this.center - 1);
			if (current > this.finalStartPage) {
				this.startPage = this.finalStartPage;
			} else if ((this.lastPage - this.startPage) !== (paginationSize - 1)) {
				this.startPage = current - this.center;
			}
		} else {
			this.startPage = 1;
			this.lastPage = Math.min(totalPages, paginationSize);
		}

		let PageButtons = [
			<PageButton 
			label={prevLabel} hidden={current === 1}
			key='prev' onClick={() =>onPageChange(current - 1, sizePerPage)}/>
		];
		for (let i = this.startPage; i < this.lastPage + 1; i++) {
			let label = this.startPage + i;
			PageButtons.push(<PageButton label={i} active={current === i} key={i} onClick={() =>onPageChange(i, sizePerPage)}/>);
		}
		PageButtons.push(
			<PageButton 
			label={nextLabel}  hidden={current === totalPages}
			key='next' onClick={() =>onPageChange(current + 1, sizePerPage)}/>
		)
		return (
			<ul className="pagination">
				{PageButtons}
			</ul>
		)
	}
}

Pagination.propTypes = {
	paginationSize: PropTypes.number,
	sizePerPage: PropTypes.number,
	dataSize: PropTypes.number,
	current: PropTypes.number
}

Pagination.defaultProps = {
	current: 10,
	sizePerPage: 10,
	paginationSize: 6,
	prevLabel: <span>&laquo;</span>,
	nextLabel: <span>&raquo;</span>
}