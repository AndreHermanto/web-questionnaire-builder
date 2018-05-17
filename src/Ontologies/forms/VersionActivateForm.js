import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Confirmation } from 'web-components';
import { ontologySchema } from '../schemas';

/* eslint class-methods-use-this: 0 */
/* eslint no-case-declarations: 0 */
function VersionActivateForm({
  history,
  closePanel,
  match: {
    params: { ontologyId, versionId },
  },
}) {
  return (
    <Mutation
      resourceName="ontologies"
      url={`/datasources/${ontologyId}/activeVersion`}
      schema={ontologySchema}
      post={() => history.push(`/ontologies/${ontologyId}`)}
      render={({ update, loading: updateLoading }) => {
        if (updateLoading) {
          return <div>loading...</div>;
        }
        return (
          <Confirmation
            title="Activate"
            content="Activating a new ontology version may lead to data loss due to concepts being retired. Do you want to proceed?"
            confirmLabel="Activate"
            cancelLabel="No"
            onConfirm={() => update({ versionId })}
            onCancel={closePanel}
          />
        );
      }}
    />
  );
}

VersionActivateForm.propTypes = {
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

export default VersionActivateForm;
