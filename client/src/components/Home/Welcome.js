import React from 'react';
import logo from '../../resources/logos/logo.png';
import styles from '../../resources/css/home.module.css';

class Welcome extends React.Component{

    render() {

        return(
          <img src={logo} className={styles.logo} alt="logo" />
        )
    }


}

export default Welcome;