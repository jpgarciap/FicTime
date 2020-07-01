import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import axios from 'axios';
import { SaveButton } from 'react-admin';

const CustomSaveEdit = ({ handleSubmitWithRedirect, ...props }) => {
    const form = useForm();

    const handleClick = useCallback(() => {
        const email = form.getFieldState('email').value;
        const isAdmin = form.getFieldState('admin').value;
    
        const userObject = {
            admin : isAdmin
        };  

        axios.put(`/users/updateAdm/${email}`, userObject)
            .then((res) => {
                handleSubmitWithRedirect('list');
            }).catch((error) => {
                console.log(error);
            });
    }, [form, handleSubmitWithRedirect ]);

    // override handleSubmitWithRedirect with custom logic
    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};

export default CustomSaveEdit;