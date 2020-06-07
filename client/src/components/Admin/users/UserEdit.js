import React, { Fragment } from 'react';
import { Edit, SimpleForm, TextInput, required, ReferenceInput, SelectInput, Toolbar, BooleanInput } from 'react-admin';
import CustomUserDelete from './CustomUserDelete';
import CustomSaveEdit from './CustomSaveEdit';
import { withStyles } from '@material-ui/core';

const WorkData = () =>{
    return (
        <Fragment>
            <span>
                <ReferenceInput label="Office" source="office" reference="offices">
                    <SelectInput optionText="name" />
                </ReferenceInput>
                &nbsp;
                <ReferenceInput label="Work Shift" source="workShift" reference="workShifts">
                    <SelectInput optionText="name" />
                </ReferenceInput>            
            </span>       
        </Fragment>
    );
}


const toolbarStyles = {
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

const UserEditToolbar = withStyles(toolbarStyles) (props => (
    <Toolbar {...props}>
        <CustomSaveEdit label="Save" redirect="list" submitOnEnter={false} />
        <CustomUserDelete id={props.record.id} label="DELETE" undoable={false} submitOnEnter={false}/>
    </Toolbar>
))

const UserTitle = ({ record }) => {
    return <span>User {record ? `${record.name}` : ''}</span>;
};

const UserEdit = props => (
    <Edit title={<UserTitle />} {...props}>
        <SimpleForm toolbar={<UserEditToolbar />}>
            <TextInput source="email" disabled/>
            <TextInput source="name" validate={required()}/>
            <TextInput source="dni"/>
            <WorkData/>
            <BooleanInput label="Admin" source="admin" />
        </SimpleForm>
    </Edit>
);

export default UserEdit;