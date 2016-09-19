import React, {Component} from 'react';
import classSet from 'classnames';

export default class PageButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {active, disabled, hidden, label, onClick} = this.props;
        const className = classSet({
            active: active,
            disabled: disabled,
            hidden: hidden
        });
        return (
            <li className={ className }>
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    onClick()
                }}><span>{label}</span></a>
            </li>
        )
    }
}