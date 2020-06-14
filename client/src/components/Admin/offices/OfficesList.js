import React from 'react';
import { List, downloadCSV, Datagrid, TextField } from 'react-admin';
import jsonExport from 'jsonexport/dist';

const exporter = offices => {
    const officesForExport = offices.map(office => {
        const { id,coordinates,lastupdate,updatedby,createdate,createdby, ...officeForExport } = office;
        return officeForExport;
    });
    jsonExport(officesForExport, {
        headers: ['name', 'location']
    }, (err, csv) => {
        downloadCSV(csv, 'offices');
    });
};

const OfficesList = props => (
    <List {...props} bulkActionButtons={false} exporter={exporter}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="location" />
        </Datagrid>
    </List>
);

export default OfficesList;