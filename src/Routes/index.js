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
import QuestionnaireElementReOrder from '../Questionnaires/QuestionnaireElementReOrder';
import QuestionnairesDelete from '../Questionnaires/QuestionnairesDelete';
import QuestionnairesFileImport from '../Questionnaires/QuestionnairesForm/QuestionnairesFileImport';
import QuestionnairesVersionFileImport from '../Questionnaires/QuestionnairesForm/QuestionnairesVersionFileImport';
import QuestionnairesDuplicate from '../Questionnaires/QuestionnairesForm/QuestionnairesDuplicate';
import QuestionnairesExport from '../Questionnaires/QuestionnairesForm/QuestionnairesExport';
import QuestionnairesCreate from '../Questionnaires/QuestionnairesForm/QuestionnairesCreate';
import QuestionnairesMoveToFolder from '../Questionnaires/QuestionnairesForm/QuestionnairesMoveToFolder';
import QuestionnairesResponsesReport from '../Questionnaires/QuestionnairesForm/QuestionnairesResponsesReport';
import QuestionnairesPreviewAsPatient from '../Questionnaires/QuestionnairesForm/QuestionnairesPreviewAsPatient';
import ReleaseReportsList from '../ReleaseReports/ReleaseReportsList';
import ReleaseReportsShow from '../ReleaseReports/ReleaseReportsShow';
import OntologiesList from '../Ontologies/OntologiesList';
import OntologiesShow from '../Ontologies/OntologiesShow';
import OntologiesVersionsShow from '../Ontologies/OntologiesVersionsShow';
import OntologiesVersionsDiffReportShow from '../Ontologies/OntologiesVersionsDiffReportShow';
import OntologyCreate from '../Ontologies/forms/OntologyCreate';
import OntologyEdit from '../Ontologies/forms/OntologyEdit';
import ElementsShow from '../Elements/ElementsShow';
import ElementsEdit from '../Elements/ElementsEdit';
import ElementsDelete from '../Elements/ElementsDelete';
import ElementsDuplicate from '../Elements/ElementsDuplicate';
import ElementsAddImage from '../Elements/ElementsAddImage';
import ElementsLogicEdit from '../Elements/ElementsLogicEdit';
import ValidationLogic from '../Elements/Forms/ValidationLogic';
import ElementsAddHeader from '../Elements/ElementsAddHeader';
import ElementsOntologyTagging from '../Elements/OntologyTagging/ElementsOntologyTagging';
import AnswersAddImage from '../Elements/AnswersAddImage';
import AnswersFollowUp from '../Elements/AnswersFollowUp';
import VersionActivateForm from '../Ontologies/forms/VersionActivateForm';
import OntologyDeleteForm from '../Ontologies/forms/OntologyDeleteForm';
import QuestionnaireFoldersList from '../QuestionnaireFolders/QuestionnaireFoldersList';
import QuestionnaireFoldersCreate from '../QuestionnaireFolders/QuestionnaireFoldersCreate';
import QuestionnaireFoldersEdit from '../QuestionnaireFolders/QuestionnaireFoldersEdit';
import LandingPageList from '../LandingPage/LandingPageList';
import LandingPageShow from '../LandingPage/LandingPageShow';
import LandingPageEdit from '../LandingPage/LandingPageEdit';
import UploadOntologyVersion from '../Ontologies/UploadOntologyVersion';
import PricePlanMappingsList from '../PricePlanMappings/PricePlanMappingsList';
import PricePlanMappingsDelete from '../PricePlanMappings/PricePlanMappingsDelete';
import PricePlanMappingsShow from '../PricePlanMappings/PricePlanMappingsShow';
import PricePlanMappingsCreate from '../PricePlanMappings/PricePlanMappingsCreate';
import QuestionnaireFoldersDelete from '../QuestionnaireFolders/QuestionnaireFoldersDelete';
import Page404 from '../page404';
import ElementsCreate from '../Elements/ElementsCreate';

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
        url: '/release-reports',
        icon: 'unarchive',
      },
      {
        name: 'Ontology',
        url: '/ontologies',
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
                  path="/questionnaires/:questionnaireId/elements/:elementId"
                  component={ElementsShow}
                />
                <Route path="/questionnaires/:questionnaireId" component={QuestionnairesShow} />
                <Route path="/questionnaires" component={QuestionnairesList} />
                <Route path="/release-reports/:releaseReportId" component={ReleaseReportsShow} />
                <Route path="/release-reports" component={ReleaseReportsList} />
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
                <Route
                  path="/questionnaires/:questionnaireId/elements/create"
                  component={QuestionnairesShow}
                />
                <Route
                  path="/questionnaires/:questionnaireId/elements/:elementId"
                  component={ElementsShow}
                />
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
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/versions/:currentVersionId/move-to-folder"
            component={QuestionnairesMoveToFolder}
          />

          <SidePanelRoute path="/questionnaires/import-file" component={QuestionnairesFileImport} />
          <SidePanelRoute path="/questionnaires/create" component={QuestionnairesCreate} />
          <SidePanelRoute
            path="/questionnaires/:id/versions/:currentVersionId/duplicate"
            component={QuestionnairesDuplicate}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/versions/:currentVersionId/import-version"
            component={QuestionnairesVersionFileImport}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/create"
            component={ElementsCreate}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/section-add"
            component={ElementsAddHeader}
          />
          <SidePanelRoute
            path="/questionnaires/:id/elements/:elementid/reorder"
            component={QuestionnaireElementReOrder}
          />

          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/edit"
            component={ElementsEdit}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/edit"
            component={ElementsEdit}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/delete"
            component={ElementsDelete}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/duplicate"
            component={ElementsDuplicate}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/add-image"
            component={ElementsAddImage}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/edit-logic"
            component={ElementsLogicEdit}
          />

          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/answers/:answerId/add-image"
            component={AnswersAddImage}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/answers/:answerId/follow-up"
            component={AnswersFollowUp}
          />

          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/answers/:answerId/add-validation"
            component={ValidationLogic}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/elements/:elementId/answers/:answerId/ontology-tagging"
            component={ElementsOntologyTagging}
          />
          <SidePanelRoute
            path="/landing-page/consents/:consentTypeId/edit"
            component={LandingPageEdit}
          />
          <SidePanelRoute path="/price-plan-mappings/create" component={PricePlanMappingsCreate} />
          <SidePanelRoute
            path="/price-plan-mappings/:pricePlanMappingId/delete"
            component={PricePlanMappingsDelete}
          />
          <SidePanelRoute path="/folders/:folderId/delete" component={QuestionnaireFoldersDelete} />
          <SidePanelRoute path="/questionnaires/:id/delete" component={QuestionnairesDelete} />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/versions/:currentVersionId/export"
            component={QuestionnairesExport}
          />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/versions/:currentVersionId/generate-responses-report"
            component={QuestionnairesResponsesReport}
          />
          <SidePanelRoute path="/folders/create" component={QuestionnaireFoldersCreate} />
          <SidePanelRoute path="/folders/:folderId/edit" component={QuestionnaireFoldersEdit} />
          <SidePanelRoute
            path="/questionnaires/:questionnaireId/versions/:currentVersionId/user/:userId/preview-patient"
            component={QuestionnairesPreviewAsPatient}
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
