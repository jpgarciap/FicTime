import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';

const OfficeEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="location" />
        </SimpleForm>
    </Edit>
);

export default OfficeEdit;