import React from 'react';
import { List, downloadCSV, Datagrid, TextField } from 'react-admin';
import jsonExport from 'jsonexport/dist';


const exporter = workShifts => {
    const workShiftsForExport = workShifts.map(workShift => {
        const { id,createdby,updatedby,lastupdate,createdate, ...workShiftForExport } = workShift;
        return workShiftForExport;
    });
    jsonExport(workShiftsForExport, {
        headers: ['name', 'startTime', 'endTime' ]
    }, (err, csv) => {
        downloadCSV(csv, 'workShifts');
    });
};



const TurnList = props => (
    <List {...props} bulkActionButtons={false} exporter={exporter}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="startTime" />
            <TextField source="endTime" />
        </Datagrid>
    </List>
);

export default TurnList;