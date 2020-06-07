import React, { Component } from 'react';
import Navigation from '../src/components/Navigation';
import SignInPage from '../src/components/SignIn';
import Dashboard from '../src/components/Admin';
import PasswordForgetPage from '../src/components/PasswordForget';
import SignUpPage from '../src/components/SignUp';
import HomePage from '../src/components/Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../src/constants/routes';
import styles from './resources/css/home.module.css';
import { AuthProvider } from '../src/components/Firebase/context';
import RouteAdmin from '../src/components/Admin/RouteAdmin'


class App extends Component{

  render(){
    return (
      <div>
        <AuthProvider>
          <Router>
            <div className={styles.wrapper}>
              <Navigation />
              <Route exact path={ROUTES.LANDING} component={HomePage}/>
              <Route path={ROUTES.HOME} component={HomePage}/>
              <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
              <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
              <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
              <RouteAdmin path={ROUTES.ADMIN}>
                <Dashboard></Dashboard>  
              </RouteAdmin>
            </div>
          </Router>
        </AuthProvider>
        <footer className={styles.footer}>
           <strong>Master Universitario en Ingeniería informática</strong>.
        </footer>
      </div>
    )
  }
}

export default App;
