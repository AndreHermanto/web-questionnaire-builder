/* eslint react/prefer-stateless-function: "off" */
import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { HashRouter, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Routes from './Routes';

const theme = {
  appColor: 'red',
};

export class App extends Component {
  render() {
    return (
      <div>
        <Helmet defaultTitle="Example Application">
          <link rel="manifest" href="http://example.com/favicon.ico" />
          <link rel="shortcut icon" href="http://example.com/favicon.ico" />
        </Helmet>;
        <ThemeProvider theme={theme}>
          <HashRouter>
            <Route component={Routes} />
          </HashRouter>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
