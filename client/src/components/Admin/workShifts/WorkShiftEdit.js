import React, { Fragment } from 'react';
import { Edit, Toolbar, FormDataConsumer, SimpleForm, TextInput, required } from 'react-admin';
import TimePicker from './TimePicker';
import { SaveButton, DeleteButton } from 'react-admin';
import { withStyles } from '@material-ui/core';


const Times = ({ formData }) => {
    return (
        <Fragment>
            <TimePicker name="startTime" label="Start Time" defaultValue={formData.startTime} />
            <TimePicker name="endTime" label="End Time" defaultValue={formData.endTime} />
        </Fragment>
    );
}

const WorkShiftTitle = ({ record }) => {
    return <span>WorkShift {record ? `${record.name}` : ''}</span>;
};

const toolbarStyles = {
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

const WorkShiftToolbar = withStyles(toolbarStyles) (props => (
    <Toolbar {...props}>
        <SaveButton label="Save" redirect="list" submitOnEnter={false} />
        <DeleteButton label="DELETE" undoable={false} submitOnEnter={false}/>
    </Toolbar>
))

const WorkShiftEdit = props => (
    <Edit title={<WorkShiftTitle />} {...props}>
        <SimpleForm toolbar={<WorkShiftToolbar />}>
            <TextInput source="name" validate={required()}/>
            <FormDataConsumer>
                {formDataProps => <Times {...formDataProps}/>}
            </FormDataConsumer>
        </SimpleForm>
    </Edit>
);

export default WorkShiftEdit;