import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

function Navigation() {
  const classes = useStyles();
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{backgroundColor: '#314854'}}>
          <Toolbar>
            <Typography variant="h5" color="inherit" className={classes.title}>
              <Link to={ROUTES.LANDING} color="inherit">FicRegister</Link>
            </Typography>
            <Button component={ Link } to={ROUTES.SIGN_IN} color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

export default Navigation;