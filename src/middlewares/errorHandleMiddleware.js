import { logout, removeJwt } from 'web-components';

export const errorHandleMiddleware = store => next => action => {
  if (
    action &&
    action.error &&
    action.payload &&
    action.payload.status === 401
  ) {
    logout();
    return;
  }else if (
    action &&
    action.error &&
    action.payload &&
    action.payload.status === 500
  ) {
    removeJwt();
    return;
  }

  return next(action);
};
