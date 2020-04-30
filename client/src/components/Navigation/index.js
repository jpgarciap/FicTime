import React, { useContext } from 'react';
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
import AdminSlide from './adminslide';

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
  }),
);

export default function Navigation() {
  const classes = useStyles();

  const { currentUser } = useContext(AuthContext);
  
  function logout() {
    app.auth().signOut();
  }


  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor: 'white'}}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to={ROUTES.LANDING} style={{color: COLORS.CARBON}}>
              FicTime
            </Link>
          </Typography>
          {/* <AdminSlide className={classes.adminmode}></AdminSlide> */}
          { currentUser ? 
          <Button component={ Link } to={ROUTES.LANDING} onClick={logout} style={{color: COLORS.CARBON}}>Sign Out</Button> : <Button component={ Link } to={ROUTES.SIGN_IN} style={{color: COLORS.CARBON}}>Login</Button>}
        </Toolbar>
      </AppBar>
    </div>
  );
}