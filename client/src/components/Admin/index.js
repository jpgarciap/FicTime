import React from 'react';

import { Admin, Resource, ListGuesser } from 'react-admin';
import { FirebaseDataProvider } from 'react-admin-firebase';
import accounts from './accounts';
import offices from './offices';

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

class Dashboard extends React.Component {

  render() {
    return (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="accounts" {...accounts}/>
        <Resource name="offices" {...offices}/>
        <Resource name="turns" list={ListGuesser}/>
        <Resource name="users" list={ListGuesser}/>
    </Admin>
    )
  }
}


export default Dashboard;