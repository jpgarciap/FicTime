import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import * as Utils from '../../constants/utils';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MuiAlert from '@material-ui/lab/Alert';
import { compose } from 'recompose';
import { app } from '../Firebase/firebase'
import Snackbar from '@material-ui/core/Snackbar';


const INITIAL_STATE = {
  email: '',
  description: '',
  date: new Date(),
  openAlert: false
};

const styles = Utils.formStyles;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SignUpForm extends React.Component {
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
    event.preventDefault();
    app.firestore().collection('accounts').add(this.state);  
    this.setState({ openAlert: true, email: '', description: ''});
  };

  handleClose = () => {
    this.setState( {openAlert: false});
  }

  render() {
    const { classes } = this.props;
    return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                  First, request an account
              </Typography>
              <form className={classes.form} onSubmit={this.onSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  value={this.state.email}
                  fullWidth
                  id="email"
                  label="Your Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={this.onChange}
                />
                <TextField
                  id="description"
                  label="Description"
                  name="description"
                  value={this.state.description}
                  fullWidth
                  multiline
                  rows="4"
                  variant="outlined"
                  onChange={this.onChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Send Email
                </Button>
                <Snackbar className={classes.alert} open={this.state.openAlert} autoHideDuration={6000} onClose={this.handleClose}>
                  <Alert onClose={this.handleClose} severity="success">
                    Success! Your request was sent
                  </Alert>
                </Snackbar>  
              </form>
            </div>
          </Container>
    );
  }  
}

SignUpForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const SignUp = compose(withStyles(styles))(SignUpForm);
  
export default SignUp;