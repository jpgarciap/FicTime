import React, { Fragment } from 'react';
import { Create, SimpleForm, TextInput, required } from 'react-admin';
import TimePicker from './TimePicker';


const Times = () =>{
    return (
        <Fragment>
            <TimePicker name="startTime" label="Start Time" />
            <TimePicker name="endTime" label="End Time" />    
        </Fragment>
    );
}

const TurnCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextInput source="name" validate={required()}/>
            <Times />
        </SimpleForm>
    </Create>
);


export default TurnCreate;