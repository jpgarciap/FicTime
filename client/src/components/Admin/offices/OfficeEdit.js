import React, { Fragment } from 'react';
import PlaceAutocomplete from './PlaceAutocomplete';
import { Edit, SimpleForm, TextInput, Toolbar, required, FormDataConsumer } from 'react-admin';
import { useForm } from 'react-final-form';
import { SaveButton, DeleteButton } from 'react-admin';
import { withStyles } from '@material-ui/core';


const Address = ({ formData, ...rest }) =>{
    const form = useForm();

    return (
        <Fragment>
            <PlaceAutocomplete formData={form} {...rest}/>
        </Fragment>
    );
}
const OfficeTitle = ({ record }) => {
    return <span>Office {record ? `${record.name}` : ''}</span>;
};

const toolbarStyles = {
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

const OfficeToolbar = withStyles(toolbarStyles) (props => (
    <Toolbar {...props}>
        <SaveButton label="Save" redirect="list" submitOnEnter={false} />
        <DeleteButton label="DELETE" undoable={false} submitOnEnter={false}/>
    </Toolbar>
))

const OfficeEdit = props => (
    <Edit title={<OfficeTitle />} {...props}>
        <SimpleForm toolbar={<OfficeToolbar />}>
            <TextInput source="name" validate={required()}/>
            <FormDataConsumer>
                {formDataProps => <Address {...formDataProps}/>}
            </FormDataConsumer>
        </SimpleForm>
    </Edit>
);

export default OfficeEdit;