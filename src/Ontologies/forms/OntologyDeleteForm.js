import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation } from 'web-components';
import { ontologySchema } from '../schemas';

/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */
function OntologyDeleteForm({
  history,
  closePanel,
  match: {
    params: { ontologyId },
  },
}) {
  return (
    <Mutation
      resourceName="ontologies"
      url={`/datasources/${ontologyId}`}
      schema={ontologySchema}
      post={() => history.push('/ontologies/')}
      render={({ remove, loading: updateLoading }) => {
        if (updateLoading) {
          return <div>loading...</div>;
        }
        return (
          <Confirmation
            title="Ontology"
            content="Are you sure you want to delete this questionnaire (including all versions)?"
            confirmLabel="Yes"
            cancelLabel="No"
            onConfirm={() => remove(ontologyId)}
            onCancel={closePanel}
          />
        );
      }}
    />
  );
}

OntologyDeleteForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  closePanel: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      versionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default OntologyDeleteForm;
