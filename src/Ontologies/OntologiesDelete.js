import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation } from 'web-components';
import { ontologySchema } from './schemas';

const OntologiesDelete = (props) => {
  const {
    closePanel,
    history,
    match: {
      params: { ontologyId },
    },
  } = props;
  return (
    <Mutation
      resourceName="ontologies"
      url={`/datasources/${ontologyId}`}
      schema={ontologySchema}
      post={() => history.push('/ontologies')}
      render={({ remove, loading }) => {
        if (loading) {
          return <div>loading...</div>;
        }
        return (
          <Confirmation
            title="Delete Ontology?"
            content="Deleting an ontology will remove it from the system forever."
            confirmLabel="Yes, Delete Ontology"
            cancelLabel="No"
            onConfirm={() => remove(ontologyId)}
            onCancel={closePanel}
          />
        );
      }}
    />
  );
};
OntologiesDelete.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      ontologyId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default OntologiesDelete;
