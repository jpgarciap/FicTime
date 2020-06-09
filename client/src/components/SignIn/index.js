import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import * as ROUTES from '../../constants/routes';
import { Link as RouterLink } from 'react-router-dom';
import * as Utils from '../../constants/utils';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { app } from '../Firebase/firebase';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


const styles = Utils.formStyles;

const INITIAL_STATE = {
  email: '',
  password: '',
  openAlert: false
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SignInFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({
       [event.target.name] : event.target.value
      });
  };

  onSubmit = event => {
    const { email, password } = this.state;
    event.preventDefault();
    app.auth().signInWithEmailAndPassword(email.trim(), password)
    .then(() => {
      this.props.history.push(ROUTES.LANDING)
    })
    .catch(error => {
      console.log(error);
      this.setState({ openAlert: true });
    })
  };

  handleClose = () => {
    this.setState( {openAlert: false});
  }

  render() {
    const { email, password } = this.state;
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              autoComplete="email"
              autoFocus
              onChange={this.onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.onChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to={ROUTES.PASSWORD_FORGET} variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to={ROUTES.SIGN_UP} variant="body2">
                  Don't have an account? Sign Up?
                </Link>
              </Grid>
            </Grid>
          </form>
          <Snackbar className={classes.alert} open={this.state.openAlert} autoHideDuration={6000} onClose={this.handleClose}>
            <Alert onClose={this.handleClose} severity="error">
              Authentication error
            </Alert>
          </Snackbar>            
        </div>
      </Container>      
    )
  }
}

SignInFormBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

const SignIn = compose(withRouter, withStyles(styles))(SignInFormBase);


export default SignIn;