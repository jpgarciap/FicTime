import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import axios from 'axios';
import { DeleteButton } from 'react-admin';

const CustomUserDelete = ({ ...props }) => {
    const form = useForm();

    const handleClick = useCallback(() => {
        const email = form.getFieldState('email').value;
        axios.delete(`http://localhost:9000/users/delete/${email}`, {})

    }, [form]);

    return <DeleteButton {...props} onClick={handleClick} />;
};

export default CustomUserDelete;