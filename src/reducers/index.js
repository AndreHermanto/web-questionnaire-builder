import { combineReducers } from 'redux-immutable';
import { Helpers, authReducer } from 'web-components';
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
]);
const exampleReducer = combineReducers({
  form: formReducer,
  resources: combineReducers(resourceReducers),
  authentication: authReducer,
});

export default exampleReducer;
