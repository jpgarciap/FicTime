import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const TurnList = props => (
    <List {...props} bulkActionButtons={false}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="startTime" />
            <TextField source="endTime" />
        </Datagrid>
    </List>
);

export default TurnList;