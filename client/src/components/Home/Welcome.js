import React from 'react';
import logo from '../../resources/logos/logo.png';
import logoMobile from '../../resources/logos/logo_mobile.png';
import { Link } from 'react-router-dom';
import * as Utils from '../../constants/utils';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import * as ROUTES from '../../constants/routes';
import * as COLORS from '../../constants/colors';
import { Picture } from 'react-responsive-picture';

const stylesWelcome = Utils.welcome;

class WelcomeBase extends React.Component{
    render() {
      const { classes } = this.props;

        return(
          <div className={classes.container}>
            <div>
              <Picture
                sources = {[
                  {
                      srcSet: logoMobile,
                      media: "(max-width: 420px)",
                  },
                  {
                      srcSet: logo,
                  },

                ]}
              />
            </div>
            <div className={classes.title}>
              <Typography variant="h6" gutterBottom>
                Welcome to FicTime! Please&nbsp;
                <Link to={ROUTES.SIGN_IN} style={{color: COLORS.WATERMELON}}>
                    Login
                </Link>
              </Typography>
            </div>
          </div>

        )
    }
}

WelcomeBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

const Welcome = withStyles(stylesWelcome) (WelcomeBase);

export default Welcome;