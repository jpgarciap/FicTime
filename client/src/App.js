import React, { Component } from 'react';
import Navigation from '../src/components/Navigation';
import SignInPage from '../src/components/SignIn';
import Dashboard from '../src/components/Admin';
import PasswordForgetPage from '../src/components/PasswordForget';
import SignUpPage from '../src/components/SignUp';
import HomePage from '../src/components/Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../src/constants/routes';
import * as COLORS from '../src/constants/colors'
import styles from './resources/css/home.module.css';
import { AuthProvider } from '../src/components/Firebase/context';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import RouteAdmin from '../src/components/Admin/RouteAdmin'
import Footer from '../src/components/Footer';
import logoUdc from '../src/resources/logos/logo-udc.png';
import Grid from '@material-ui/core/Grid';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: COLORS.WATERMELON,
    },
    secondary: {
      main: COLORS.SKY,
    }
  },
});

class App extends Component {

  render() {
    return (
      <container className={styles.wrapper}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <Router>
              <Navigation />
              <Route exact path={ROUTES.LANDING} component={HomePage} />
              <Route path={ROUTES.HOME} component={HomePage} />
              <Route path={ROUTES.SIGN_IN} component={SignInPage} />
              <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
              <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
              <RouteAdmin path={ROUTES.ADMIN}>
                <Dashboard></Dashboard>
              </RouteAdmin>
              <Footer>
                <Grid container direction="row" alignItems="center" justify="center">
                  {window.innerWidth > 760 ? <Grid item xs /> : null}
                  <Grid item xs style={{ textAlign: 'center' }}>
                    <strong style={{ textAlign: 'center' }}>Master Universitario en Ingeniería informática</strong>
                  </Grid>
                  <Grid item xs style={{ textAlign: 'center' }}>
                    <img src={logoUdc} alt="logo" style={{ maxWidth: 170 }} />
                  </Grid>
                </Grid>
              </Footer>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </container>
    )
  }
}

export default App;
