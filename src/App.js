import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <div className={styles.header}>
          <img src={logo} className={styles.logo} />
          <h2>PostCSS + CSS Modules Rocks!</h2>
        </div>
        <p className={styles.intro}>
          This repo will explain how to setup and use PostCSS with your react project
        </p>
        <div className={styles.localExample}>
          Local classname example. Inspect this node
        </div>
        <div className="global-class-name">
          Global classname example. Inspect this node
        </div>
      </div>
    );
  }
}

export default App;
