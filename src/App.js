/* eslint react/prefer-stateless-function: "off" */
import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { HashRouter, withRouter, Route } from 'react-router-dom';
import Routes from './Routes';
import EnsureLoggedInContainer from './containers/EnsureLoggedInContainer';

const EnsureLoggedInContainerWithRouter = withRouter(EnsureLoggedInContainer);

const theme = {
  appColor: 'red',
};

export class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <HashRouter>
          <EnsureLoggedInContainerWithRouter>
            <Route component={Routes} />
          </EnsureLoggedInContainerWithRouter>
        </HashRouter>
      </ThemeProvider>
    );
  }
}

export default App;
