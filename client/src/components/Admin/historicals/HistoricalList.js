import React from 'react';
import { List, Datagrid, TextField, ReferenceField, Filter, ReferenceInput, AutocompleteInput, DateField } from 'react-admin';

const HistoricalFilters = props => (
    <Filter {...props}>
        <ReferenceInput
                label="email"
                source="user"
                reference="users"
                filterToQuery={searchText => ({ email: searchText })}>
            <AutocompleteInput optionText="email" />
        </ReferenceInput>

        <ReferenceInput
                label="DNI"
                source="user"
                reference="users"
                filterToQuery={searchText => ({ dni: searchText })}>
            <AutocompleteInput optionText="dni" />
        </ReferenceInput>

    </Filter>
);



const HistoricalList = props => (
    <List {...props} filters={<HistoricalFilters />} title="Historicals" bulkActionButtons={false}>
        <Datagrid>
            <ReferenceField label="Email" source="user" reference="users">
                <TextField source="email" />
            </ReferenceField>
            <ReferenceField label="DNI" source="user" reference="users">
                <TextField source="dni" />
            </ReferenceField>                        
            <DateField source="date" />
            <TextField source="start" />
            <TextField source="end" />
        </Datagrid>
    </List>
);

export default HistoricalList;