import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as COLORS from '../../constants/colors';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { AuthContext } from '../Firebase/context';
import { app } from '../Firebase/firebase';
import Grid from '@material-ui/core/Grid';
import AdminSlide from './adminslide';
import logo from '../../resources/logos/logo_horizontal.png';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  
    title: {
      marginRight: theme.spacing(2),
    },
    adminmode: {
      flexGrow: 1,
    },
    logo: {
      maxWidth: 100,
    },
  }),
);

export default function Navigation() {
  const classes = useStyles();
  const [isAdmin, setIsAdmin] = useState(null);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        if (!!idTokenResult.claims.admin) {
          setIsAdmin(true);
        }
      }).catch((error) => {
        console.log(error);
      })
    }
  }, [currentUser]);
  
  function logout() {
    app.auth().signOut();
    setIsAdmin(false);
  }


  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor: 'white'}}>
        <Toolbar>
          <Grid justify="space-between" container>
            <Grid item>
              <Link to={ROUTES.LANDING}>
                <img src={logo} alt="logo" className={classes.logo} href={ROUTES.LANDING}/>
              </Link>
            </Grid>
            <Grid item>
                { isAdmin ? <AdminSlide className={classes.adminmode}></AdminSlide> : null}                
            </Grid>
            <Grid item>
              { currentUser ? 
              <Button component={ Link } to={ROUTES.LANDING} onClick={logout} style={{color: COLORS.CARBON}}>Sign Out</Button> : <Button component={ Link } to={ROUTES.SIGN_IN} style={{color: COLORS.CARBON}}>Login</Button>}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}