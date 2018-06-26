import { combineReducers } from 'redux-immutable';
import { Helpers, authReducer, appNavigationReducer } from 'web-components';
import { reducer as formReducer } from 'redux-form/immutable';

/**
 * @return collection of reducers
 */
const resourceReducers = Helpers.makeResourceReducers([
  'questionnaires',
  'importedQuestionnaire',
  'folders',
  'releases',
  'releaseReports',
  'ontologies',
  'ontologyVersions',
  'questionnaireFolders',
  'versions',
  'diffReports',
  'elements',
  'consentTypes',
  'headingsData',
  'pricePlans',
  'pricePlanMappings',
  'answers',
  'users',
  'previewResponses',
  'encryptedToken',
  'conceptTerms',
  'prefixTerms',
  'glossaryTerms',
  'traits',
  'applications',
  'questionnaireTags',
  'tags',
  'applications',
  'context',
]);
const exampleReducer = combineReducers({
  form: formReducer,
  resources: combineReducers(resourceReducers),
  authentication: authReducer,
  appNavigation: appNavigationReducer,
});

export default exampleReducer;
