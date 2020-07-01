import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import axios from 'axios';
import { SaveButton } from 'react-admin';

const CustomSave = ({ handleSubmitWithRedirect, ...props }) => {
    const form = useForm();

    const handleClick = useCallback(() => {
        const email = form.getFieldState('email').value;
        const password = form.getFieldState('password').value;
        const name = form.getFieldState('name').value;
        const isAdmin = form.getFieldState('admin').value;
    
        const userObject = {
            user: {
                email: email,
                password: password,
                displayName: name
            },
            admin : isAdmin
        };  
        axios.post('/users/create', userObject)
            .then((res) => {
                form.change('password', ' ');
                handleSubmitWithRedirect('list');
            }).catch((error) => {
                var errorMessage = error.response.data.error;
                console.log(errorMessage);  
            });
    }, [form, handleSubmitWithRedirect ]);

    // override handleSubmitWithRedirect with custom logic
    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};

export default CustomSave;