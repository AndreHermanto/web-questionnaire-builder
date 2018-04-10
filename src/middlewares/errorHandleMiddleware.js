export const errorHandleMiddleware = store => next => action => {
  if (
    action &&
    action.error &&
    action.payload &&
    action.payload.status === 500 {
    return;
  }

  return next(action);
};
