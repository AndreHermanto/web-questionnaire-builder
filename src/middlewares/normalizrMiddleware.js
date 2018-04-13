import { normalize } from 'normalizr';
import get from 'lodash.get';

const normalizrMiddleware = () => next => (action) => {
  if (action.error || !action.payload) {
    return next(action);
  }

  let payload = action.payload.data ? action.payload.data : action.payload;
  let metadata;

  if (get(action.payload, 'data.metadata.totalPages') >= 0) {
    payload = action.payload.data.results;
    metadata = action.payload.data.metadata;
  }

  const schema = action.meta && action.meta.schema;
  if (schema) {
    payload = normalize(payload, schema);
  }
  return next({ ...action, payload, metadata });
};

export default normalizrMiddleware;
