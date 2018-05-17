/* eslint react/prefer-stateless-function: "off" */
import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { HashRouter, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AppNavigation } from 'web-components';
import Routes from './Routes';

const theme = {
  appColor: '#10b2c1',
};

export class App extends Component {
  render() {
    return (
      <div>
        <Helmet defaultTitle="Questionnaires Builder">
          <link rel="manifest" href={`${process.env.PUBLIC_URL}/manifest.json`} />
          <link rel="shortcut icon" href={`${process.env.PUBLIC_URL}/favicon.ico`} />
        </Helmet>
        <ThemeProvider theme={theme}>
          <AppNavigation>
            <HashRouter>
              <Route component={Routes} />
            </HashRouter>
          </AppNavigation>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
