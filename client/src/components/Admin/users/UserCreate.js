import React, {Fragment} from 'react';
import { Create, Toolbar, SimpleForm, TextInput, required, ReferenceInput, SelectInput, PasswordInput, BooleanInput } from 'react-admin';
import CustomSave from './CustomSave';


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

const LoginData = () => {
    return (
        <Fragment>
            <span>
                <TextInput source="email" type="email" validate={required()}/>
                &nbsp;
                <PasswordInput source="password" validate={required()}/>
            </span>        
        </Fragment>
    );
};

const UserCreateToolbar = props => (
    <Toolbar {...props}>
        <CustomSave
            label="Save"
            redirect="list"
            submitOnEnter={false}
        />
    </Toolbar>
);

const UserCreate = props => (
    <Create {...props}>
        <SimpleForm toolbar={<UserCreateToolbar />}>
            <TextInput source="name" validate={required()}/>
            <TextInput source="dni"/>
            <WorkData/>
            <LoginData/>
            <BooleanInput label="Admin" source="admin" />
        </SimpleForm>
    </Create>
);

export default UserCreate;