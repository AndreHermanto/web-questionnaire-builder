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
  'releaseReports',
  'ontologies',
  'ontologyVersions',
  'questionnaireFolders',
  'versions',
  'diffReports',
  'elements',
]);
const exampleReducer = combineReducers({
  form: formReducer,
  resources: combineReducers(resourceReducers),
  authentication: authReducer,
  appNavigation: appNavigationReducer,
});

export default exampleReducer;
