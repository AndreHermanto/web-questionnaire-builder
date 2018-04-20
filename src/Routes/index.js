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
} from 'web-components';
import ExamplesList from '../Examples/ExamplesList';
import QuestionnairesList from '../Questionnaires/QuestionnairesList';

const sidebarGroups = [
  {
    name: '',
    elements: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'home',
      },
      {
        name: 'Questionnaires',
        url: '/questionnaires/filter/view',
        icon: 'assignment',
      },
      {
        name: 'Releases',
        url: '/releases',
        icon: 'unarchive',
      },
      {
        name: 'Ontology',
        url: '/ontology',
        icon: 'view_list',
      },
    ],
  },
  {
    name: 'Platform',
    elements: [
      {
        name: 'Pricing plans',
        url: '/pricingPlans',
        icon: 'layers',
      },
      {
        name: 'Landing page',
        url: '/landingPage',
        icon: 'web_asset',
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
            <NavBar signOut={() => {}} />
            <SideBarComponent name={'Questionnaires Builder'} groups={sidebarGroups} />
            {/* Regular Content */}
            <Content>
              <Switch location={isModal ? this.previousLocation : location}>
                <Redirect exact from="/" to="/dashboard" />
                <Redirect exact from="/questionnaires" to="/questionnaires/filter/review" />
                <Route path="/questionnaires/filter/:filterType" component={QuestionnairesList} />
                <Route path="/dashboard" component={ExamplesList} />
              </Switch>
            </Content>
          </div>
        </Page>
        {/* Side Panel Content Here */}
        <Switch>
          <SidePanelRoute path="/examples/create" component={ExamplesList} />
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
