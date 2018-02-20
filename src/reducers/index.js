import { combineReducers } from 'redux-immutable';
import { Helpers, authReducer } from 'web-components';
import { reducer as formReducer } from 'redux-form/immutable';

/**
 * @return collection of reducers
 */
const resourceReducers = Helpers.makeResourceReducers(['examples']);
const exampleReducer = combineReducers({
  form: formReducer,
  ...resourceReducers,
  authentication: authReducer,
});

export default exampleReducer;
