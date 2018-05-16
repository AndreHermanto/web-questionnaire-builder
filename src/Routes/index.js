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
import OntologiesVersionsShow from '../Ontologies/OntologiesVersionsShow';
import OntologiesVersionsDiffReportShow from '../Ontologies/OntologiesVersionsDiffReportShow';
import OntologyCreate from '../Ontologies/forms/OntologyCreate';
import OntologyEdit from '../Ontologies/forms/OntologyEdit';
import ElementsList from '../Elements/ElementsList';
import ElementsShow from '../Elements/ElementsShow';
import ElementsEdit from '../Elements/ElementsEdit';
import ElementsLogicEdit from '../Elements/ElementsLogicEdit';
import VersionActivateForm from '../Ontologies/forms/VersionActivateForm';
import OntologyDeleteForm from '../Ontologies/forms/OntologyDeleteForm';
import QuestionnaireFoldersList from '../QuestionnaireFolders/QuestionnaireFoldersList';
import LandingPageList from '../LandingPage/LandingPageList';
import LandingPageShow from '../LandingPage/LandingPageShow';
import LandingPageEdit from '../LandingPage/LandingPageEdit';
import UploadOntologyVersion from '../Ontologies/UploadOntologyVersion';
import PricePlanMappingsList from '../PricePlanMappings/PricePlanMappingsList';
import PricePlanMappingsDelete from '../PricePlanMappings/PricePlanMappingsDelete';
import PricePlanMappingsShow from '../PricePlanMappings/PricePlanMappingsShow';
import PricePlanMappingsCreate from '../PricePlanMappings/PricePlanMappingsCreate';
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
        url: '/price-plan-mappings',
        icon: 'layers',
      },
      {
        name: 'Landing page',
        url: '/landing-page',
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
                <Route
                  path="/ontologies/:ontologyId/versions/:versionId/diff-report"
                  component={OntologiesVersionsDiffReportShow}
                />
                <Route
                  path="/ontologies/:ontologyId/versions/:versionId/:methods"
                  component={OntologiesVersionsShow}
                />
                <Route
                  path="/ontologies/:ontologyId/versions/:versionId"
                  component={OntologiesVersionsShow}
                />
                <Route path="/ontologies/:ontologyId" component={OntologiesShow} />
                <Route path="/ontologies/" component={OntologiesList} />
                <Route path="/folders/:folderId" component={QuestionnaireFoldersList} />
                <Route path="/elements/:elementId" component={ElementsShow} />
                <Route path="/elements" component={ElementsList} />
                <Route path="/landing-page/consents/:consentTypeId" component={LandingPageShow} />
                <Route path="/landing-page" component={LandingPageList} />
                <Route
                  path="/price-plan-mappings/:pricePlanMappingId"
                  component={PricePlanMappingsShow}
                />
                <Route path="/price-plan-mappings" component={PricePlanMappingsList} />
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
          <SidePanelRoute
            path="/ontologies/:ontologyId/versions/:versionId/activate"
            component={VersionActivateForm}
          />
          <SidePanelRoute path="/ontologies/:ontologyId/delete" component={OntologyDeleteForm} />
          <SidePanelRoute path="/ontologies/:ontologyId/activate" component={VersionActivateForm} />
          <SidePanelRoute path="/ontologies/:ontologyId/upload" component={UploadOntologyVersion} />
          <SidePanelRoute path="/questionnaires/import-file" component={QuestionnairesFileImport} />
          <SidePanelRoute path="/elements/:elementId/edit" component={ElementsEdit} />
          <SidePanelRoute path="/elements/:elementId/edit-logic" component={ElementsLogicEdit} />
          <SidePanelRoute
            path="/landing-page/consents/:consentTypeId/edit"
            component={LandingPageEdit}
          />
          <SidePanelRoute path="/price-plan-mappings/create" component={PricePlanMappingsCreate} />
          <SidePanelRoute
            path="/price-plan-mappings/:pricePlanMappingId/delete"
            component={PricePlanMappingsDelete}
          />
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
