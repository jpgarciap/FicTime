import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const OfficesList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="location" />
        </Datagrid>
    </List>
);

export default OfficesList;