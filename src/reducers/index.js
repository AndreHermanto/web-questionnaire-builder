import { combineReducers } from 'redux-immutable';
import { Helpers, authReducer, appNavigationReducer } from 'web-components';
import { reducer as formReducer } from 'redux-form/immutable';

/**
 * @return collection of reducers
 */
const resourceReducers = Helpers.makeResourceReducers([
  'questionnaires',
  'folders',
  'releaseReports',
  'ontologies',
  'ontologyVersions',
  'questionnaireFolders',
  'versions',
  'diffReports',
]);
const exampleReducer = combineReducers({
  form: formReducer,
  resources: combineReducers(resourceReducers),
  authentication: authReducer,
  appNavigation: appNavigationReducer,
});

export default exampleReducer;
