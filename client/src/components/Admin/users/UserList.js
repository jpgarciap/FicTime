import React from 'react';
import { List, downloadCSV, Datagrid, TextField, EmailField, ReferenceField, SearchInput, Filter, BooleanField } from 'react-admin';
import jsonExport from 'jsonexport/dist';


const exporter = users => {
    const usersForExport = users.map(user => {
        const { id,office,admin,workShift,updatedby,createdby,createdate,password,lastupdate, ...userForExport } = user;
        return userForExport;
    });
    jsonExport(usersForExport, {
        headers: ['email', 'name', 'dni' ]
    }, (err, csv) => {
        downloadCSV(csv, 'users');
    });
};



const Userfilters = props => (
    <Filter {...props}>
        <SearchInput placeholder="Search by name" source="name" alwaysOn />
        <SearchInput placeholder="Email" source="email"/>
        <SearchInput placeholder="DNI" source="dni"/>
    </Filter>
);

const UserList = props => (
    <List {...props} filters={<Userfilters />} title="Users" bulkActionButtons={false} exporter={exporter}>
        <Datagrid rowClick="edit">
            <EmailField source="email" />
            <TextField source="name" />
            <TextField source="dni" />

            <ReferenceField label="Office" source="office" reference="offices">
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField label="Work Shift" source="workShift" reference="workShifts">
                <TextField source="name" />
            </ReferenceField>
            <BooleanField source="admin" />
        </Datagrid>
    </List>
);

export default UserList;