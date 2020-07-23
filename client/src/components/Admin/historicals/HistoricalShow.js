
import * as React from "react";
import { Show, TabbedShowLayout, TextField, DateField, ReferenceField, Tab } from 'react-admin';


const HistoricalShow = (props) => (
    <Show {...props} bulkActionButtons={false}>
        <TabbedShowLayout>
            <Tab label="Historical data">
                <ReferenceField label="Email" source="user" reference="users">
                    <TextField source="email" />
                </ReferenceField>
                <ReferenceField label="DNI" source="user" reference="users">
                    <TextField source="dni" />
                </ReferenceField>
                <DateField source="date" />
            </Tab>
            <Tab label="Start" path="start">
                <TextField source="start" />
                <TextField source="commentStart" />
            </Tab>
            <Tab label="End" path="end">
                <TextField source="end" />
                <TextField source="commentEnd" />
            </Tab>



        </TabbedShowLayout>   
    </Show>
);

export default HistoricalShow;
