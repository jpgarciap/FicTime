import React from 'react';
import firebase from 'firebase';
import Navigation from '../src/components/Navigation';
import Footer from '../src/components/Footer';
import SignInPage from '../src/components/SignIn';
import PasswordForgetPage from '../src/components/PasswordForget';
import SignUpPage from '../src/components/SignUp';
import HomePage from '../src/components/Home';
//import injectTapEventPlugin from 'react-tap-event-plugin';
import { BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import * as ROUTES from '../src/constants/routes';
import * as COLORS from '../src/constants/colors';


const firebaseConfig = {
  apiKey: 'AIzaSyCqPzkc0CswgZYxuE5ADQzvjxVLiACwYH0',
  authDomain: 'registration-dc367.firebaseapp.com',
  databaseURL: 'https://registration-dc367.firebaseio.com',
  projectId: 'registration-dc367',
  storageBucket: 'registration-dc367.appspot.com',
  messagingSenderId: '133176691572',
  appId: '1:133176691572:web:ee99c10ff8e7d403ee3a21',
  measurementId: 'G-H3JZ3MQG6G'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function App(){
  return (
    <body id="page-top">
      <Router>
        <div style={{backgroundColor: COLORS.NEUTRAL}}>
          <Navigation />
          <Route path={ROUTES.HOME} component={HomePage}/>
          <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
          <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
        </div>
      </Router>
    </body>
  )
}

export default App;
