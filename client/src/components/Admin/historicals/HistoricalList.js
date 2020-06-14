import React from 'react';
import { List, downloadCSV, Datagrid, TextField, ReferenceField, Filter, ReferenceInput, AutocompleteInput, DateField } from 'react-admin';
import jsonExport from 'jsonexport/dist';

const exporter = (records, fetchRelatedRecords) => {

    fetchRelatedRecords(records, "user", "users").then(historicals => {
        const data = records.map(record => ({date: record.date, start: record.start, end: record.end,
            name: historicals[record.user].name,
            dni: historicals[record.user].dni
        }));
        jsonExport(data, {
            headers: ['name', 'dni', 'date', 'start', 'end']
        }, (err, csv) => {
            downloadCSV(csv, 'historicals');
        });
    })

};

const HistoricalFilters = props => (
    <Filter {...props}>
        <ReferenceInput
                label="dni"
                source="user"
                reference="users"
                filterToQuery={searchText => ({ dni: searchText })}>
                <AutocompleteInput optionText="dni" />
        </ReferenceInput>
    </Filter>
);



const HistoricalList = props => (
    <List {...props} exporter={exporter} filters={<HistoricalFilters />} title="Historicals" bulkActionButtons={false}>
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