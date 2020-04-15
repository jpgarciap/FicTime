import React from 'react';
import logo from '../../resources/logos/logo.png';
import styles from '../../resources/css/home.module.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className={styles.logo} alt="logo" />
      </header>
    </div>
  );
}

export default Home;
