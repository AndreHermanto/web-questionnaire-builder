import 'core-js/shim';
import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { apiMiddleware } from 'redux-api-middleware';
import { errorHandleMiddleware, normalizrMiddleware } from './middlewares';
import { authMiddleware } from 'web-components';
import App from './App';
import reducer from './reducers';
import './index.css';

// redux
const middleware = [
  thunk,
  apiMiddleware,
  normalizrMiddleware,
  authMiddleware,
  errorHandleMiddleware
];

if (process.env.REACT_APP_ENABLE_LOGS === 'true') {
  const logger = createLogger();
  middleware.push(logger);
}

// create patient portal store
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware)) // add logging in as middleware
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
