import { logout } from 'web-components';

export const errorHandleMiddleware = store => next => action => {
  if (
    action &&
    action.error &&
    action.payload &&
    action.payload.status === 401
  ) {
    logout();
    return;
  }

  return next(action);
};
