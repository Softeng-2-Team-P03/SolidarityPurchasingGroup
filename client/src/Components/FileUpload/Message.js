import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ msg }) => {
    return (
        <div className='alert alert-info alert-dismissible fade show' role='alert'>
            {msg}


        </div>
    );
};

Message.propTypes = {
    msg: PropTypes.string.isRequired
};

export default Message;
