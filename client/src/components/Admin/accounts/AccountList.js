import React from 'react';
import { List, downloadCSV, Datagrid, TextField, EmailField, DateField } from 'react-admin';
import jsonExport from 'jsonexport/dist';

const exporter = accounts => {
    const accountsForExport = accounts.map(account => {
        const { id, openAlert, ...accountForExport } = account;
        return accountForExport;
    });
    jsonExport(accountsForExport, {
        headers: ['date', 'description', 'email' ]
    }, (err, csv) => {
        downloadCSV(csv, 'accounts');
    });
};


const AccountList = props => (
    <List {...props} title="Accounts" exporter={exporter}>
        <Datagrid>
            <EmailField source="email" />
            <TextField source="description" />
            <DateField source="date" />
        </Datagrid>
    </List>
);

export default AccountList;