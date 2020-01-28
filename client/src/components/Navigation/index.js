/*import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import * as COLORS from '../../constants/colors';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
*/

import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as COLORS from '../../constants/colors';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export default function Navigation() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor: 'white'}}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to={ROUTES.HOME} style={{color: COLORS.CARBON}}>
              FicTime
            </Link>
          </Typography>
          <Button component={ Link } to={ROUTES.SIGN_IN} style={{color: COLORS.CARBON}}>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

/*<img src="logo_horizontal.png" alt="logo" />*/
/*
function Navigation() {
  const styles = useStyles();
    return (
      <div className={styles.root}>
        <AppBar position="static" style={{backgroundColor: 'white'}}>
          <Toolbar>
            <img src="logo_horizontal.png" alt="logo" className={styles.title} />
            <Button component={ Link } to={ROUTES.SIGN_IN} color={COLORS.CARBON}>Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
*/
//<Typography variant="h5" color={COLORS.WATERMELON} className={styles.title}>
//<Link to={ROUTES.LANDING} color="inherit">FicRegister</Link>
//</Typography>