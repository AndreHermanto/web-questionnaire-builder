import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation } from 'web-components';
import { elementSchema } from './schemas';

const ElementsDelete = (props) => {
  const {
    closePanel,
    history,
    match: {
      params: { elementId },
    },
  } = props;
  return (
    <Mutation
      resourceName="elements"
      url={`/elements/${elementId}`}
      schema={elementSchema}
      post={() => history.push('/elements')}
      render={({ remove, loading }) => {
        if (loading) {
          return <div>loading...</div>;
        }
        return (
          <Confirmation
            title="Delete Element?"
            content="Deleting an element will remove it from the system forever?"
            confirmLabel="Yes, Delete Element"
            cancelLabel="No"
            onConfirm={() => remove(elementId)}
            onCancel={closePanel}
          />
        );
      }}
    />
  );
};
ElementsDelete.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      elementId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ElementsDelete;
