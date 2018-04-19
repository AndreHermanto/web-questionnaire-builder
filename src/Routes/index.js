import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  Authorized,
  AuthTokenValidator,
  RedirectToLogin,
  Page,
  NavBar,
  SideBarComponent,
  Content,
  SidePanelRoute,
  logout,
} from 'web-components';
import ExamplesList from '../Examples/ExamplesList';
import ExamplesShow from '../Examples/ExamplesShow';
import ExamplesEdit from '../Examples/ExamplesEdit';
import ExamplesCreate from '../Examples/ExamplesCreate';
import ExamplesDelete from '../Examples/ExamplesDelete';

const sidebarGroups = [
  {
    name: '',
    elements: [
      {
        name: 'Examples',
        url: '/examples',
        icon: 'archive',
      },
    ],
  },
  {
    name: 'Settings',
    elements: [
      {
        name: 'User Settings',
        url: '/settings/user',
        icon: 'archive',
      },
      {
        name: 'App Settings',
        url: '/settings/app',
        icon: 'archive',
      },
    ],
  },
];

class Routes extends Component {
  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
      this.previousLocation = this.props.location;
    }
  }
  previousLocation = this.props.location;

  renderWithAuthorization = ({ me }) => {
    if (!me) {
      return <RedirectToLogin />;
    }
    const { location } = this.props;
    const isModal = !!(
      (location.state && location.state.modal && this.previousLocation !== location) ||
      this.previousLocation === location
    );

    return (
      <div>
        <Page>
          <div>
            <NavBar signOut={logout} />
            <SideBarComponent name={'Examples'} groups={sidebarGroups} />
            {/* Regular Content */}
            <Content>
              <Switch location={isModal ? this.previousLocation : location}>
                <Redirect exact from="/" to="/examples" />
                <Route path="/examples/create" component={ExamplesList} />
                <Route path="/examples/:exampleId" component={ExamplesShow} />
                <Route path="/examples" component={ExamplesList} />
              </Switch>
            </Content>
          </div>
        </Page>
        {/* Side Panel Content Here */}
        <Switch>
          <SidePanelRoute path="/examples/create" component={ExamplesCreate} />
          <SidePanelRoute path="/examples/:exampleId/edit" component={ExamplesEdit} />
          <SidePanelRoute path="/examples/:exampleId/delete" component={ExamplesDelete} />
        </Switch>
      </div>
    );
  };

  render() {
    const { location } = this.props;
    return (
      <AuthTokenValidator>
        <Authorized location={location} render={this.renderWithAuthorization} />
      </AuthTokenValidator>
    );
  }
}

Routes.propTypes = {
  // eslint-disable-next-line
  location: PropTypes.shape({
    state: PropTypes.shape({
      modal: PropTypes.bool,
    }),
  }),
};

export default Routes;
