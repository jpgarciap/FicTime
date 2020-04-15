import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import * as Utils from '../../constants/utils';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createAccount } from '../../actions/AccountApi';


const INITIAL_STATE = {
  email: '',
  description: '',
  date: new Date()
};

const styles = Utils.formStyles;

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
    createAccount(this.state);  
  };


  render() {
    const { classes } = this.props;
    return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                  You need to request an account
              </Typography>
              <form className={classes.form} onSubmit={this.onSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
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