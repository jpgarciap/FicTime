import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import axios from 'axios';
import { DeleteButton } from 'react-admin';

const CustomUserDelete = ({ ...props }) => {
    const form = useForm();

    const handleClick = useCallback(() => {
        const email = form.getFieldState('email').value;
        const id = props.id;
        axios.delete(`/users/delete/${email}/${id}`, {})

    }, [form, props.id]);

    return <DeleteButton {...props} onClick={handleClick} />;

};

export default CustomUserDelete;