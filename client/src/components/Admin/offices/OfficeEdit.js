import React, { Fragment } from 'react';
import PlaceAutocomplete from './PlaceAutocomplete';
import { Edit, SimpleForm, TextInput, required, FormDataConsumer } from 'react-admin';
import { useForm } from 'react-final-form';


const Address = ({ formData, ...rest }) =>{
    const form = useForm();

    return (
        <Fragment>
            <PlaceAutocomplete formData={form} {...rest}/>
        </Fragment>
    );
}

const OfficeEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()}/>
            <FormDataConsumer>
                {formDataProps => <Address {...formDataProps}/>}
            </FormDataConsumer>
        </SimpleForm>
    </Edit>
);

export default OfficeEdit;