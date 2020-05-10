import React from 'react';
import { Admin, Resource } from 'react-admin';
import { FirebaseDataProvider } from 'react-admin-firebase';
import accounts from './accounts';
import offices from './offices';
import workShifts from './workShifts';
import users from './users';
import historicals from './historicals';
import Dashboard from './dashboard';

var createHistory = require("history").createBrowserHistory;

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const options = {};
const dataProvider = FirebaseDataProvider(config, options);

const history = createHistory({ basename: '/admin' });

class AdminDashboard extends React.Component {

  render() {
    return (
    <Admin dashboard={Dashboard} dataProvider={dataProvider} history={history}>
        <Resource name="accounts" {...accounts}/>
        <Resource name="offices" {...offices}/>
        <Resource name="workShifts" {...workShifts}/>
        <Resource name="users" {...users}/>
        <Resource name="historicals" {...historicals}/>
    </Admin>
    )
  }
}


export default AdminDashboard;