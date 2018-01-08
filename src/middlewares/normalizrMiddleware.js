import { normalize } from 'normalizr';

export const normalizrMiddleware = store => next => action => {
  if (!action.error && action.payload) {
    let payload = action.payload.data ? action.payload.data : action.payload;

    const schema = action.meta && action.meta.schema;

    if (schema) {
      payload = normalize(payload, schema);
    }

    action = { ...action, payload };
  }

  return next(action);
};
