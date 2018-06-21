import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import get from 'lodash.get';
import {
  Authorized,
  AuthTokenValidator,
  RedirectToLogin,
  Page,
  NavBar,
  SideBarComponent,
  Content,
  SidePanelRoute,
  redirectToLogout,
} from 'web-components';
import ExamplesList from '../Examples/ExamplesList';
import ExamplesShow from '../Examples/ExamplesShow';
import ExamplesEdit from '../Examples/ExamplesEdit';
import ExamplesCreate from '../Examples/ExamplesCreate';
import ExamplesDelete from '../Examples/ExamplesDelete';
import Page404 from '../page404';

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
  static getDerivedStateFromProps(props) {
    // set location if props.location is not modal
    if (!get(props, 'location.state.modal', false)) {
      return {
        location: props.location,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      location: this.props.location,
    };
  }

  renderWithAuthorization = ({ me }) => {
    if (!me) {
      return <RedirectToLogin />;
    }
    const { location } = this.state;

    return (
      <div>
        <Page>
          <div>
            <NavBar signOut={redirectToLogout} />
            <SideBarComponent name={'Examples'} groups={sidebarGroups} />
            {/* Regular Content */}
            <Content>
              <Switch location={location}>
                <Redirect exact from="/" to="/examples" />
                <Route path="/examples/create" component={ExamplesList} />
                <Route path="/examples/:exampleId" component={ExamplesShow} />
                <Route path="/examples" component={ExamplesList} />
                <Route component={Page404} />
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
