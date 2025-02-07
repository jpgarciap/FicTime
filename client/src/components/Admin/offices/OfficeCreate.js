import React, { Fragment } from 'react';
import { Create, SimpleForm, TextInput, required, FormDataConsumer } from 'react-admin';
import PlaceAutocomplete from './PlaceAutocomplete';
import { useForm } from 'react-final-form';




const Address = ({ formData, ...rest }) =>{
    const form = useForm();

    return (
        <Fragment>
            <PlaceAutocomplete formData={form} {...rest}/>
        </Fragment>
    );
}

const OfficeCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextInput source="name" validate={required()}/>
            <FormDataConsumer>
                {formDataProps => <Address {...formDataProps}/>}
            </FormDataConsumer>
        </SimpleForm>
    </Create>
);

export default OfficeCreate;