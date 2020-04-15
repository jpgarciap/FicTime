import React from 'react';
import { List, Datagrid, TextField, EmailField, DateField } from 'react-admin';

const AccountList = props => (
    <List {...props} title="List of posts">
        <Datagrid>
            <EmailField source="email" />
            <TextField source="description" />
            <DateField source="date" />
        </Datagrid>
    </List>
);

export default AccountList;