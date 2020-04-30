import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import * as Utils from '../../constants/utils';
import { withRouter} from 'react-router';
import { app } from '../Firebase/firebase';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

const styles = Utils.formStyles;
const INITIAL_STATE = {
  email: ''
};

class PasswordForgetForm extends React.Component {
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
    const { email } = this.state;
    event.preventDefault();
    app.auth().sendPasswordResetEmail(email.trim())
    .then(() => {
      alert('OK');
    })
    .catch(error => {
      alert(error);
    })
 };

 render(){
  const { classes } = this.props;
  return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Forgot password?
            </Typography>
            <form className={classes.form} onSubmit={this.onSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
  
PasswordForgetForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

const PasswordForget = compose(withRouter, withStyles(styles))(PasswordForgetForm);
export default PasswordForget;