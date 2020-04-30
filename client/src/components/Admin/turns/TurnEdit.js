import React, { Fragment } from 'react';
import { Edit, FormDataConsumer, SimpleForm, TextInput, required } from 'react-admin';
import TimePicker from './TimePicker';


const Times = ({ formData }) => {
    return (
        <Fragment>
            <TimePicker name="startTime" label="Start Time" defaultValue={formData.startTime} />
            <TimePicker name="endTime" label="End Time" defaultValue={formData.endTime} />
        </Fragment>
    );
}

const OfficeEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()}/>
            <FormDataConsumer>
                {formDataProps => <Times {...formDataProps}/>}
            </FormDataConsumer>
        </SimpleForm>
    </Edit>
);

export default OfficeEdit;