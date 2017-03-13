import React, { PropTypes, Component } from 'react';

class Input extends Component {

    render() {
        return (
            <div>
                <input />
            </div>
        );
    }
}

Input.propTypes = {
    size: PropTypes.number,
    icon: PropTypes.string,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};

Input.defaultProps = {
    size: 15,
    iconPosition: 'left',
    placeholder: '여기에 아무거나 적어보세요~!'
};

export default Input;