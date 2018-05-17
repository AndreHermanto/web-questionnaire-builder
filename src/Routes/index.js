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
  redirectToLogout,
} from 'web-components';
import QuestionnairesList from '../Questionnaires/QuestionnairesList';
import QuestionnairesShow from '../Questionnaires/QuestionnairesShow';
import QuestionnairesFileImport from '../Questionnaires/QuestionnairesForm/QuestionnairesFileImport';
import ReleaseReportsList from '../ReleaseReports/ReleaseReportsList';
import OntologiesList from '../Ontologies/OntologiesList';
import OntologiesShow from '../Ontologies/OntologiesShow';
import OntologiesDelete from '../Ontologies/OntologiesDelete';
import OntologyCreate from '../Ontologies/forms/Create';
import OntologyEdit from '../Ontologies/forms/Edit';
import ElementsList from '../Elements/ElementsList';
import ElementsShow from '../Elements/ElementsShow';
import VersionActivateForm from '../Ontologies/forms/VersionActivateForm';
import DiffReportForm from '../Ontologies/forms/DiffReportForm';
import QuestionnaireFoldersList from '../QuestionnaireFolders/QuestionnaireFoldersList';
import Page404 from '../page404';

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
        url: '/questionnaires',
        icon: 'assignment',
      },
      {
        name: 'Release reports',
        url: '/releases',
        icon: 'unarchive',
      },
      {
        name: 'Ontology',
        url: '/ontologies',
        icon: 'view_list',
      },
      {
        name: 'Elements',
        url: '/elements',
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
            <NavBar signOut={redirectToLogout} />
            <SideBarComponent name={'Questionnaires Builder'} groups={sidebarGroups} />
            {/* Regular Content */}
            <Content>
              <Switch location={isModal ? this.previousLocation : location}>
                <Redirect exact from="/" to="/questionnaires" />
                <Route
                  path="/questionnaires/:id/versions/:currentVersionId"
                  component={QuestionnairesShow}
                />
                <Route path="/questionnaires" component={QuestionnairesList} />
                <Route path="/releases" component={ReleaseReportsList} />
                <Route path="/ontologies/:ontologyId" component={OntologiesShow} />
                <Route path="/ontologies/:ontologyId/:method" component={OntologiesShow} />
                <Route path="/ontologies/" component={OntologiesList} />
                <Route path="/folders/:folderId" component={QuestionnaireFoldersList} />
                <Route path="/elements/:elementId" component={ElementsShow} />
                <Route path="/elements" component={ElementsList} />
                <Route component={Page404} />
              </Switch>
            </Content>
          </div>
        </Page>
        {/* Side Panel Content Here */}
        <Switch>
          <SidePanelRoute path="/releases/create" component={() => <div />} />
          <SidePanelRoute path="/ontologies/create" component={OntologyCreate} />
          <SidePanelRoute path="/ontologies/:ontologyId/edit" component={OntologyEdit} />
          <SidePanelRoute path="/ontologies/:ontologyId/delete" component={OntologiesDelete} />
          <SidePanelRoute path="/ontologies/:ontologyId/activate" component={VersionActivateForm} />
          <SidePanelRoute path="/ontologies/:ontologyId/diff-report" component={DiffReportForm} />
          <SidePanelRoute path="/questionnaires/import-file" component={QuestionnairesFileImport} />
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
