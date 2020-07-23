import React from 'react';
import { List, downloadCSV, Datagrid, TextField, ReferenceField, Filter, ReferenceInput, AutocompleteInput, DateField, FunctionField, ShowButton } from 'react-admin';
import jsonExport from 'jsonexport/dist';

const exporter = (records, fetchRelatedRecords) => {

    fetchRelatedRecords(records, "user", "users").then(historicals => {
        const data = records.map(record => ({date: record.date, start: record.start, end: record.end, startComment: record.commentStart, endComment: record.commentEnd,
            name: historicals[record.user].name,
            dni: historicals[record.user].dni
        }));
        jsonExport(data, {
            headers: ['name', 'dni', 'date', 'start', 'startComment', 'end', 'endComment']
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
            <FunctionField label="Comment" render={record =>  (record.commentStart != null && `${record.commentStart}`.length > 0) 
            || (record.commentEnd != null && `${record.commentEnd}`.length > 0) ? "Yes" : "" } />
            <ShowButton />
        </Datagrid>
    </List>
);

export default HistoricalList;