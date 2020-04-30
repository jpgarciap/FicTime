import React from 'react';
import { List, Datagrid, TextField, EmailField, ReferenceField, SearchInput, Filter, BooleanField } from 'react-admin';

const Userfilters = props => (
    <Filter {...props}>
        <SearchInput placeholder="Search by name" source="name" alwaysOn />
        <SearchInput placeholder="Email" source="email"/>
        <SearchInput placeholder="DNI" source="dni"/>
    </Filter>
);

const UserList = props => (
    <List {...props} filters={<Userfilters />} title="Users" bulkActionButtons={false}>
        <Datagrid rowClick="edit">
            <EmailField source="email" />
            <TextField source="name" />
            <TextField source="dni" />

            <ReferenceField label="Office" source="office" reference="offices">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField label="Turn" source="turn" reference="turns">
                <TextField source="name" />
            </ReferenceField>
            <BooleanField source="admin" />
        </Datagrid>
    </List>
);

export default UserList;